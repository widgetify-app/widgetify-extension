import { describe, expect, it } from 'bun:test'
import { getCurrentDate } from '../utils/date-events'

function hourIn(timeZone: string): number {
	const hour = new Intl.DateTimeFormat('en-US', {
		timeZone,
		hour: 'numeric',
		hourCycle: 'h23',
	}).format(new Date())

	return Number(hour)
}

describe('getCurrentDate', () => {
	it('reads the clock of the chosen time zone, not the system one', () => {
		for (const zone of ['Pacific/Pago_Pago', 'Asia/Tehran', 'Pacific/Kiritimati']) {
			const expected = hourIn(zone)
			const actual = getCurrentDate(zone).hour()

			expect(Math.abs(actual - expected) % 24).toBeLessThanOrEqual(1)
		}
	})

	it('puts far apart zones on different days or hours', () => {
		const west = getCurrentDate('Pacific/Pago_Pago')
		const east = getCurrentDate('Pacific/Kiritimati')

		expect(east.valueOf() - west.valueOf()).toBeGreaterThan(24 * 3600 * 1000 - 120000)
	})
})
