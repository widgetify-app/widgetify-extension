import type { PartnerCatalogItem } from '../../types'

interface PartnerCatalogState {
	items: PartnerCatalogItem[]
	ready: boolean
}

export function createPartnerCatalogStore() {
	let state: PartnerCatalogState = { items: [], ready: false }
	const listeners = new Set<() => void>()

	const publish = (next: PartnerCatalogState) => {
		state = next
		for (const listener of listeners) listener()
	}

	return {
		get: () => state,
		subscribe: (listener: () => void) => {
			listeners.add(listener)
			return () => {
				listeners.delete(listener)
			}
		},
		set: (items: PartnerCatalogItem[]) => {
			if (state.ready && JSON.stringify(state.items) === JSON.stringify(items))
				return
			publish({ items, ready: true })
		},
		markReady: () => {
			if (!state.ready) publish({ items: state.items, ready: true })
		},
	}
}

export const partnerCatalogStore = createPartnerCatalogStore()
