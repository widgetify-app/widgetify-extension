const MINUTE_MS = 60_000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

export function formatTimeAgo(date: string | number, now: number): string | null {
	const time = new Date(date).getTime()
	if (!Number.isFinite(time)) return null

	const elapsed = now - time
	if (elapsed < MINUTE_MS) return 'همین الان'
	if (elapsed < HOUR_MS) return `${toPersian(elapsed / MINUTE_MS)} دقیقه پیش`
	if (elapsed < DAY_MS) return `${toPersian(elapsed / HOUR_MS)} ساعت پیش`
	return `${toPersian(elapsed / DAY_MS)} روز پیش`
}

function toPersian(amount: number): string {
	return Math.floor(amount).toLocaleString('fa-IR')
}
