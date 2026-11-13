import type { FocusSession, Habit } from '../types/momentum';

export function getWeeklyActivity(
  focusSessions: FocusSession[],
  habits: Habit[],
  now = new Date(),
) {
  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));

  const focusMinutes = focusSessions.reduce((total, session) => {
    const completedAt = new Date(session.completedAt);
    return completedAt >= weekStart && completedAt <= now
      ? total + session.durationMinutes
      : total;
  }, 0);

  let elapsedDays = 0;
  let completedHabitDays = 0;
  const day = new Date(weekStart);
  while (day <= now) {
    const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
    completedHabitDays += habits.filter((habit) => habit.history[dateStr] === true).length;
    elapsedDays += 1;
    day.setDate(day.getDate() + 1);
  }

  const totalHabitDays = habits.length * elapsedDays;
  return {
    focusHours: Math.round((focusMinutes / 60) * 10) / 10,
    habitRate: totalHabitDays === 0 ? 0 : Math.round((completedHabitDays / totalHabitDays) * 100),
  };
}
