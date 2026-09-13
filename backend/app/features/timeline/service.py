from datetime import datetime, date, timedelta, timezone
from typing import List, Dict, Any, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.features.profiles.models import StudentProfile
from app.features.discovery.models import ShortlistedProgram, Program, University
from app.features.content.models import Country
from app.features.timeline.models import StudentMilestone
from app.features.timeline.schemas import (
    MilestoneItemRead,
    ProgramDeadlineItem,
    TimelineSummaryRead,
    MilestoneUpdatePayload,
)


def get_default_milestones_def(intake_season: str, intake_year: int) -> List[Dict[str, Any]]:
    # Normalize season
    season = (intake_season or "Fall").strip().capitalize()
    year = intake_year or (datetime.now(timezone.utc).year + 1)

    if season == "Spring":
        anchor = date(year, 1, 15)
        return [
            {
                "milestone_key": "ielts_target",
                "title": "1. IELTS / Language Exam Target Date & HEC Verification",
                "description": "Take IELTS/PTE test or confirm MOI waiver. Initiate HEC degree scrutiny on e-portal.",
                "target_date": date(year - 1, 6, 15).isoformat(),
                "pakistani_guidance_tip": "Book your exam slot 3 weeks ahead. If using MOI, get your Pakistani university registrar letter ready.",
                "category": "exam",
            },
            {
                "milestone_key": "app_submission",
                "title": "2. University Application Submission Cutoff",
                "description": "Submit online applications with Statement of Purpose (SOP), 2 Academic LORs, and transcripts.",
                "target_date": date(year - 1, 9, 30).isoformat(),
                "pakistani_guidance_tip": "Spring admissions fill up rapidly with smaller class cohorts. Apply early for faster conditional offers.",
                "category": "admission",
            },
            {
                "milestone_key": "tuition_deposit",
                "title": "3. Initial Tuition Deposit & Unconditional Offer",
                "description": "Accept offer, pay required tuition deposit via bank wire / Flywire to request visa CAS or I-20.",
                "target_date": date(year - 1, 11, 1).isoformat(),
                "pakistani_guidance_tip": "Use State Bank of Pakistan (SBP) student foreign remittance or 1Link banking; allow 3-5 days for international clearance.",
                "category": "admission",
            },
            {
                "milestone_key": "bank_balance_start",
                "title": "4. Mandatory 28-Day Bank Balance Start Date",
                "description": "CRITICAL: Funds must enter and remain untouched in the bank for a minimum of 28 consecutive days before visa filing.",
                "target_date": date(year - 1, 10, 15).isoformat(),
                "pakistani_guidance_tip": "Mandatory UKVI & European embassy financial rule: balance must NEVER dip below the required threshold even for one day.",
                "category": "finance",
            },
            {
                "milestone_key": "visa_filing",
                "title": "5. CAS & Visa Filing Window & Biometrics Appointment",
                "description": "File online student visa application, book Gerry's / VFS appointment, and complete IOM TB screening.",
                "target_date": date(year - 1, 11, 25).isoformat(),
                "pakistani_guidance_tip": "Book Gerry's / VFS biometrics slot immediately upon CAS release. Spring visa processing takes 3-4 weeks.",
                "category": "visa",
            },
        ]
    else:
        # Fall Intake (September 1)
        anchor = date(year, 9, 1)
        return [
            {
                "milestone_key": "ielts_target",
                "title": "1. IELTS / Language Exam Target Date & HEC Verification",
                "description": "Take IELTS/PTE test or confirm MOI waiver eligibility. Initiate HEC degree verification.",
                "target_date": date(year - 1, 11, 15).isoformat(),
                "pakistani_guidance_tip": "Book your exam slot 3 weeks ahead. If using MOI waiver, ensure your Pakistani university English letter is signed.",
                "category": "exam",
            },
            {
                "milestone_key": "app_submission",
                "title": "2. University Application Submission Cutoff",
                "description": "Submit complete university applications including SOP, 2 Academic LORs, and degree transcripts.",
                "target_date": date(year, 2, 15).isoformat(),
                "pakistani_guidance_tip": "UK and European scholarship priority deadlines close between January and March. Early applications get priority.",
                "category": "admission",
            },
            {
                "milestone_key": "tuition_deposit",
                "title": "3. Initial Tuition Deposit & Unconditional Offer",
                "description": "Fulfill all academic conditions, accept offer, and pay initial tuition deposit to trigger CAS / I-20.",
                "target_date": date(year, 5, 15).isoformat(),
                "pakistani_guidance_tip": "Pay via State Bank of Pakistan student foreign remittance or Flywire/Convera; allow 4 working days for bank clearance.",
                "category": "admission",
            },
            {
                "milestone_key": "bank_balance_start",
                "title": "4. Mandatory 28-Day Bank Balance Start Date",
                "description": "CRITICAL: Funds must enter and remain untouched in the bank for a minimum of 28 consecutive days before visa submission.",
                "target_date": date(year, 5, 25).isoformat(),
                "pakistani_guidance_tip": "Embassy financial rule: maintain full tuition + 9-month living costs in a recognized Pakistani bank without any dips.",
                "category": "finance",
            },
            {
                "milestone_key": "visa_filing",
                "title": "5. CAS & Visa Filing Window & Biometrics Appointment",
                "description": "Submit online visa application, book Gerry's / VFS Global biometrics, and attend IOM TB clinic.",
                "target_date": date(year, 7, 10).isoformat(),
                "pakistani_guidance_tip": "Peak summer rush in Islamabad, Lahore, and Karachi: book your Gerry's appointment the moment your CAS is received.",
                "category": "visa",
            },
        ]


