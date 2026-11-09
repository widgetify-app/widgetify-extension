import { describe, expect, it } from 'bun:test'
import { MARK_ALL_BATCH, planMarkAll } from '@/services/extension/notification-map'
import type { NotificationItem } from '@/services/extension/notification.interface'

function card(
	id: string,
	source: 'inbox' | 'broadcast',
	closeable = true
): NotificationItem {
	return { id, title: id, closeable, source }
}

describe('planMarkAll', () => {
	it('puts inbox items and broadcasts in separate lists, in order', () => {
		const plan = planMarkAll([
			card('a', 'inbox'),
			card('b', 'broadcast'),
			card('c', 'inbox'),
		])

		expect(plan).toEqual({ inbox: [['a', 'c']], broadcasts: [['b']] })
	})

	it('leaves out cards that cannot be closed and cards without an id', () => {
		const plan = planMarkAll([
			card('a', 'inbox'),
			card('locked', 'broadcast', false),
			{ title: 'no id', closeable: true, source: 'inbox' },
		])

		expect(plan).toEqual({ inbox: [['a']], broadcasts: [] })
	})

	it('is empty when there is nothing to mark', () => {
		expect(planMarkAll([])).toEqual({ inbox: [], broadcasts: [] })
	})

	it('splits a long list into requests of at most 100', () => {
		const many = Array.from({ length: 230 }, (_, index) => card(`i${index}`, 'inbox'))

		const plan = planMarkAll(many)

		expect(MARK_ALL_BATCH).toBe(100)
		expect(plan.inbox.map((batch) => batch.length)).toEqual([100, 100, 30])
		expect(plan.inbox.flat()).toEqual(many.map((item) => item.id as string))
	})
})
