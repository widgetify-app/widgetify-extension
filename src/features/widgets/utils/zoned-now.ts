import { nowDate } from '@/common/utils/trusted-time'
export const MINUTE_MS = 60_000
export const MINUTE_TICK_GUARD_MS = 100

export function getZonedNow(timeZone?: string): Date {
	return new Date(
		nowDate().toLocaleString('en-US', { timeZone: timeZone || undefined })
	)
}

export function msUntilNextMinute(nowMs: number): number {
	return MINUTE_MS - (nowMs % MINUTE_MS) + MINUTE_TICK_GUARD_MS
}
