export interface RealtimeDeadlineInfo {
  diffDays: number;
  daysLeftText: string;
  badgeClass: string;
  isPassed: boolean;
  urgency: "passed" | "today" | "urgent" | "normal";
}

/**
 * Parses diverse deadline date formats (e.g. "31 Jan 2027", "2027-05-31", "15 Oct 2026")
 * and calculates exact real-time calendar day difference against current user date.
 */
export function calculateRealtimeDaysLeft(deadlineStr: string | null | undefined): RealtimeDeadlineInfo {
  if (!deadlineStr || !deadlineStr.trim()) {
    return {
      diffDays: 0,
      daysLeftText: "No cutoff set",
      badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
      isPassed: false,
      urgency: "normal",
    };
  }

  const cleaned = deadlineStr.trim();
  let targetDate: Date | null = null;

  // 1. Try native Date parse (handles ISO 2027-01-31)
  const nativeParsed = new Date(cleaned);
  if (!isNaN(nativeParsed.getTime())) {
    targetDate = nativeParsed;
  } else {
    // 2. Try parsing "31 Jan 2027" or "15 October 2026"
    const parts = cleaned.split(/\s+/);
    if (parts.length === 3) {
      const swapped = `${parts[1]} ${parts[0]}, ${parts[2]}`;
      const customParsed = new Date(swapped);
      if (!isNaN(customParsed.getTime())) {
        targetDate = customParsed;
      }
    }
  }

  if (!targetDate || isNaN(targetDate.getTime())) {
    return {
      diffDays: 0,
      daysLeftText: cleaned,
      badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
      isPassed: false,
      urgency: "normal",
    };
  }

  // Calculate calendar days by stripping time components to midnight
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();

  const diffDays = Math.round((targetMidnight - todayMidnight) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const passedDays = Math.abs(diffDays);
    return {
      diffDays,
      daysLeftText: `Passed (${passedDays}d ago)`,
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200 font-semibold",
      isPassed: true,
      urgency: "passed",
    };
  }

  if (diffDays === 0) {
    return {
      diffDays: 0,
      daysLeftText: "Due Today",
      badgeClass: "bg-rose-100 text-rose-800 border-rose-300 font-bold animate-pulse",
      isPassed: false,
      urgency: "today",
    };
  }

  if (diffDays <= 30) {
    return {
      diffDays,
      daysLeftText: `${diffDays} days left`,
      badgeClass: "bg-[#FFF4DC] text-[#F59E0B] border-[#FDE68A] font-semibold",
      isPassed: false,
      urgency: "urgent",
    };
  }

  return {
    diffDays,
    daysLeftText: `${diffDays} days left`,
    badgeClass: "bg-[#EAF8F1] text-[#16A36A] border-[#C6F0D8] font-semibold",
    isPassed: false,
    urgency: "normal",
  };
}
