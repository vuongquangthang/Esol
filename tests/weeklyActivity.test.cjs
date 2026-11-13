const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync(require.resolve('../src/utils/weeklyActivity.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const moduleExports = {};
vm.runInNewContext(compiled, { exports: moduleExports, Date });
const { getWeeklyActivity } = moduleExports;

const now = new Date(2026, 10, 13, 12); // Friday, local time
const session = (date, durationMinutes) => ({ completedAt: date.toISOString(), durationMinutes });
const habit = (history) => ({ history });

test('no activity returns zero, including habits without check-ins', () => {
  assert.equal(getWeeklyActivity([], [], now).focusHours, 0);
  assert.equal(getWeeklyActivity([], [], now).habitRate, 0);
  assert.equal(getWeeklyActivity([], [habit({})], now).habitRate, 0);
});

test('focus sums this week, including earlier days, and excludes old/future sessions', () => {
  const sessions = [
    session(new Date(2026, 10, 8, 23, 59), 600),
    session(new Date(2026, 10, 9), 60),
    session(new Date(2026, 10, 12, 10), 30),
    session(now, 30),
    session(new Date(2026, 10, 13, 13), 600),
    session(new Date(2026, 10, 16), 600),
  ];
  assert.equal(getWeeklyActivity(sessions, [], now).focusHours, 2);
});

test('habits count true check-ins over elapsed days, excluding old/future entries', () => {
  const habits = [
    habit({ '2026-11-08': true, '2026-11-09': true, '2026-11-10': false, '2026-11-13': true, '2026-11-14': true }),
    habit({ '2026-11-11': true }),
  ];
  assert.equal(getWeeklyActivity([], habits, now).habitRate, 30); // 3 / (2 habits * 5 days)
});

test('Sunday includes seven days and Monday starts a new week', () => {
  const habits = [habit({ '2026-11-09': true, '2026-11-15': true })];
  assert.equal(getWeeklyActivity([], habits, new Date(2026, 10, 15, 12)).habitRate, 29);
  assert.equal(getWeeklyActivity([], habits, new Date(2026, 10, 16, 12)).habitRate, 0);
});
