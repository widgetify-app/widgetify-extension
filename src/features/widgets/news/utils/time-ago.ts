import { t } from '@/common/i18n'

const MINUTE_MS = 60_000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

export function formatTimeAgo(date: string | number, now: number): string | null {
	const time = new Date(date).getTime()
	if (!Number.isFinite(time)) return null

	const elapsed = now - time
	if (elapsed < MINUTE_MS) return t('widgets.news.time.justNow')
	if (elapsed < HOUR_MS)
		return t('widgets.news.time.minutesAgo', {
			count: toPersian(elapsed / MINUTE_MS),
		})
	if (elapsed < DAY_MS)
		return t('widgets.news.time.hoursAgo', {
			count: toPersian(elapsed / HOUR_MS),
		})
	return t('widgets.news.time.daysAgo', {
		count: toPersian(elapsed / DAY_MS),
	})
}

function toPersian(amount: number): string {
	return Math.floor(amount).toLocaleString('fa-IR')
}