def parse_date_safely(date_str: str) -> Optional[date]:
    for fmt in ("%Y-%m-%d", "%d %b %Y", "%d %B %Y", "%b %Y"):
        try:
            return datetime.strptime(date_str.strip(), fmt).date()
        except ValueError:
            pass
    return None


async def calculate_timeline_summary(session: AsyncSession, user_id: int) -> TimelineSummaryRead:
    # 1. Fetch Student Profile
    p_res = await session.execute(
        select(StudentProfile).where(StudentProfile.user_id == user_id)
    )
    profile = p_res.scalar_one_or_none()

    intake_season = "Fall"
    intake_year = 2027

    if profile:
        raw_intake = getattr(profile, "target_intake", "") or ""
        if isinstance(raw_intake, str) and raw_intake.strip():
            raw_lower = raw_intake.lower()
            if "spring" in raw_lower:
                intake_season = "Spring"
            elif "summer" in raw_lower:
                intake_season = "Summer"
            else:
                intake_season = "Fall"

            import re
            year_match = re.search(r"20\d\d", raw_intake)
            if year_match:
                try:
                    intake_year = int(year_match.group(0))
                except Exception:
                    pass

    intake_season = intake_season.capitalize()
    intake_label = f"{intake_season} {intake_year}"

    anchor_date = date(intake_year, 1, 15) if intake_season == "Spring" else date(intake_year, 9, 1)
    today = datetime.now(timezone.utc).date()
    days_until_intake = max(0, (anchor_date - today).days)

    # 2. Fetch or initialize milestones from database
    m_res = await session.execute(
        select(StudentMilestone).where(StudentMilestone.user_id == user_id)
    )
    saved_milestones = {m.milestone_key: m for m in m_res.scalars().all()}

    default_defs = get_default_milestones_def(intake_season, intake_year)
    milestone_items: List[MilestoneItemRead] = []

    for item in default_defs:
        key = item["milestone_key"]
        saved = saved_milestones.get(key)

        is_completed = saved.is_completed if saved else False
        completed_at = saved.completed_at if saved else None
        target_date_str = saved.target_date if saved else item["target_date"]
        notes = saved.notes if saved else None
        db_id = saved.id if saved else None

        t_date = parse_date_safely(target_date_str) or anchor_date
        days_left = (t_date - today).days

        if is_completed:
            status = "completed"
        elif days_left < 0:
            status = "passed"
        elif days_left <= 30:
            status = "due_soon"
        else:
            status = "upcoming"

        milestone_items.append(
            MilestoneItemRead(
                id=db_id,
                milestone_key=key,
                title=item["title"],
                description=item["description"],
                target_date=target_date_str,
                days_left=days_left,
                status=status,
                is_completed=is_completed,
                completed_at=completed_at,
                notes=notes,
                pakistani_guidance_tip=item["pakistani_guidance_tip"],
                category=item["category"],
            )
        )

    # 3. Fetch Shortlisted Program Deadlines
    sh_res = await session.execute(
        select(ShortlistedProgram, Program, University, Country)
        .join(Program, ShortlistedProgram.program_id == Program.id)
        .join(University, Program.university_id == University.id)
        .join(Country, University.country_id == Country.id)
        .where(ShortlistedProgram.user_id == user_id)
    )
    program_deadlines: List[ProgramDeadlineItem] = []
    for sh, prog, uni, ctry in sh_res.all():
        raw_deadline = (
            prog.application_deadline_fall
            if intake_season == "Fall"
            else prog.application_deadline_spring
        ) or prog.application_deadline_fall or "31 Jan 2027"

        p_date = parse_date_safely(raw_deadline) or anchor_date
        d_left = (p_date - today).days

        if d_left < 0:
            p_status = "Passed"
            badge_color = "bg-rose-50 text-rose-700 border-rose-200"
        elif d_left <= 30:
            p_status = f"{d_left} days left"
            badge_color = "bg-amber-50 text-amber-700 border-amber-200"
        else:
            p_status = f"{d_left} days left"
            badge_color = "bg-emerald-50 text-emerald-700 border-emerald-200"

        program_deadlines.append(
            ProgramDeadlineItem(
                program_id=prog.id,
                program_name=prog.name,
                university_name=uni.name,
                country_name=ctry.name,
                country_flag_emoji=ctry.flag_emoji,
                deadline_date=raw_deadline,
                days_left=d_left,
                status=p_status,
                badge_color=badge_color,
            )
        )

    # Sort deadlines by earliest first
    program_deadlines.sort(key=lambda x: x.days_left)

    completed_count = sum(1 for m in milestone_items if m.is_completed)

    return TimelineSummaryRead(
        target_intake_season=intake_season,
        target_intake_year=intake_year,
        intake_label=intake_label,
        anchor_date=anchor_date.isoformat(),
        days_until_intake=days_until_intake,
        completed_milestones=completed_count,
        total_milestones=len(milestone_items),
        milestones=milestone_items,
        program_deadlines=program_deadlines,
    )


