export interface HabitDay {
	isDone: boolean
}

interface HabitStats {
	currentStreak: number
	longestStreak: number
	totalCompleted: number
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

	return {
		currentStreak: countCurrentStreak(days),
		longestStreak,
		totalCompleted,
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
