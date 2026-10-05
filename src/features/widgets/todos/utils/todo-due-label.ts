import type { Moment } from 'jalali-moment'

export function todoDueLabel(due: Moment, now: Moment): string {
	if (!due.isValid()) return ''
	if (due.isSame(now, 'day')) return 'امروز'
	if (due.isSame(now.clone().add(1, 'day'), 'day')) return 'فردا'
	return due.clone().locale('fa').format('jD jMMMM')
}
