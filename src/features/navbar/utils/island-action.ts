type IslandAction =
	| { kind: 'link'; url: string }
	| { kind: 'page'; goTo: string }
	| { kind: 'action'; goTo: string; target?: string }

interface IslandTapInput {
	type?: string
	goTo?: string | null
	target?: string | null
	link?: string | null
}

function safeUrl(link: string | null | undefined) {
	if (!link) return null

	try {
		const url = new URL(link)

		return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
	} catch {
		return null
	}
}

export function resolveIslandAction({
	type,
	goTo,
	target,
	link,
}: IslandTapInput): IslandAction | null {
	const url = safeUrl(link)

	if (url) return { kind: 'link', url }

	if (type === 'page' && goTo) return { kind: 'page', goTo }

	if (type === 'action' && goTo) {
		return { kind: 'action', goTo, ...(target && { target }) }
	}

	return null
}
