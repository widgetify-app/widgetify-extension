import { describe, expect, it } from 'bun:test'
import type { StoredWidget } from '../utils/layout-engine/types'
import { WidgetKeys } from '../utils/layout-engine/types'
import { withWidgetMeta } from '../utils/with-widget-meta'

function widget(instanceId: string, meta?: StoredWidget['meta']): StoredWidget {
	return {
		id: WidgetKeys.notes,
		instanceId,
		position: { col: 0, row: 0 },
		size: { w: 2, h: 3 },
		meta,
	}
}

describe('withWidgetMeta', () => {
	it('replaces the meta of the matching widget only', () => {
		const layout = [
			widget('a', { variant: 'list' }),
			widget('b', { variant: 'list' }),
		]
		const next = withWidgetMeta(layout, 'a', { variant: 'sticky' })
		expect(next[0].meta).toEqual({ variant: 'sticky' })
		expect(next[1]).toBe(layout[1])
	})

	it('returns the same array for an instance that is not in the layout', () => {
		const layout = [widget('a', { variant: 'list' })]
		expect(withWidgetMeta(layout, 'preview-sample', { activeNoteId: 'n1' })).toBe(
			layout
		)
	})
})
