import { DATE_FILTER_OPTIONS, SORT_OPTIONS, UNFILTERED_TAGS } from '../constants'

export type TodoFilterKind = 'date' | 'tag' | 'sort'

interface ActiveTodoFilter {
	kind: TodoFilterKind
	label: string
}

export function activeTodoFilters(
	dateFilter: string,
	tagFilter: string,
	sort: string
): ActiveTodoFilter[] {
	const filters: ActiveTodoFilter[] = []

	const dateLabel = DATE_FILTER_OPTIONS.find(
		(option) => option.value === dateFilter
	)?.label
	if (dateFilter !== 'all' && dateLabel) {
		filters.push({ kind: 'date', label: dateLabel })
	}

	if (!UNFILTERED_TAGS.includes(tagFilter)) {
		filters.push({ kind: 'tag', label: tagFilter })
	}

	const sortLabel = SORT_OPTIONS.find((option) => option.value === sort)?.label
	if (sort !== 'def' && sortLabel) {
		filters.push({ kind: 'sort', label: sortLabel })
	}

	return filters
}
