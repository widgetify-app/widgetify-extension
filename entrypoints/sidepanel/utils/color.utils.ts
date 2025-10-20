const colorMap: Record<string, string> = {
	grey: '#6b7280',
	blue: '#3b82f6',
	red: '#ef4444',
	yellow: '#eab308',
	green: '#22c55e',
	pink: '#ec4899',
	purple: '#a855f7',
	cyan: '#06b6d4',
	orange: '#f97316',
}

export function getGroupColor(color: string): string {
	return colorMap[color] || colorMap.grey
}
