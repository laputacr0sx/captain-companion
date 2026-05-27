import { csvDutyRowSchema, type CsvDutyRow } from "@/lib/validation/import";

interface CsvImportResult {
  rows: CsvDutyRow[];
  errors: Array<{ row: number; message: string }>;
}

export function parseCsvDuties(content: string): CsvImportResult {
  const lines = content.trim().split("\n");
  if (lines.length < 2) {
    return { rows: [], errors: [{ row: 0, message: "Empty CSV" }] };
  }

  const headers = lines[0].split(",").map((h) => h.trim());
  const rows: CsvDutyRow[] = [];
  const errors: Array<{ row: number; message: string }> = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    const record: Record<string, string> = {};
    headers.forEach((h, idx) => {
      record[h] = values[idx] ?? "";
    });

    const parsed = csvDutyRowSchema.safeParse(record);
    if (parsed.success) {
      rows.push(parsed.data);
    } else {
      errors.push({
        row: i,
        message: parsed.error.issues.map((issue) => issue.message).join("; "),
      });
    }
  }

  return { rows, errors };
}