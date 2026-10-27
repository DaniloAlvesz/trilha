const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const assert = require("node:assert/strict");
const { test, after } = require("node:test");
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "onco-test-"));
execFileSync(process.execPath, [
  "node_modules/typescript/bin/tsc",
  "lib/care.ts",
  "--outDir",
  dir,
  "--module",
  "commonjs",
  "--target",
  "es2020",
  "--skipLibCheck",
]);
const c = require(path.join(dir, "care.js"));
after(() => fs.rmSync(dir, { recursive: true, force: true }));
test("local date keys do not shift records to UTC day", () =>
  assert.equal(c.todayKey(new Date(2026, 0, 2, 23, 59)), "2026-01-02"));
test("next visit excludes past and completed items", () => {
  const item = (id, date, done = false) => ({
    id,
    date,
    done,
    title: "Consulta",
    notes: "",
  });
  const next = c.nextAppointment(
    [
      item("past", "2026-01-01T10:00"),
      item("done", "2026-01-03T10:00", true),
      item("later", "2026-01-05T10:00"),
      item("next", "2026-01-04T10:00"),
    ],
    new Date("2026-01-02T10:00"),
  );
  assert.equal(next.id, "next");
});
test("medication totals do not infer unrecorded days or duplicate a date", () => {
  const doses = { "2026-01-01": "taken", "2026-01-03": "not-taken" };
  doses["2026-01-01"] = "taken";
  assert.deepEqual(c.doseSummary(doses), {
    taken: 1,
    notTaken: 1,
    recorded: 2,
  });
});
test("seven days span month and year boundaries in local time", () => {
  const days = c.recentDays(new Date(2026, 0, 2, 12));
  assert.equal(days.length, 7);
  assert.equal(days[0], "2025-12-27");
  assert.equal(days[6], "2026-01-02");
});
test("calendar exports do not disclose health details and use correct UTC instant", () => {
  const file = c.calendarFile(
    {
      id: "test",
      title: "Cancer clinic",
      notes: "Secret diagnosis",
      date: "2026-01-03T10:00:00-03:00",
      done: false,
    },
    new Date("2026-01-01T00:00Z"),
  );
  assert.ok(file.includes("DTSTART:20260103T130000Z"));
  assert.ok(file.includes("SUMMARY:Compromisso pessoal"));
  assert.ok(!file.includes("Cancer"));
  assert.ok(!file.includes("Secret"));
  assert.ok(file.includes("BEGIN:VALARM"));
});
test("stored data requires opt-in and rejects malformed content", () => {
  assert.equal(c.readCare("{"), null);
  assert.equal(c.readCare(JSON.stringify(c.emptyCare())), null);
  const data = {
    ...c.emptyCare(),
    remember: true,
    checkIns: [
      {
        id: "x",
        date: "bad",
        mood: "fine",
        symptom: "pain",
        intensity: 8,
        note: "",
      },
    ],
    photos: [
      {
        id: "x",
        date: "2026-01-01",
        caption: "x",
        image: "javascript:alert(1)",
      },
    ],
  };
  const read = c.readCare(JSON.stringify(data));
  assert.equal(read.checkIns.length, 0);
  assert.equal(read.photos.length, 0);
  assert.equal(read.remember, true);
});
const forumModel = require(path.join(dir, "forum.js"));
test("forum data rejects orphan replies and fictional identity collisions", () => {
  const state = forumModel.readForum({
    ...forumModel.emptyForum(),
    threads: [
      {
        id: "example-apoio",
        title: "changed",
        body: "changed",
        category: "Dia a dia",
        author: "X",
        createdAt: "2026-01-01T10:00Z",
      },
    ],
    replies: [
      {
        id: "r",
        threadId: "unknown",
        author: "X",
        body: "text",
        createdAt: "2026-01-01T10:00Z",
      },
    ],
  });
  assert.equal(state.threads.length, 0);
  assert.equal(state.replies.length, 0);
});
test("forum persists with the same explicit care consent and retains text without interpreting HTML", () => {
  const f = {
    ...forumModel.emptyForum(),
    alias: "Jasmim-123",
    threads: [
      {
        id: "own",
        title: "<script>text</script>",
        body: "Mensagem de teste",
        category: "Dia a dia",
        author: "Jasmim-123",
        createdAt: "2026-01-01T10:00Z",
      },
    ],
    saved: ["own", "missing"],
  };
  const data = c.readCare(
    JSON.stringify({ ...c.emptyCare(), remember: true, forum: f }),
  );
  assert.equal(data.forum.threads[0].title, "<script>text</script>");
  assert.deepEqual(data.forum.saved, ["own"]);
  assert.equal(c.emptyCare().forum, undefined);
});
