import { describe, expect, it } from 'bun:test'
import { computeHabitStats, type HabitDay } from '../utils/habit-stats'

const blank = (count: number): HabitDay[] =>
	Array.from({ length: count }, () => ({ isDone: false, hasRecord: false }))

const done = (count: number): HabitDay[] =>
	Array.from({ length: count }, () => ({ isDone: true, hasRecord: true }))

describe('computeHabitStats', () => {
	it('ignores the days before the habit was ever recorded', () => {
		const stats = computeHabitStats([...blank(180), ...done(3)])

		expect(stats.trackedDays).toBe(3)
		expect(stats.completionRate).toBe(100)
	})

	it('reports nothing rather than zero percent for an untouched habit', () => {
		const stats = computeHabitStats(blank(180))

		expect(stats.trackedDays).toBe(0)
		expect(stats.completionRate).toBe(0)
	})

	it('counts a missed day inside the tracked window', () => {
		const stats = computeHabitStats([
			...blank(10),
			...done(1),
			{ isDone: false, hasRecord: false },
			...done(2),
		])

		expect(stats.trackedDays).toBe(4)
		expect(stats.totalCompleted).toBe(3)
		expect(stats.completionRate).toBe(75)
	})

	it('keeps the streak alive while today is still open', () => {
		const stats = computeHabitStats([
			...done(4),
			{ isDone: false, hasRecord: false },
		])

		expect(stats.currentStreak).toBe(4)
	})

	it('breaks the streak once yesterday was missed too', () => {
		const stats = computeHabitStats([
			...done(4),
			{ isDone: false, hasRecord: false },
			{ isDone: false, hasRecord: false },
		])

		expect(stats.currentStreak).toBe(0)
	})

	it('remembers the best run even after it ends', () => {
		const stats = computeHabitStats([
			...done(5),
			{ isDone: false, hasRecord: false },
			{ isDone: false, hasRecord: false },
			...done(2),
		])

		expect(stats.longestStreak).toBe(5)
		expect(stats.currentStreak).toBe(2)
	})
})
