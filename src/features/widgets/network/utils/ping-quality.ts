type PingQuality = 'unknown' | 'good' | 'fair' | 'poor'

export const GOOD_PING_MS = 150
export const FAIR_PING_MS = 300

const QUALITY_LABELS: Record<PingQuality, string> = {
	unknown: 'معلوم نیست',
	good: 'عالی',
	fair: 'متوسط',
	poor: 'ضعیف',
}

const QUALITY_BARS: Record<PingQuality, number> = {
	unknown: 0,
	good: 4,
	fair: 2,
	poor: 1,
}

const QUALITY_TEXT_CLASS: Record<PingQuality, string> = {
	unknown: 'text-fg-muted',
	good: 'text-success',
	fair: 'text-warning',
	poor: 'text-danger',
}

export function getPingQuality(ping: number | null): PingQuality {
	if (ping === null || ping < 0) return 'unknown'
	if (ping <= GOOD_PING_MS) return 'good'
	if (ping <= FAIR_PING_MS) return 'fair'
	return 'poor'
}

export function getPingLabel(ping: number | null): string {
	return QUALITY_LABELS[getPingQuality(ping)]
}

export function getPingBars(ping: number | null): number {
	return QUALITY_BARS[getPingQuality(ping)]
}

export function getPingTextClass(ping: number | null): string {
	return QUALITY_TEXT_CLASS[getPingQuality(ping)]
}
