import { t } from '@/common/i18n'
import { callEvent } from '@/common/utils/call-event'
import { WidgetEmpty } from '@/features/widgets/components/widget-empty'

interface HabitEmptyProps {
	onAdd: () => void
}

export function HabitEmpty({ onAdd }: HabitEmptyProps) {
	return (
		<WidgetEmpty
			art="habits"
			title={t('widgets.habit.empty.title')}
			description={t('widgets.habit.empty.hint')}
			action={{ label: t('widgets.habit.empty.cta'), onClick: onAdd }}
		/>
	)
}

export function HabitSignedOut() {
	return (
		<WidgetEmpty
			art="user"
			title={t('widgets.habit.empty.authTitle')}
			description={t('widgets.habit.empty.authHint')}
			action={{
				label: t('widgets.habit.empty.authCta'),
				onClick: () => callEvent('openProfile'),
			}}
		/>
	)
}
