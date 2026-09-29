export const habitKeys = {
	list: (archived: boolean) => ['get-habits', archived] as const,
	detail: (habitId: string) => ['get-habit-detail', habitId] as const,
	add: ['addHabit'] as const,
	archive: ['archiveHabit'] as const,
	logProgress: ['logHabitProgress'] as const,
	update: ['updateHabit'] as const,
}
