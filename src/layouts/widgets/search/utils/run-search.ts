import type { EngineMeta } from '@/services/hooks/trends/get-trends.hook'

export function runSearch(content: string, engine: EngineMeta) {
	if (engine.id === 'google') {
		browser.search.query({
			text: content,
			disposition: browser.search.Disposition.CURRENT_TAB,
		})
		return
	}

	window.open(engine.prefix + encodeURIComponent(content), '_self')
}