async def update_milestone_status(
    session: AsyncSession,
    user_id: int,
    milestone_key: str,
    payload: MilestoneUpdatePayload,
) -> StudentMilestone:
    res = await session.execute(
        select(StudentMilestone).where(
            StudentMilestone.user_id == user_id,
            StudentMilestone.milestone_key == milestone_key,
        )
    )
    record = res.scalar_one_or_none()

    if not record:
        record = StudentMilestone(
            user_id=user_id,
            milestone_key=milestone_key,
            title=milestone_key.replace("_", " ").title(),
            target_date=payload.target_date or date.today().isoformat(),
            is_completed=payload.is_completed or False,
            completed_at=datetime.now(timezone.utc) if payload.is_completed else None,
            notes=payload.notes,
        )
        session.add(record)
    else:
        if payload.is_completed is not None:
            if payload.is_completed and not record.is_completed:
                record.completed_at = datetime.now(timezone.utc)
            elif not payload.is_completed:
                record.completed_at = None
            record.is_completed = payload.is_completed

        if payload.target_date is not None:
            record.target_date = payload.target_date

        if payload.notes is not None:
            record.notes = payload.notes

    await session.commit()
    await session.refresh(record)
    return record


async def generate_icalendar_content(session: AsyncSession, user_id: int) -> str:
    summary = await calculate_timeline_summary(session, user_id)
    now_str = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")

    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//UniCompass//Study Abroad Timeline Engine//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        f"X-WR-CALNAME:UniCompass {summary.intake_label} Timeline",
        "X-WR-TIMEZONE:Asia/Karachi",
    ]

    for m in summary.milestones:
        d = parse_date_safely(m.target_date)
        if not d:
            continue
        d_str = d.strftime("%Y%m%d")
        d_end = (d + timedelta(days=1)).strftime("%Y%m%d")
        lines.extend(
            [
                "BEGIN:VEVENT",
                f"UID:unicompass-{m.milestone_key}-{user_id}@unicompass.pk",
                f"DTSTAMP:{now_str}",
                f"DTSTART;VALUE=DATE:{d_str}",
                f"DTEND;VALUE=DATE:{d_end}",
                f"SUMMARY:UniCompass: {m.title}",
                f"DESCRIPTION:{m.description}\\n\\nPakistani Visa Tip: {m.pakistani_guidance_tip}",
                "STATUS:CONFIRMED",
                "BEGIN:VALARM",
                "TRIGGER:-P7D",
                "ACTION:DISPLAY",
                f"DESCRIPTION:Reminder: 7 days until {m.title}",
                "END:VALARM",
                "BEGIN:VALARM",
                "TRIGGER:-P2D",
                "ACTION:DISPLAY",
                f"DESCRIPTION:Urgent: 2 days until {m.title}",
                "END:VALARM",
                "END:VEVENT",
            ]
        )

    for p in summary.program_deadlines:
        d = parse_date_safely(p.deadline_date)
        if not d:
            continue
        d_str = d.strftime("%Y%m%d")
        d_end = (d + timedelta(days=1)).strftime("%Y%m%d")
        lines.extend(
            [
                "BEGIN:VEVENT",
                f"UID:unicompass-prog-{p.program_id}-{user_id}@unicompass.pk",
                f"DTSTAMP:{now_str}",
                f"DTSTART;VALUE=DATE:{d_str}",
                f"DTEND;VALUE=DATE:{d_end}",
                f"SUMMARY:Application Cutoff: {p.program_name} ({p.university_name})",
                f"DESCRIPTION:University Application Deadline for {p.program_name} at {p.university_name}, {p.country_name}.",
                "STATUS:CONFIRMED",
                "BEGIN:VALARM",
                "TRIGGER:-P7D",
                "ACTION:DISPLAY",
                f"DESCRIPTION:Upcoming Deadline: {p.program_name}",
                "END:VALARM",
                "END:VEVENT",
            ]
        )

    lines.append("END:VCALENDAR")
    return "\r\n".join(lines)
