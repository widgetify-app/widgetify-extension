import { PROFILE_TABS, SETTINGS_TABS } from './call-event'

type InternalEvent =
	| 'go_to_page'
	| 'openMiniApp'
	| 'openWidgetCatalog'
	| 'openProfile'
	| 'openSettings'
	| 'openFriends'
	| 'openMarketModal'

export type ResolvedLink =
	| { kind: 'external'; url: string }
	| {
			kind: 'internal'
			event: InternalEvent
			payload?: string | null | MarketTarget | FriendsTarget
	  }

type MarketTarget = { tab?: string; filter?: string }

type FriendsTarget = { tab: 'requests' }

const PAGES = ['home', 'explorer', 'mini-apps']

const MARKET_VIEWS: Record<string, MarketTarget> = {
	coins: { tab: 'coins' },
	wallpapers: { filter: 'wallpapers' },
	themes: { filter: 'THEME' },
	fonts: { filter: 'FONT' },
	pets: { filter: 'PET' },
	titles: { filter: 'BROWSER_TITLE' },
}

function externalLink(link: string): ResolvedLink | null {
	try {
		const url = new URL(link)

		return url.protocol === 'https:' || url.protocol === 'http:'
			? { kind: 'external', url: url.href }
			: null
	} catch {
		return null
	}
}

function internal(
	event: InternalEvent,
	payload?: string | null | MarketTarget | FriendsTarget
): ResolvedLink {
	return payload === undefined
		? { kind: 'internal', event }
		: { kind: 'internal', event, payload }
}

function tabLink(
	event: 'openProfile' | 'openSettings',
	tabs: readonly string[],
	tab: string | undefined
): ResolvedLink | null {
	if (tab === undefined) {
		return internal(event, event === 'openSettings' ? null : undefined)
	}

	return tabs.includes(tab) ? internal(event, tab) : null
}

function friendsLink(query: URLSearchParams): ResolvedLink | null {
	const keys = [...query.keys()]

	if (keys.length === 0) return internal('openFriends')
	if (keys.length === 1 && query.get('tab') === 'requests') {
		return internal('openFriends', { tab: 'requests' })
	}

	return null
}

function internalLink(value: string): ResolvedLink | null {
	const [path, queryText = ''] = value.split('?')
	const query = new URLSearchParams(queryText)
	const [section, ...rest] = path.slice(1).split('/')
	const detail = rest.length > 0 ? rest.join('/') : undefined

	if (section === 'friends') return detail === undefined ? friendsLink(query) : null
	if (queryText) return null

	if (section === 'mini-apps' && detail) return internal('openMiniApp', detail)
	if (section === 'widgets') return internal('openWidgetCatalog', detail)
	if (PAGES.includes(section) && detail === undefined) {
		return internal('go_to_page', section)
	}

	if (rest.length > 1) return null
	if (section === 'market') {
		if (detail === undefined) return internal('openMarketModal', {})

		return detail in MARKET_VIEWS
			? internal('openMarketModal', MARKET_VIEWS[detail])
			: null
	}
	if (section === 'profile') return tabLink('openProfile', PROFILE_TABS, detail)
	if (section === 'settings') return tabLink('openSettings', SETTINGS_TABS, detail)

	return null
}

export function resolveLink(link?: string | null): ResolvedLink | null {
	const value = link?.trim()

	if (!value) return null
	if (value.startsWith('//')) return null
	if (value.startsWith('/')) return internalLink(value)

	return externalLink(value)
}
