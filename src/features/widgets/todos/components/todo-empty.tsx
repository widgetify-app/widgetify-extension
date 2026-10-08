import { t } from '@/common/i18n'
import { WidgetEmpty } from '@/features/widgets/components/widget-empty'

export function TodosEmpty({ onAdd }: { onAdd?: () => void }) {
	return (
		<WidgetEmpty
			art="tasks"
			title={t('widgets.todos.empty.title')}
			description={
				onAdd ? t('widgets.todos.empty.hint') : t('widgets.todos.empty.hintBelow')
			}
			action={
				onAdd
					? {
							label: t('widgets.todos.input.newTask'),
							onClick: onAdd,
						}
					: undefined
			}
		/>
	)
}
