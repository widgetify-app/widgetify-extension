import { describe, expect, it } from 'bun:test'
import type { PartnerCatalogItem } from '../types'
import { createPartnerCatalogStore } from '../utils/partner-catalog/partner-catalog-store'

function item(key: string): PartnerCatalogItem {
	return {
		widgetKey: `widget:${key}`,
		slug: key,
		title: key,
		emoji: '🧩',
		iconUrl: null,
		description: null,
		category: 'info',
		isVipOnly: false,
		isNew: false,
		allowedSizes: [{ w: 2, h: 1 }],
		defaultSize: { w: 2, h: 1 },
		variants: [],
		canDuplicate: false,
		widgetUrl: `https://iframes.example.test/w/${key}`,
		origin: 'https://iframes.example.test',
		scopes: [],
		contactRequirement: 'EMAIL_OR_PHONE',
		allow: [],
		sandbox: [],
		timeoutMs: null,
	}
}

describe('createPartnerCatalogStore', () => {
	it('starts empty and not ready', () => {
		expect(createPartnerCatalogStore().get()).toEqual({ items: [], ready: false })
	})

	it('becomes ready with the items it is given and tells its listeners', () => {
		const store = createPartnerCatalogStore()
		let calls = 0

		store.subscribe(() => {
			calls += 1
		})
		store.set([item('a')])

		expect(store.get().ready).toBe(true)
		expect(store.get().items.map((entry) => entry.slug)).toEqual(['a'])
		expect(calls).toBe(1)
	})

	it('keeps the same snapshot when nothing changed', () => {
		const store = createPartnerCatalogStore()
		let calls = 0

		store.set([item('a')])
		const snapshot = store.get()

		store.subscribe(() => {
			calls += 1
		})
		store.set([item('a')])

		expect(store.get()).toBe(snapshot)
		expect(calls).toBe(0)
	})

	it('publishes a new snapshot when the catalog changes', () => {
		const store = createPartnerCatalogStore()

		store.set([item('a')])
		const first = store.get()

		store.set([item('a'), item('b')])

		expect(store.get()).not.toBe(first)
		expect(store.get().items).toHaveLength(2)
	})

	it('marks ready without losing the items it already has', () => {
		const store = createPartnerCatalogStore()
		let calls = 0

		store.subscribe(() => {
			calls += 1
		})
		store.markReady()
		store.markReady()

		expect(store.get()).toEqual({ items: [], ready: true })
		expect(calls).toBe(1)
	})

	it('stops notifying after unsubscribe', () => {
		const store = createPartnerCatalogStore()
		let calls = 0

		const unsubscribe = store.subscribe(() => {
			calls += 1
		})

		unsubscribe()
		store.set([item('a')])

		expect(calls).toBe(0)
	})
})
