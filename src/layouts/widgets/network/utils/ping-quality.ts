export type PingQuality = 'unknown' | 'good' | 'fair' | 'poor'

export const GOOD_PING_MS = 150
export const FAIR_PING_MS = 300

const QUALITY_LABELS: Record<PingQuality, string> = {
	unknown: 'پینگ در دسترس نیست.',
	good: 'پینگ شما عالی هست.',
	fair: 'پینگ شما متوسط است.',
	poor: 'پینگ شما ضعیف است.',
}

const QUALITY_TEXT_CLASS: Record<PingQuality, string> = {
	unknown: 'text-muted',
	good: 'text-success',
	fair: 'text-warning',
	poor: 'text-error',
}

export function getPingQuality(ping: number | null): PingQuality {
	if (ping === null || ping < 0) return 'unknown'
	if (ping <= GOOD_PING_MS) return 'good'
	if (ping <= FAIR_PING_MS) return 'fair'
	return 'poor'
}

export function getPingFeedback(ping: number | null): string {
	return QUALITY_LABELS[getPingQuality(ping)]
}

export function getPingTextClass(ping: number | null): string {
	return QUALITY_TEXT_CLASS[getPingQuality(ping)]
}
