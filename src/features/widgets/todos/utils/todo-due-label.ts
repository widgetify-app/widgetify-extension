import { t } from '@/common/i18n'
import type { Moment } from 'jalali-moment'

export function todoDueLabel(due: Moment, now: Moment): string {
	if (!due.isValid()) return ''
	if (due.isSame(now, 'day')) return t('widgets.todos.filter.today')
	if (due.isSame(now.clone().add(1, 'day'), 'day'))
		return t('widgets.todos.due.tomorrow')
	return due.clone().locale('fa').format('jD jMMMM')
}
