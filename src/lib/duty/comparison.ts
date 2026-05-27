interface DutyComparisonInput {
  signOnTime: string;
  signOffTime: string;
  signOffDayOffset: number;
  signOnLocation?: string | null;
  signOffLocation?: string | null;
  workMinutes?: number | null;
  breakCount?: number;
  taskCount?: number;
  trainWorkCount?: number;
  remarks?: string | null;
  crossesMidnight?: boolean;
}

interface DutyComparisonResult {
  signOnTime: string;
  signOffTime: string;
  signOffDayOffset: number;
  signOnLocation: string | null;
  signOffLocation: string | null;
  workMinutes: number | null;
  breakCount: number;
  taskCount: number;
  trainWorkCount: number;
  remarks: string | null;
  crossesMidnight: boolean;
}

export function prepareDutyComparison(
  duty: DutyComparisonInput
): DutyComparisonResult {
  return {
    signOnTime: duty.signOnTime,
    signOffTime: duty.signOffTime,
    signOffDayOffset: duty.signOffDayOffset,
    signOnLocation: duty.signOnLocation ?? null,
    signOffLocation: duty.signOffLocation ?? null,
    workMinutes: duty.workMinutes ?? null,
    breakCount: duty.breakCount ?? 0,
    taskCount: duty.taskCount ?? 0,
    trainWorkCount: duty.trainWorkCount ?? 0,
    remarks: duty.remarks ?? null,
    crossesMidnight: duty.crossesMidnight ?? false,
  };
}