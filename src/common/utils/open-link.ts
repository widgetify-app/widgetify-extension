import { callEvent } from './call-event'
import { type ResolvedLink, resolveLink } from './resolve-link'

export function openResolvedLink(resolved: ResolvedLink) {
	if (resolved.kind === 'external') {
		window.open(resolved.url, '_blank', 'noopener,noreferrer')
		return
	}

	callEvent(resolved.event as 'openSettings', resolved.payload as null)
}

export function openLink(link?: string | null) {
	const resolved = resolveLink(link)

	if (!resolved) return false

	openResolvedLink(resolved)
	return true
}
