import { describe, expect, it } from 'bun:test'
import { activeTodoFilters } from '../utils/active-filters'

describe('activeTodoFilters', () => {
	it('lists every filter that is on, not only the first', () => {
		expect(activeTodoFilters('this_month', 'کار', 'high').map((f) => f.kind)).toEqual(
			['date', 'tag', 'sort']
		)
	})

	it('lists nothing when every filter is at its default', () => {
		expect(activeTodoFilters('all', '', 'def')).toEqual([])
		expect(activeTodoFilters('all', '-all-', 'def')).toEqual([])
	})

	it('names a tag filter by the tag itself', () => {
		expect(activeTodoFilters('all', 'خرید', 'def')).toEqual([
			{ kind: 'tag', label: 'خرید' },
		])
	})

	it('skips a date filter or an order it does not know', () => {
		expect(activeTodoFilters('thisMonth', '', 'newest')).toEqual([])
	})
})
