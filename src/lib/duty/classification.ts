/**
 * Duty classification helpers.
 *
 * Classifies duties by sign-on/sign-off time and characteristics
 * per CLAUDE.md duty classification rules.
 */

interface DutyTimeInput {
  signOnTime: string; // HH:MM
  signOffTime: string; // HH:MM
  signOffDayOffset: number;
}

function minutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function classifyBySignOn(
  signOnTime: string
): string {
  const m = minutes(signOnTime);
  if (m >= 240 && m < 480) return "Early morning";
  if (m >= 480 && m < 720) return "Morning";
  if (m >= 720 && m < 960) return "Afternoon";
  if (m >= 960 && m < 1260) return "Evening";
  return "Overnight / night";
}

export function classifyBySignOff(
  signOffTime: string,
  signOffDayOffset: number
): string {
  // If crosses midnight, sign-off is next day
  const m = minutes(signOffTime);
  if (signOffDayOffset === 0) {
    if (m < 840) return "Morning finish";
    if (m < 1080) return "Day finish";
    return "Evening finish";
  }
  // sign-off is next day
  if (m >= 0 && m < 180) return "Dead evening";
  if (m >= 180 && m < 420) return "Overnight finish";
  return "Morning finish";
}

export function getClassificationLabels(input: DutyTimeInput) {
  const signOnM = minutes(input.signOnTime);
  const signOffM = minutes(input.signOffTime);
  const isCrossesMidnight = signOffM < signOnM || input.signOffDayOffset > 0;

  const labels: Record<string, boolean> = {};

  if (signOnM >= 240 && signOnM < 480) labels.earlyStart = true;
  if (signOnM >= 480 && signOnM < 720) labels.morningDuty = true;
  if (signOnM >= 720 && signOnM < 960) labels.afternoonDuty = true;
  if (signOnM >= 960 && signOnM < 1260) labels.eveningDuty = true;
  if (signOnM >= 1260 || signOnM < 240) labels.overnight = true;
  if (isCrossesMidnight) labels.crossesMidnight = true;

  return labels;
}