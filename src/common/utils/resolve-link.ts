import { PROFILE_TABS, SETTINGS_TABS } from './call-event'

type InternalEvent =
	| 'go_to_page'
	| 'openMiniApp'
	| 'openWidgetCatalog'
	| 'openProfile'
	| 'openSettings'

export type ResolvedLink =
	| { kind: 'external'; url: string }
	| { kind: 'internal'; event: InternalEvent; payload?: string | null }

const PAGES = ['home', 'explorer', 'mini-apps']

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

function internal(event: InternalEvent, payload?: string | null): ResolvedLink {
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

function internalLink(path: string): ResolvedLink | null {
	const [section, ...rest] = path.slice(1).split('/')
	const detail = rest.length > 0 ? rest.join('/') : undefined

	if (section === 'mini-apps' && detail) return internal('openMiniApp', detail)
	if (section === 'widgets') return internal('openWidgetCatalog', detail)
	if (PAGES.includes(section) && detail === undefined) {
		return internal('go_to_page', section)
	}

	if (rest.length > 1) return null
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
