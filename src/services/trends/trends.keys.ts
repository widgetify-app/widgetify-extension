export const trendsKeys = {
	list: (region: string, limit: number) => ['getTrends', region, limit] as const,
}
