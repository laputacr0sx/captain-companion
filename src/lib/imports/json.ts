import { jsonDutyImportSchema, type JsonDutyImport } from "@/lib/validation/import";

interface JsonImportResult {
  duties: JsonDutyImport[];
  errors: Array<{ index: number; message: string }>;
}

export function parseJsonDuties(content: string): JsonImportResult {
  let data: unknown;
  try {
    data = JSON.parse(content);
  } catch {
    return { duties: [], errors: [{ index: 0, message: "Invalid JSON" }] };
  }

  const arr = Array.isArray(data) ? data : [data];
  const duties: JsonDutyImport[] = [];
  const errors: Array<{ index: number; message: string }> = [];

  arr.forEach((item, idx) => {
    const parsed = jsonDutyImportSchema.safeParse(item);
    if (parsed.success) {
      duties.push(parsed.data);
    } else {
      errors.push({
        index: idx,
        message: parsed.error.issues.map((i) => i.message).join("; "),
      });
    }
  });

  return { duties, errors };
}