import { describe, expect, it } from 'bun:test'
import {
	jalaliDateParts,
	jalaliMonthCells,
	jalaliWeekdayInitials,
} from '../utils/jalali-calendar'

describe('jalaliMonthCells', () => {
	it('lays out Mehr 1405 from a Wednesday, with the 18th as today', () => {
		const cells = jalaliMonthCells(new Date(2026, 9, 10, 12))
		expect(cells).toHaveLength(35)
		expect(cells.slice(0, 5).map((cell) => cell.day)).toEqual([
			null,
			null,
			null,
			null,
			1,
		])
		expect(cells.filter((cell) => cell.day !== null)).toHaveLength(30)
		expect(cells.findIndex((cell) => cell.isToday)).toBe(4 + 17)
	})

	it('always fills whole weeks and marks the last column as Friday', () => {
		for (const month of [0, 2, 5, 8, 11]) {
			const cells = jalaliMonthCells(new Date(2026, month, 15, 12))
			expect(cells.length % 7).toBe(0)
			expect(cells.filter((cell) => cell.isToday)).toHaveLength(1)
			expect(
				cells.filter((cell, index) => cell.isFriday !== (index % 7 === 6))
			).toEqual([])
		}
	})
})

describe('jalaliDateParts', () => {
	it('names the Jalali day, month and year in Persian digits', () => {
		expect(jalaliDateParts(new Date(2026, 9, 10, 12))).toEqual({
			weekday: 'شنبه',
			day: '۱۸',
			month: 'مهر',
			year: '۱۴۰۵',
		})
	})
})

describe('jalaliWeekdayInitials', () => {
	it('starts the week on Saturday', () => {
		const initials = jalaliWeekdayInitials()
		expect(initials).toHaveLength(7)
		expect(initials[0]).toBe('ش')
		expect(initials[6]).toBe('ج')
	})
})
