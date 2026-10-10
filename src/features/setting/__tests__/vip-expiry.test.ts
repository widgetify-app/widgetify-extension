import { describe, expect, it } from 'bun:test'
import {
	formatVipExpiryDate,
	formatVipRemaining,
	hasVipTimeLeft,
} from '../utils/vip-expiry'

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

function fromNow(ms: number) {
	return new Date(Date.now() + ms).toISOString()
}

describe('formatVipRemaining', () => {
	it('is empty when there is no expiry', () => {
		expect(formatVipRemaining(undefined)).toBe('')
		expect(formatVipRemaining(null)).toBe('')
	})

	it('says expired for a date in the past', () => {
		expect(formatVipRemaining(fromNow(-HOUR))).toBe('منقضی‌شده')
	})

	it('counts whole days first, in Persian digits', () => {
		expect(formatVipRemaining(fromNow(3 * DAY + HOUR))).toBe('۳ روز')
	})

	it('counts one day and one hour as they are', () => {
		expect(formatVipRemaining(fromNow(DAY + HOUR))).toBe('۱ روز')
		expect(formatVipRemaining(fromNow(HOUR + 10 * MINUTE))).toBe('۱ ساعت')
	})

	it('counts hours when less than a day is left', () => {
		expect(formatVipRemaining(fromNow(5 * HOUR + 10 * MINUTE))).toBe('۵ ساعت')
	})

	it('says less than an hour at the very end', () => {
		expect(formatVipRemaining(fromNow(30 * MINUTE))).toBe('کمتر از ۱ ساعت')
	})
})

describe('hasVipTimeLeft', () => {
	it('is true only while the expiry is still ahead', () => {
		expect(hasVipTimeLeft(fromNow(HOUR))).toBe(true)
		expect(hasVipTimeLeft(fromNow(-HOUR))).toBe(false)
		expect(hasVipTimeLeft(null)).toBe(false)
	})
})

describe('formatVipExpiryDate', () => {
	it('is empty when there is no date', () => {
		expect(formatVipExpiryDate(undefined)).toBe('')
		expect(formatVipExpiryDate(null)).toBe('')
	})

	it('writes a valid date as a Jalali date', () => {
		expect(formatVipExpiryDate('2026-03-21T12:00:00Z')).not.toBe('')
	})
})
