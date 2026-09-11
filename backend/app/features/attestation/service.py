from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.features.attestation.models import AttestationRecord
from app.features.attestation.schemas import (
    AttestationStepRead,
    AttestationSummaryRead,
    AttestationStepUpdate,
    AttestationGuideItem,
)

CORE_GUIDELINES: Dict[str, Dict[str, Any]] = {
    "ibcc": {
        "step_key": "ibcc",
        "title": "IBCC Verification & Equivalency",
        "subtitle": "Matriculation (SSC) & Intermediate (HSSC) / O-Level & A-Level Certificates",
        "authority_name": "Inter Board Coordination Commission (IBCC), Pakistan",
        "portal_url": "https://attest.ibcc.edu.pk",
        "estimated_duration": "5 - 10 Business Days",
        "estimated_fee_pkr": "Rs 1,200 per original document, Rs 600 per copy",
        "requirements": [
            "Original SSC (Matric) Sanad / Certificate & Detailed Marks Sheet (DMC)",
            "Original HSSC (FSc / ICS / I.Com) Sanad & DMC",
            "Prior verification stamp from issuing BISE Board (Board of Intermediate & Secondary Education)",
            "For O/A Levels: Cambridge / Edexcel Statement of Results & Certificate + IBCC Equivalency Certificate",
            "Copy of student CNIC / B-Form and Father's CNIC",
        ],
        "procedure_steps": [
            "Step 1: First get your certificates verified from your respective local BISE Board (in a sealed envelope).",
            "Step 2: Create an account on the official IBCC Attestation Portal (attest.ibcc.edu.pk).",
            "Step 3: Fill application details, generate the 1Link/NBP fee challan, and pay via mobile banking or bank branch.",
            "Step 4: Select service mode: Walk-in appointment at IBCC office (Islamabad, Lahore, Karachi, Peshawar, Quetta, Bahawalpur) OR TCS Courier collection.",
            "Step 5: Receive QR-coded attested documents and verify online using the IBCC verification tool.",
        ],
        "important_note": "Crucial prerequisite: MOFA will NOT stamp your Matric and Inter certificates unless they already bear the original IBCC attestation QR code.",
    },
    "hec": {
        "step_key": "hec",
        "title": "HEC Degree & Transcript Attestation",
        "subtitle": "Bachelor's (14 & 16-Year), Master's, MS/MPhil & PhD Degrees",
        "authority_name": "Higher Education Commission (HEC), Pakistan",
        "portal_url": "https://eservices.hec.gov.pk",
        "estimated_duration": "7 - 15 Business Days",
        "estimated_fee_pkr": "Rs 1,000 per original document, Rs 700 per photocopy",
        "requirements": [
            "Original Degree and Official Consolidated Transcript / Mark Sheets",
            "All prior educational documents (Matric & Inter certificates for verification)",
            "Valid Pakistani CNIC / NICOP",
            "For foreign/international degrees: HEC Foreign Degree Equivalence Certificate",
        ],
        "procedure_steps": [
            "Step 1: Register on the HEC E-Services Portal (eservices.hec.gov.pk) and complete your profile.",
            "Step 2: Upload high-quality scanned copies of all degrees, transcripts, Matric/Inter certificates, and CNIC.",
            "Step 3: Submit application for online scrutiny. HEC scrutiny team reviews the documents (typically 2-4 days).",
            "Step 4: Once approved, download the fee challan, pay online via 1Link or designated bank, and schedule an appointment.",
            "Step 5: Choose TCS Courier service or Walk-in (Urgent) appointment at HEC Head Office Islamabad or Regional Centers (Lahore, Karachi, Peshawar, Quetta).",
            "Step 6: HEC affixes security ticket, barcode, and embossed seal on the reverse of the original degree.",
        ],
        "important_note": "Make sure your name and father's name on your university degree match your CNIC and Matric certificate letter-for-letter to avoid rejection.",
    },
    "mofa": {
        "step_key": "mofa",
        "title": "MOFA Legalization & Apostille Attestation",
        "subtitle": "Final Ministry of Foreign Affairs stamp required by Embassies & Consulates",
        "authority_name": "Ministry of Foreign Affairs (MOFA), Government of Pakistan",
        "portal_url": "https://apostille.mofa.gov.pk",
        "estimated_duration": "1 - 3 Business Days",
        "estimated_fee_pkr": "Rs 500 - 1,000 per document (via authorized couriers)",
        "requirements": [
            "All academic documents MUST already have prior IBCC and/or HEC stamps",
            "Original Pakistani CNIC / Smart Card",
            "Passport copy (first page with photo and signature)",
            "Police Character Certificate (if getting police clearance legalized)",
        ],
        "procedure_steps": [
            "Step 1: Check destination country: If your destination is a Hague Apostille Convention member, request an Apostille certificate on apostille.mofa.gov.pk.",
            "Step 2: If the country is not an Apostille member (or requires traditional consular legalization), traditional MOFA stamp is affixed.",
            "Step 3: MOFA strictly accepts applications through authorized courier companies (TCS, Leopards, Gerry's, OCS, M&P) or designated walk-in token counters at MOFA Islamabad & liaison offices.",
            "Step 4: Drop off your IBCC/HEC-attested originals with CNIC copies at the courier center.",
            "Step 5: Collect legalized documents with official security stickers and QR verification codes.",
        ],
        "important_note": "MOFA does not verify document authenticity independently; they verify the stamps of IBCC, HEC, and Boards. Do NOT submit un-attested certificates to MOFA.",
    },
    "police_passport": {
        "step_key": "police_passport",
        "title": "Police Clearance & Passport Readiness",
        "subtitle": "Character Certificate from Police Khidmat Markaz & Visa-Ready Passport",
        "authority_name": "Police Khidmat Markaz (PKM) & DGI&P Pakistan",
        "portal_url": "https://pkm.punjab.gov.pk",
        "estimated_duration": "3 - 5 Business Days",
        "estimated_fee_pkr": "Rs 350 - 500 (Police Certificate), Passport fee depends on validity",
        "requirements": [
            "Original CNIC & photocopy",
            "Valid Original Passport & photocopies (minimum 6-12 months validity remaining)",
            "2 Passport-size photographs with blue or white background",
            "Proof of residence / Authority letter (if residing outside permanent district address)",
        ],
        "procedure_steps": [
            "Step 1: Check your passport expiration date. For all study visa applications (UK, Germany, USA, Australia, Canada), your passport must be valid for at least 6 months beyond your intended stay.",
            "Step 2: Visit your local Police Khidmat Markaz (PKM) or Police Citizen Facilitation Center with original CNIC and passport copy.",
            "Step 3: Biometric enrollment, photo capture, and police verification through local Special Branch.",
            "Step 4: Receive SMS notification when the Character Certificate is ready for collection (usually 3 working days).",
            "Step 5: If required by your target embassy (e.g. Spain, Italy, Australia), get the Police Character Certificate attested by MOFA.",
        ],
        "important_note": "Police Character Certificates have a limited validity (usually 3 to 6 months from issuance date). Obtain this closer to your visa appointment.",
    },
}

