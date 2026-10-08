import { t } from '@/common/i18n'
import { WidgetEmpty } from '@/features/widgets/components/widget-empty'

interface NoteEmptyProps {
	onAdd: () => void
}

export function NoteEmpty({ onAdd }: NoteEmptyProps) {
	return (
		<WidgetEmpty
			art="notes"
			title={t('widgets.notes.emptyTitle')}
			description={t('widgets.notes.emptyDescription')}
			action={{ label: t('widgets.notes.new'), onClick: onAdd }}
		/>
	)
}
