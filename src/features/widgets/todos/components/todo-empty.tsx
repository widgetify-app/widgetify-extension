import { t } from '@/common/i18n'
import { WidgetEmpty } from '@/features/widgets/components/widget-empty'

export function TodosEmpty() {
	return (
		<WidgetEmpty
			art="tasks"
			title={t('widgets.todos.empty.title')}
			description={t('widgets.todos.empty.hintBelow')}
		/>
	)
}
