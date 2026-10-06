import { callEvent } from '@/common/utils/call-event'
import { WidgetEmpty } from '@/features/widgets/components/widget-empty'
import { WidgetTabKeys } from '@/features/widgets/types'

export function NewsEmpty() {
	return (
		<WidgetEmpty
			art="outlineNewspaper"
			title="هیچ منبع خبری‌ای روشن نیست"
			description="اخبار پیش‌فرض یا یه منبع دیگه رو روشن کن"
			action={{
				label: 'تنظیمات اخبار',
				onClick: () =>
					callEvent('openWidgetsSettings', {
						tab: WidgetTabKeys.news_settings,
					}),
			}}
		/>
	)
}
