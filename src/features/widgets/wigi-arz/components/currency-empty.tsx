import { callEvent } from '@/common/utils/call-event'
import { WidgetEmpty } from '@/features/widgets/components/widget-empty'
import { WidgetTabKeys } from '@/features/widgets/types'
import { t } from '@/common/i18n'

interface CurrencyEmptyProps {
	instanceId?: string
}

export function CurrencyEmpty({ instanceId }: CurrencyEmptyProps) {
	return (
		<WidgetEmpty
			art="coin"
			title={t('widgets.wigiArz.emptyTitle')}
			description={t('widgets.wigiArz.emptyDescription')}
			action={{
				label: t('widgets.wigiArz.add'),
				onClick: () =>
					callEvent('openWidgetsSettings', {
						tab: WidgetTabKeys.wigiArz,
						instanceId,
					}),
			}}
		/>
	)
}
