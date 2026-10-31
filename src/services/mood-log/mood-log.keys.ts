export const moodLogKeys = {
	all: ['get-moods'] as const,
	range: (start: string, end: string) => ['get-moods', start, end] as const,
	stats: (year: number, month: number) => ['get-mood-stats', year, month] as const,
	upsert: ['upsertMoodLog'] as const,
}
