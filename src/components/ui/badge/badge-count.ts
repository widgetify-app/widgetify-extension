const BADGE_COUNT_CAP = 10

export function formatBadgeCount(count: number): string {
	if (count >= BADGE_COUNT_CAP) {
		return `+${BADGE_COUNT_CAP.toLocaleString('fa-IR')}`
	}
	return count.toLocaleString('fa-IR')
}
