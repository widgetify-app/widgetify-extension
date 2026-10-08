import { t } from '@/common/i18n'
import { callEvent } from '@/common/utils/call-event'
import { WidgetEmpty } from '@/features/widgets/components/widget-empty'
import { WidgetTabKeys } from '@/features/widgets/types'

export function NewsEmpty() {
	return (
		<WidgetEmpty
			art="outlineNewspaper"
			title={t('widgets.news.noSourcesTitle')}
			description={t('widgets.news.noSourcesDescription')}
			action={{
				label: t('widgets.news.noSourcesAction'),
				onClick: () =>
					callEvent('openWidgetsSettings', {
						tab: WidgetTabKeys.news_settings,
					}),
			}}
		/>
	)
}
