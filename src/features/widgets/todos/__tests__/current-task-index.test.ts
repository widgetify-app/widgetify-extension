import { describe, expect, it } from 'bun:test'
import { currentTaskIndex, nextOpenTaskId } from '../utils/current-task-index'

const tasks = [
	{ id: 'a', completed: true },
	{ id: 'b', completed: false },
	{ id: 'c', completed: true },
	{ id: 'd', completed: false },
]

describe('currentTaskIndex', () => {
	it('keeps the task the user moved to', () => {
		expect(currentTaskIndex(tasks, 'c')).toBe(2)
	})

	it('starts on the first open task', () => {
		expect(currentTaskIndex(tasks, null)).toBe(1)
	})

	it('falls back to the first open task when the chosen one is gone', () => {
		expect(currentTaskIndex(tasks, 'deleted')).toBe(1)
	})

	it('shows the first task when every task is done', () => {
		expect(
			currentTaskIndex(
				[
					{ id: 'a', completed: true },
					{ id: 'b', completed: true },
				],
				null
			)
		).toBe(0)
	})
})

describe('nextOpenTaskId', () => {
	it('moves forward to the next open task', () => {
		expect(nextOpenTaskId(tasks, 1)).toBe('d')
	})

	it('wraps back to an earlier open task at the end', () => {
		expect(nextOpenTaskId(tasks, 3)).toBe('b')
	})

	it('has nothing when no other task is open', () => {
		expect(nextOpenTaskId([{ id: 'a', completed: false }], 0)).toBeNull()
	})
})
