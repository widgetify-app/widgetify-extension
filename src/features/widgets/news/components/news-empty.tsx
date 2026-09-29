import { callEvent } from '@/common/utils/call-event'
import { WidgetEmpty } from '@/features/widgets/components/widget-empty'
import { WidgetTabKeys } from '@/features/widgets/types'

export function NewsEmpty() {
	return (
		<WidgetEmpty
			art="outlineNewspaper"
			title="هیچ منبع خبری فعالی نداری"
			description="منابع پیش‌فرض رو روشن کن یا یک فید دلخواه اضافه کن"
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
