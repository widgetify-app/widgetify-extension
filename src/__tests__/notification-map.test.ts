import { describe, expect, it } from 'bun:test'
import { buildNotifications } from '@/services/extension/notification-map'
import type {
	RawBroadcast,
	RawInboxItem,
} from '@/services/extension/notification.interface'

function inbox(overrides: Partial<RawInboxItem> = {}): RawInboxItem {
	return {
		id: 'n1',
		title: 'Title',
		body: 'Body',
		icon: null,
		action: { link: '/profile/friends' },
		groupCount: 1,
		createdAt: '2026-03-01T00:00:00.000Z',
		readAt: null,
		...overrides,
	}
}

function broadcast(overrides: Partial<RawBroadcast> = {}): RawBroadcast {
	return {
		id: 'b1',
		title: 'Broadcast',
		body: null,
		media: null,
		action: {},
		dialog: null,
		closeable: true,
		...overrides,
	}
}

const NO_SURFACES = { inbox: [], island: null, dialog: null }

describe('buildNotifications', () => {
	it('maps an unread inbox item to a card that can be closed', () => {
		const { cards } = buildNotifications([inbox()], NO_SURFACES)

		expect(cards).toEqual([
			{
				id: 'n1',
				title: 'Title',
				description: 'Body',
				icon: undefined,
				link: '/profile/friends',
				closeable: true,
				groupCount: 1,
				source: 'inbox',
				createdAt: '2026-03-01T00:00:00.000Z',
			},
		])
	})

	it('leaves out inbox items that were read', () => {
		const { cards } = buildNotifications(
			[inbox({ readAt: '2026-03-02T00:00:00.000Z' })],
			NO_SURFACES
		)

		expect(cards).toEqual([])
	})

	it('puts inbox items before broadcasts and keeps the closeable flag of a broadcast', () => {
		const { cards } = buildNotifications([inbox()], {
			...NO_SURFACES,
			inbox: [broadcast({ closeable: false })],
		})

		expect(cards.map((card) => card.id)).toEqual(['n1', 'b1'])
		expect(cards[1]).toMatchObject({ closeable: false, source: 'broadcast' })
	})

	it('keeps the link of a broadcast card and leaves it out when there is none', () => {
		const { cards } = buildNotifications([], {
			...NO_SURFACES,
			inbox: [
				broadcast({ id: 'a' }),
				broadcast({ id: 'b', action: { link: 'https://x.test' } }),
			],
		})

		expect(cards[0].link).toBeUndefined()
		expect(cards[1].link).toBe('https://x.test')
	})

	it('hides the broadcasts that were closed on this browser', () => {
		const data = buildNotifications(
			[],
			{
				inbox: [broadcast({ id: 'gone' }), broadcast({ id: 'kept' })],
				island: broadcast({ id: 'gone' }),
				dialog: broadcast({ id: 'gone' }),
			},
			new Set(['gone'])
		)

		expect(data.cards.map((card) => card.id)).toEqual(['kept'])
		expect(data.island).toBeNull()
		expect(data.dialog).toBeNull()
	})

	it('maps the island with its icon and action', () => {
		const { island } = buildNotifications([], {
			...NO_SURFACES,
			island: broadcast({
				id: 'i1',
				body: 'Text',
				media: 'https://x.test/a.png',
				action: { link: '/explorer' },
			}),
		})

		expect(island).toEqual({
			id: 'i1',
			title: 'Broadcast',
			description: 'Text',
			icon: 'https://x.test/a.png',
			link: '/explorer',
		})
	})

	it('maps the dialog with its own title, button and link', () => {
		const { dialog } = buildNotifications([], {
			...NO_SURFACES,
			dialog: broadcast({
				id: 'd1',
				body: 'Text',
				action: { link: 'https://x.test/buy' },
				dialog: {
					dialogTitle: 'Big news',
					buttonLabel: 'Go',
					buttonColor: '#111111',
				},
			}),
		})

		expect(dialog).toMatchObject({
			id: 'd1',
			dialogTitle: 'Big news',
			description: 'Text',
			link: 'https://x.test/buy',
			buttonLabel: 'Go',
			buttonColor: '#111111',
		})
	})
})
