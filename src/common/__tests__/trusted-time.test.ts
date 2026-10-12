import { describe, expect, it } from 'bun:test'
import {
	CLOCK_SYNC_TTL_MS,
	computeClockOffset,
	isClockSyncFresh,
	MIN_CORRECTED_SKEW_MS,
	nowDate,
	nowMs,
	onClockCorrected,
	setClockOffset,
} from '../utils/trusted-time'

function atSystemTime(iso: string, run: () => void) {
	const realNow = Date.now

	Date.now = () => Date.parse(iso)

	try {
		run()
	} finally {
		Date.now = realNow
		setClockOffset(0)
	}
}

describe('computeClockOffset', () => {
	it('is the gap between the server clock and the system clock', () => {
		expect(
			computeClockOffset({ serverMs: 1_000_000, roundTripMs: 0, systemMs: 400_000 })
		).toBe(600_000)
	})

	it('adds half of the round trip, since the server read its clock midway', () => {
		expect(
			computeClockOffset({
				serverMs: 1_000_000,
				roundTripMs: 400,
				systemMs: 400_000,
			})
		).toBe(600_200)
	})

	it('is negative when the system clock runs ahead', () => {
		expect(
			computeClockOffset({
				serverMs: 1_000_000,
				roundTripMs: 0,
				systemMs: 1_900_000,
			})
		).toBe(-900_000)
	})

	it('is zero for a gap too small to matter, so most people see no change', () => {
		const small = MIN_CORRECTED_SKEW_MS - 1

		expect(
			computeClockOffset({
				serverMs: 1_000_000 + small,
				roundTripMs: 0,
				systemMs: 1_000_000,
			})
		).toBe(0)
		expect(
			computeClockOffset({
				serverMs: 1_000_000 - small,
				roundTripMs: 0,
				systemMs: 1_000_000,
			})
		).toBe(0)
	})

	it('corrects a gap of exactly the minimum', () => {
		expect(
			computeClockOffset({
				serverMs: 1_000_000 + MIN_CORRECTED_SKEW_MS,
				roundTripMs: 0,
				systemMs: 1_000_000,
			})
		).toBe(MIN_CORRECTED_SKEW_MS)
	})

	it('ignores an answer that is not a usable number', () => {
		for (const serverMs of [Number.NaN, Number.POSITIVE_INFINITY, -1, 0]) {
			expect(
				computeClockOffset({ serverMs, roundTripMs: 0, systemMs: 1_000_000 })
			).toBe(0)
		}
	})
})

describe('nowMs', () => {
	it('is the system clock until a correction is set', () => {
		atSystemTime('2026-10-12T12:00:00.000Z', () => {
			expect(nowMs()).toBe(Date.parse('2026-10-12T12:00:00.000Z'))
		})
	})

	it('moves by the offset', () => {
		atSystemTime('2026-10-12T12:00:00.000Z', () => {
			setClockOffset(-86_400_000)

			expect(nowDate().toISOString()).toBe('2026-10-11T12:00:00.000Z')
		})
	})

	it('keeps following the system clock after a correction', () => {
		atSystemTime('2026-10-12T12:00:00.000Z', () => {
			setClockOffset(-86_400_000)
		})

		atSystemTime('2026-10-12T12:00:30.000Z', () => {
			setClockOffset(-86_400_000)

			expect(nowDate().toISOString()).toBe('2026-10-11T12:00:30.000Z')
		})
	})
})

describe('onClockCorrected', () => {
	it('tells listeners when the offset changes, and only then', () => {
		let calls = 0
		const stop = onClockCorrected(() => {
			calls += 1
		})

		setClockOffset(5000)
		setClockOffset(5000)
		setClockOffset(0)

		expect(calls).toBe(2)

		stop()
		setClockOffset(9000)

		expect(calls).toBe(2)

		setClockOffset(0)
	})
})

describe('isClockSyncFresh', () => {
	const saved = { offset: 600_000, syncedAt: 1_000_000 }

	it('trusts a correction for a few days, so the server is asked once', () => {
		expect(isClockSyncFresh(saved, 1_000_000)).toBe(true)
		expect(isClockSyncFresh(saved, 1_000_000 + CLOCK_SYNC_TTL_MS - 1)).toBe(true)
	})

	it('asks again after that', () => {
		expect(isClockSyncFresh(saved, 1_000_000 + CLOCK_SYNC_TTL_MS)).toBe(false)
	})

	it('asks again when the system clock went back past the sync, since it was changed', () => {
		expect(isClockSyncFresh(saved, 999_999)).toBe(false)
	})

	it('asks when nothing usable was saved', () => {
		expect(isClockSyncFresh(null, 1_000_000)).toBe(false)
		expect(isClockSyncFresh(undefined, 1_000_000)).toBe(false)
		expect(
			isClockSyncFresh({ offset: Number.NaN, syncedAt: 1_000_000 }, 1_000_000)
		).toBe(false)
	})
})
