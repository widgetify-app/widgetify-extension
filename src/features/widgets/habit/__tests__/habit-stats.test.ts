import { describe, expect, it } from 'bun:test'
import { computeHabitStats, type HabitDay } from '../utils/habit-stats'

const missed = (count: number): HabitDay[] =>
	Array.from({ length: count }, () => ({ isDone: false }))

const done = (count: number): HabitDay[] =>
	Array.from({ length: count }, () => ({ isDone: true }))

describe('computeHabitStats', () => {
	it('counts every successful day, wherever it falls', () => {
		const stats = computeHabitStats([
			...missed(10),
			...done(1),
			...missed(1),
			...done(2),
		])

		expect(stats.totalCompleted).toBe(3)
	})

	it('reports zero for an untouched habit', () => {
		const stats = computeHabitStats(missed(180))

		expect(stats).toEqual({ currentStreak: 0, longestStreak: 0, totalCompleted: 0 })
	})

	it('keeps the streak alive while today is still open', () => {
		const stats = computeHabitStats([...done(4), ...missed(1)])

		expect(stats.currentStreak).toBe(4)
	})

	it('breaks the streak once yesterday was missed too', () => {
		const stats = computeHabitStats([...done(4), ...missed(2)])

		expect(stats.currentStreak).toBe(0)
	})

	it('remembers the best run even after it ends', () => {
		const stats = computeHabitStats([...done(5), ...missed(2), ...done(2)])

		expect(stats.longestStreak).toBe(5)
		expect(stats.currentStreak).toBe(2)
	})
})
