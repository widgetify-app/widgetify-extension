import { callEvent } from '@/common/utils/call-event'
import { WidgetEmpty } from '@/features/widgets/components/widget-empty'
import { WidgetTabKeys } from '@/features/widgets/types'

interface CurrencyEmptyProps {
	compact?: boolean
	instanceId?: string
}

export function CurrencyEmpty({ compact, instanceId }: CurrencyEmptyProps) {
	return (
		<WidgetEmpty
			art="illustration"
			title="هنوز ارزی اضافه نکردی"
			description={
				compact
					? undefined
					: 'برای مشاهده قیمت لحظه‌ای، ارزهای دلخواهت رو انتخاب کن'
			}
			action={{
				label: 'افزودن ارز',
				onClick: () =>
					callEvent('openWidgetsSettings', {
						tab: WidgetTabKeys.wigiArz,
						instanceId,
					}),
			}}
		/>
	)
}
