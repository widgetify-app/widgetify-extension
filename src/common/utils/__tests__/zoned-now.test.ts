import { describe, expect, it } from 'bun:test'
import {
	getZonedNow,
	MINUTE_MS,
	MINUTE_TICK_GUARD_MS,
	msUntilNextMinute,
} from '../zoned-now'

function hourIn(timeZone: string): number {
	return Number(
		new Intl.DateTimeFormat('en-US', {
			timeZone,
			hour: 'numeric',
			hour12: false,
		}).format(new Date())
	)
}

describe('getZonedNow', () => {
	it('reads the hour of the given zone, not the machine running the code', () => {
		for (const zone of [
			'Asia/Tehran',
			'Europe/Berlin',
			'America/New_York',
			'Asia/Tokyo',
		]) {
			expect(getZonedNow(zone).getHours()).toBe(hourIn(zone) % 24)
		}
	})

	it('separates zones that are hours apart', () => {
		const tehran = getZonedNow('Asia/Tehran').getHours()
		const newYork = getZonedNow('America/New_York').getHours()

		expect(tehran).not.toBe(newYork)
	})

	it('falls back to local time when no zone is given', () => {
		expect(getZonedNow().getHours()).toBe(new Date().getHours())
	})
})

describe('msUntilNextMinute', () => {
	it('waits a whole minute when sitting exactly on a boundary', () => {
		expect(msUntilNextMinute(0)).toBe(MINUTE_MS + MINUTE_TICK_GUARD_MS)
	})

	it('waits only the remainder part way through a minute', () => {
		expect(msUntilNextMinute(59_000)).toBe(1_000 + MINUTE_TICK_GUARD_MS)
		expect(msUntilNextMinute(30_000)).toBe(30_000 + MINUTE_TICK_GUARD_MS)
	})

	it('always clears the boundary rather than landing on it', () => {
		for (let ms = 0; ms < MINUTE_MS; ms += 997) {
			expect(msUntilNextMinute(ms)).toBeGreaterThan(MINUTE_MS - (ms % MINUTE_MS))
		}
	})

	it('never schedules longer than a minute plus the guard', () => {
		for (let ms = 0; ms < MINUTE_MS; ms += 997) {
			expect(msUntilNextMinute(ms)).toBeLessThanOrEqual(
				MINUTE_MS + MINUTE_TICK_GUARD_MS
			)
		}
	})
})
