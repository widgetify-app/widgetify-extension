import { describe, expect, it } from 'bun:test'
import { findMonthlyPlan, monthlyPrice, savingPercent } from '../utils/plan-pricing'

const free = { price: 0, days: 5 }
const month = { price: 99_000, days: 30 }
const season = { price: 249_000, days: 90 }
const year = { price: 899_000, days: 365 }

describe('monthlyPrice', () => {
	it('spreads the price over thirty days and rounds to a thousand', () => {
		expect(monthlyPrice(month)).toBe(99_000)
		expect(monthlyPrice(season)).toBe(83_000)
		expect(monthlyPrice(year)).toBe(74_000)
	})

	it('returns the price itself when a plan has no days', () => {
		expect(monthlyPrice({ price: 50_000, days: 0 })).toBe(50_000)
	})
})

describe('findMonthlyPlan', () => {
	it('picks the paid plan that lasts about a month', () => {
		expect(findMonthlyPlan([free, season, month, year])).toBe(month)
	})

	it('finds none when no paid plan lasts a month', () => {
		expect(findMonthlyPlan([free, season, year])).toBeUndefined()
	})
})

describe('savingPercent', () => {
	it('compares the price per day with the monthly plan', () => {
		expect(savingPercent(season, month)).toBe(16)
		expect(savingPercent(year, month)).toBe(25)
	})

	it('shows no saving for the monthly plan, a free plan or a missing base', () => {
		expect(savingPercent(month, month)).toBe(0)
		expect(savingPercent(free, month)).toBe(0)
		expect(savingPercent(season, undefined)).toBe(0)
	})

	it('never goes below zero when a longer plan costs more per day', () => {
		expect(savingPercent({ price: 400_000, days: 90 }, month)).toBe(0)
	})
})
