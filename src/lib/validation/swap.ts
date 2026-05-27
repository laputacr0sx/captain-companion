import { z } from "zod";

export const swapRequestSchema = z.object({
  serviceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  offeredDutyTemplateId: z.number().int().positive(),
  wantedDutyTemplateId: z.number().int().positive(),
  message: z.string().optional(),
});

export type SwapRequestInput = z.infer<typeof swapRequestSchema>;

export const swapStatuses = [
  "OPEN",
  "PENDING_ACCEPTANCE",
  "ACCEPTED",
  "REJECTED",
  "CANCELLED",
  "CONFIRMED",
  "EXPIRED",
] as const;

export const validTransitions: Record<string, string[]> = {
  OPEN: ["PENDING_ACCEPTANCE", "CANCELLED", "EXPIRED"],
  PENDING_ACCEPTANCE: ["ACCEPTED", "REJECTED", "CANCELLED", "EXPIRED"],
  ACCEPTED: ["CONFIRMED", "CANCELLED"],
  REJECTED: [],
  CANCELLED: [],
  CONFIRMED: [],
  EXPIRED: [],
};

export function canTransition(from: string, to: string): boolean {
  return validTransitions[from]?.includes(to) ?? false;
}