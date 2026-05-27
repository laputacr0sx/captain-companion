import { type EventAttributes, createEvents } from "ics";

interface CalendarDutyInput {
  dutyCode: string;
  serviceDate: string; // YYYY-MM-DD
  signOnTime: string; // HH:MM
  signOffTime: string; // HH:MM
  signOffDayOffset: number;
  signOnLocation?: string | null;
  signOffLocation?: string | null;
  remarks?: string | null;
  taskSummary?: string;
}

function parseDateTime(date: string, time: string, dayOffset: number): Date {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const d = new Date(year, month - 1, day, hour, minute);
  if (dayOffset > 0) {
    d.setDate(d.getDate() + dayOffset);
  }
  return d;
}

function toDateArray(d: Date): [number, number, number, number, number] {
  return [
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
  ];
}

export function generateDutyCalendarEvent(input: CalendarDutyInput): string {
  const start = parseDateTime(
    input.serviceDate,
    input.signOnTime,
    0
  );
  const end = parseDateTime(
    input.serviceDate,
    input.signOffTime,
    input.signOffDayOffset
  );

  const location = [input.signOnLocation, input.signOffLocation]
    .filter(Boolean)
    .join(" -> ");

  const description = [
    `Duty: ${input.dutyCode}`,
    input.signOnLocation && `Sign-on: ${input.signOnLocation} ${input.signOnTime}`,
    input.signOffLocation &&
      `Sign-off: ${input.signOffLocation} ${input.signOffTime}`,
    input.taskSummary && `Tasks: ${input.taskSummary}`,
    input.remarks && `Remarks: ${input.remarks}`,
    `Generated: ${new Date().toISOString()}`,
  ]
    .filter(Boolean)
    .join("\n");

  const event: EventAttributes = {
    title: `Duty ${input.dutyCode}`,
    start: toDateArray(start),
    startInputType: "local",
    end: toDateArray(end),
    endInputType: "local",
    description,
    location: location || undefined,
  };

  const { error, value } = createEvents([event]);
  if (error) throw error;
  return value ?? "";
}