STEP_ORDER = ["ibcc", "hec", "mofa", "police_passport"]


def build_step_read(record: AttestationRecord) -> AttestationStepRead:
    meta = CORE_GUIDELINES.get(record.step_key, {})
    return AttestationStepRead(
        id=record.id,
        user_id=record.user_id,
        step_key=record.step_key,
        status=record.status or "not_started",
        notes=record.notes,
        tracking_number=record.tracking_number,
        appointment_date=record.appointment_date,
        completed_at=record.completed_at,
        updated_at=record.updated_at,
        title=meta.get("title", record.step_key.upper()),
        subtitle=meta.get("subtitle", ""),
        authority_name=meta.get("authority_name", ""),
        portal_url=meta.get("portal_url", ""),
        estimated_duration=meta.get("estimated_duration", ""),
        estimated_fee_pkr=meta.get("estimated_fee_pkr", ""),
        requirements=meta.get("requirements", []),
        procedure_steps=meta.get("procedure_steps", []),
        important_note=meta.get("important_note"),
    )


async def get_or_create_student_attestation_steps(
    session: AsyncSession, user_id: int
) -> AttestationSummaryRead:
    # Query existing records
    res = await session.execute(
        select(AttestationRecord)
        .where(AttestationRecord.user_id == user_id)
    )
    existing_records = {r.step_key: r for r in res.scalars().all()}

    # Initialize any missing steps
    created_any = False
    for step_key in STEP_ORDER:
        if step_key not in existing_records:
            new_record = AttestationRecord(
                user_id=user_id,
                step_key=step_key,
                status="not_started",
            )
            session.add(new_record)
            existing_records[step_key] = new_record
            created_any = True

    if created_any:
        await session.commit()
        # Refresh to get IDs
        for rec in existing_records.values():
            await session.refresh(rec)

    # Order steps correctly
    ordered_steps: List[AttestationStepRead] = [
        build_step_read(existing_records[k]) for k in STEP_ORDER if k in existing_records
    ]

    total_steps = len(ordered_steps)
    completed_steps = sum(1 for s in ordered_steps if s.status == "completed")
    in_progress_steps = sum(1 for s in ordered_steps if s.status == "in_progress")
    completion_percentage = int((completed_steps / total_steps) * 100) if total_steps > 0 else 0

    return AttestationSummaryRead(
        total_steps=total_steps,
        completed_steps=completed_steps,
        in_progress_steps=in_progress_steps,
        completion_percentage=completion_percentage,
        steps=ordered_steps,
    )


async def update_student_attestation_step(
    session: AsyncSession,
    user_id: int,
    step_key: str,
    payload: AttestationStepUpdate,
) -> AttestationStepRead:
    res = await session.execute(
        select(AttestationRecord).where(
            AttestationRecord.user_id == user_id,
            AttestationRecord.step_key == step_key,
        )
    )
    record = res.scalar_one_or_none()
    if not record:
        record = AttestationRecord(
            user_id=user_id,
            step_key=step_key,
            status=payload.status or "not_started",
            notes=payload.notes,
            tracking_number=payload.tracking_number,
            appointment_date=payload.appointment_date,
        )
        if payload.status == "completed":
            record.completed_at = datetime.now(timezone.utc)
        session.add(record)
    else:
        if payload.status is not None:
            if payload.status == "completed" and record.status != "completed":
                record.completed_at = datetime.now(timezone.utc)
            elif payload.status != "completed":
                record.completed_at = None
            record.status = payload.status
        if payload.notes is not None:
            record.notes = payload.notes
        if payload.tracking_number is not None:
            record.tracking_number = payload.tracking_number
        if payload.appointment_date is not None:
            record.appointment_date = payload.appointment_date

    await session.commit()
    await session.refresh(record)
    return build_step_read(record)


def get_all_guidelines() -> List[AttestationGuideItem]:
    return [
        AttestationGuideItem(**data)
        for data in CORE_GUIDELINES.values()
    ]
