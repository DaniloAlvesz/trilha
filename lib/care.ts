import { readForum, type ForumState } from "./forum";
export type CheckIn = {
  id: string;
  date: string;
  mood: string;
  symptom: string;
  intensity: number;
  note: string;
};
export type Appointment = {
  id: string;
  title: string;
  date: string;
  notes: string;
  done: boolean;
};
export type Photo = {
  id: string;
  date: string;
  caption: string;
  image: string;
};
export type CareData = {
  version: 1;
  forum?: ForumState;
  welcomed: boolean;
  remember: boolean;
  largeText: boolean;
  medication: string;
  schedule: string;
  reminderTime: string;
  doses: Record<string, "taken" | "not-taken">;
  checkIns: CheckIn[];
  appointments: Appointment[];
  questions: { id: string; text: string }[];
  photos: Photo[];
};
export const STORAGE_KEY = "onco-plus-care-v1";
export function emptyCare(): CareData {
  return {
    version: 1,
    welcomed: false,
    remember: false,
    largeText: false,
    medication: "",
    schedule: "",
    reminderTime: "09:00",
    doses: {},
    checkIns: [],
    appointments: [],
    questions: [],
    photos: [],
  };
}
export function todayKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function dateLabel(value: string, time = false): string {
  const d = new Date(value.length === 10 ? `${value}T12:00:00` : value);
  return Number.isNaN(d.getTime())
    ? "Data não disponível"
    : d.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        ...(time ? { hour: "2-digit", minute: "2-digit" } : {}),
      });
}
export function nextAppointment(
  items: Appointment[],
  now = new Date(),
): Appointment | undefined {
  return items
    .filter((x) => !x.done && new Date(x.date).getTime() >= now.getTime())
    .sort((a, b) => a.date.localeCompare(b.date))[0];
}
export function recentDays(now = new Date()): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - 6 + i);
    return todayKey(d);
  });
}
export function doseSummary(doses: CareData["doses"]) {
  const records = Object.values(doses);
  return {
    taken: records.filter((x) => x === "taken").length,
    notTaken: records.filter((x) => x === "not-taken").length,
    recorded: records.length,
  };
}
const escapeICS = (v: string) =>
  v
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
export function calendarFile(event: Appointment, now = new Date()): string {
  const start = new Date(event.date);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const utc = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ONCO+//Agenda//PT-BR",
    "BEGIN:VEVENT",
    `UID:${event.id}@onco-plus.local`,
    `DTSTAMP:${utc(now)}`,
    `DTSTART:${utc(start)}`,
    `DTEND:${utc(end)}`,
    "SUMMARY:Compromisso pessoal",
    `DESCRIPTION:${escapeICS("Abra o ONCO+ para ver os detalhes. Este lembrete não contém informações de saúde.")}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Você tem um compromisso em 1 hora.",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
// Discard malformed or unrecognized browser data instead of trusting imported objects.
export function readCare(raw: string | null): CareData | null {
  if (!raw) return null;
  try {
    const d = JSON.parse(raw);
    const str = (s: unknown, n = 2000): s is string =>
      typeof s === "string" && s.length <= n;
    if (
      d.version !== 1 ||
      d.remember !== true ||
      !Array.isArray(d.checkIns) ||
      !Array.isArray(d.appointments) ||
      !Array.isArray(d.questions) ||
      !Array.isArray(d.photos)
    )
      return null;
    const base = emptyCare();
    return {
      ...base,
      remember: true,
      forum: readForum(d.forum),
      welcomed: d.welcomed === true,
      largeText: d.largeText === true,
      medication: str(d.medication, 100) ? d.medication : "",
      schedule: str(d.schedule, 100) ? d.schedule : "",
      reminderTime: /^\d{2}:\d{2}$/.test(d.reminderTime)
        ? d.reminderTime
        : base.reminderTime,
      doses: Object.fromEntries(
        Object.entries(d.doses || {}).filter(
          (entry): entry is [string, "taken" | "not-taken"] =>
            /^\d{4}-\d{2}-\d{2}$/.test(entry[0]) &&
            (entry[1] === "taken" || entry[1] === "not-taken"),
        ),
      ),
      checkIns: d.checkIns
        .filter(
          (x: CheckIn) =>
            x &&
            str(x.id, 100) &&
            str(x.date, 40) &&
            !isNaN(Date.parse(x.date)) &&
            str(x.mood, 100) &&
            str(x.symptom, 100) &&
            Number.isInteger(x.intensity) &&
            x.intensity >= 0 &&
            x.intensity <= 4 &&
            str(x.note),
        )
        .slice(0, 3000),
      appointments: d.appointments
        .filter(
          (x: Appointment) =>
            x &&
            str(x.id, 100) &&
            str(x.title, 100) &&
            str(x.date, 40) &&
            !isNaN(Date.parse(x.date)) &&
            str(x.notes) &&
            typeof x.done === "boolean",
        )
        .slice(0, 1000),
      questions: d.questions
        .filter(
          (x: { id: string; text: string }) =>
            x && str(x.id, 100) && str(x.text, 500),
        )
        .slice(0, 1000),
      photos: d.photos
        .filter(
          (x: Photo) =>
            x &&
            str(x.id, 100) &&
            str(x.date, 40) &&
            str(x.caption, 200) &&
            str(x.image, 1400000) &&
            /^data:image\/(jpeg|png|webp);base64,/.test(x.image),
        )
        .slice(0, 3),
    };
  } catch {
    return null;
  }
}
