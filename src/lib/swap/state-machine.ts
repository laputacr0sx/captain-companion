import { canTransition } from "@/lib/validation/swap";

type SwapStatus =
  | "OPEN"
  | "PENDING_ACCEPTANCE"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELLED"
  | "CONFIRMED"
  | "EXPIRED";

const terminalStatuses: SwapStatus[] = [
  "REJECTED",
  "CANCELLED",
  "CONFIRMED",
  "EXPIRED",
];

export function isTerminal(status: string): boolean {
  return terminalStatuses.includes(status as SwapStatus);
}

export function isActive(status: string): boolean {
  return !isTerminal(status);
}

export function transition(
  currentStatus: string,
  targetStatus: string
): string {
  if (!canTransition(currentStatus, targetStatus)) {
    throw new Error(
      `Cannot transition swap from ${currentStatus} to ${targetStatus}`
    );
  }
  return targetStatus;
}

export { canTransition };