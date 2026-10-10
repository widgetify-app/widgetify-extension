import { describe, expect, it } from 'bun:test'
import type { VipPlan } from '@/services/market/market-vip.interface'
import {
	dailyPriceCeiling,
	defaultOffer,
	extendedUntil,
	isGiftPlan,
	toPlanOffers,
} from '../utils/plan-offers'

function plan(id: string, days: number, price: number, badge?: string): VipPlan {
	return { id, title: id, days, price, isActive: true, meta: badge ? { badge } : null }
}

const monthly = plan('1', 30, 89_000)
const quarterly = plan('3', 90, 229_000)
const yearly = plan('12', 365, 749_000)
const gift = plan('gift', 7, 0)

describe('toPlanOffers', () => {
	it('prices every plan against the shortest one, month by month', () => {
		const [one, three, twelve] = toPlanOffers([monthly, quarterly, yearly])
		expect([one.fullPrice, three.fullPrice, twelve.fullPrice]).toEqual([
			null,
			267_000,
			1_068_000,
		])
		expect([
			one.discountPercent,
			three.discountPercent,
			twelve.discountPercent,
		]).toEqual([0, 14, 30])
		expect([one.savings, three.savings, twelve.savings]).toEqual([0, 38_000, 319_000])
	})

	it('gives the monthly price of each plan', () => {
		const [one, , twelve] = toPlanOffers([monthly, quarterly, yearly])
		expect(one.monthlyPrice).toBe(89_000)
		expect(Math.round(twelve.monthlyPrice ?? 0)).toBe(62_417)
	})

	it('marks only the plan with the biggest discount as the best value', () => {
		const offers = toPlanOffers([monthly, quarterly, yearly])
		expect(offers.filter((offer) => offer.isBestValue).map((o) => o.plan.id)).toEqual(
			['12']
		)
	})

	it('claims no discount when a longer plan costs the same per month', () => {
		const offers = toPlanOffers([monthly, plan('3', 90, 267_000)])
		expect(offers.map((offer) => offer.discountPercent)).toEqual([0, 0])
		expect(offers.some((offer) => offer.isBestValue)).toBe(false)
	})

	it('leaves the free gift out of the paid plans', () => {
		expect(toPlanOffers([gift, monthly]).map((offer) => offer.plan.id)).toEqual(['1'])
		expect(isGiftPlan(gift)).toBe(true)
		expect(isGiftPlan(monthly)).toBe(false)
	})

	it('shows no monthly price for a plan shorter than a month', () => {
		const [week] = toPlanOffers([plan('week', 7, 25_000), monthly])
		expect(week.monthlyPrice).toBeNull()
	})
})

describe('defaultOffer', () => {
	it('picks the plan the server badged first', () => {
		const offers = toPlanOffers([monthly, plan('3', 90, 229_000, 'محبوب'), yearly])
		expect(defaultOffer(offers)?.plan.id).toBe('3')
	})

	it('falls back to the best value, then to the first plan', () => {
		expect(defaultOffer(toPlanOffers([monthly, quarterly, yearly]))?.plan.id).toBe(
			'12'
		)
		expect(defaultOffer(toPlanOffers([monthly]))?.plan.id).toBe('1')
		expect(defaultOffer([])).toBeNull()
	})
})

describe('dailyPriceCeiling', () => {
	it('rounds the cheapest day up to the next thousand toman', () => {
		expect(dailyPriceCeiling(toPlanOffers([monthly]))).toBe(3)
		expect(dailyPriceCeiling(toPlanOffers([monthly, yearly]))).toBe(3)
		expect(dailyPriceCeiling(toPlanOffers([plan('1', 30, 90_000)]))).toBe(4)
		expect(dailyPriceCeiling([])).toBeNull()
	})
})

describe('extendedUntil', () => {
	const now = new Date('2026-10-10T08:00:00Z')

	it('adds the days on top of the time that is left', () => {
		expect(extendedUntil('2026-11-02T08:00:00Z', 30, now).toISOString()).toBe(
			'2026-12-02T08:00:00.000Z'
		)
	})

	it('starts from today when the credit has run out or is unknown', () => {
		const expected = '2026-11-09T08:00:00.000Z'
		expect(extendedUntil('2026-09-01T08:00:00Z', 30, now).toISOString()).toBe(
			expected
		)
		expect(extendedUntil(null, 30, now).toISOString()).toBe(expected)
		expect(extendedUntil('not a date', 30, now).toISOString()).toBe(expected)
	})
})
