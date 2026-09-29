export const moodLogKeys = {
	all: ['get-moods'] as const,
	range: (start: string, end: string) => ['get-moods', start, end] as const,
	stats: ['get-mood-stats'] as const,
	upsert: ['upsertMoodLog'] as const,
}
