export interface HabitDay {
	isDone: boolean
	hasRecord: boolean
}

export interface HabitStats {
	currentStreak: number
	longestStreak: number
	totalCompleted: number
	trackedDays: number
	completionRate: number
}

export function computeHabitStats(days: HabitDay[]): HabitStats {
	let longestStreak = 0
	let runningStreak = 0
	let totalCompleted = 0

	for (const day of days) {
		if (day.isDone) {
			totalCompleted++
			runningStreak++
			if (runningStreak > longestStreak) longestStreak = runningStreak
		} else {
			runningStreak = 0
		}
	}

	const firstTrackedIndex = days.findIndex((day) => day.hasRecord || day.isDone)
	const trackedDays = firstTrackedIndex === -1 ? 0 : days.length - firstTrackedIndex

	return {
		currentStreak: countCurrentStreak(days),
		longestStreak,
		totalCompleted,
		trackedDays,
		completionRate:
			trackedDays > 0 ? Math.round((totalCompleted / trackedDays) * 100) : 0,
	}
}

function countCurrentStreak(days: HabitDay[]): number {
	let index = days.length - 1
	if (index < 0) return 0

	if (!days[index].isDone) {
		if (index === 0 || !days[index - 1].isDone) return 0
		index--
	}

	let streak = 0
	while (index >= 0 && days[index].isDone) {
		streak++
		index--
	}

	return streak
}
