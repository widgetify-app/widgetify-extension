import { describe, expect, it } from 'bun:test'
import jalaliMoment from 'jalali-moment'
import {
	birthdayParts,
	friendsSincePeriod,
	memberSinceYear,
	mutualSummary,
} from '../utils/profile-card'

const day = 24 * 60 * 60 * 1000

describe('friendsSincePeriod', () => {
	const now = new Date('2026-10-23T12:00:00Z')

	it('says new for under a month', () => {
		expect(
			friendsSincePeriod(new Date(now.getTime() - 10 * day).toISOString(), now)
		).toEqual({
			unit: 'new',
			count: 0,
		})
	})

	it('counts whole months under a year', () => {
		expect(
			friendsSincePeriod(new Date(now.getTime() - 130 * day).toISOString(), now)
		).toEqual({
			unit: 'months',
			count: 4,
		})
	})

	it('counts whole years after that', () => {
		expect(
			friendsSincePeriod(new Date(now.getTime() - 800 * day).toISOString(), now)
		).toEqual({
			unit: 'years',
			count: 2,
		})
	})
})

describe('birthdayParts', () => {
	it('names the Jalali month and marks the day', () => {
		const today = new Date('2026-11-04T08:00:00Z')

		const aban = jalaliMoment
			.from('1405/08/01', 'fa', 'YYYY/MM/DD')
			.locale('fa')
			.format('jMMMM')

		expect(birthdayParts({ month: 8, day: 13 }, today)).toEqual({
			day: 13,
			monthName: aban,
			isToday: true,
		})
		expect(birthdayParts({ month: 8, day: 14 }, today).isToday).toBe(false)
	})
})

describe('memberSinceYear', () => {
	it('gives the Jalali year the account was made', () => {
		expect(memberSinceYear('2024-01-01T00:00:00.000Z')).toBe(1402)
	})
})

describe('mutualSummary', () => {
	it('names two and counts the rest', () => {
		expect(mutualSummary(5, ['Ali', 'Negar', 'Sara'])).toEqual({
			names: ['Ali', 'Negar'],
			others: 3,
		})
	})

	it('names everyone when there are two or fewer', () => {
		expect(mutualSummary(1, ['Ali'])).toEqual({ names: ['Ali'], others: 0 })
	})
})
