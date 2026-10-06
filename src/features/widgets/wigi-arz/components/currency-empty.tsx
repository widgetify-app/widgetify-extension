import { callEvent } from '@/common/utils/call-event'
import { WidgetEmpty } from '@/features/widgets/components/widget-empty'
import { WidgetTabKeys } from '@/features/widgets/types'

interface CurrencyEmptyProps {
	instanceId?: string
}

export function CurrencyEmpty({ instanceId }: CurrencyEmptyProps) {
	return (
		<WidgetEmpty
			art="coin"
			title="هنوز ارزی انتخاب نکردی"
			description="دلار، طلا یا هر ارزی که می‌خوای رو اضافه کن تا قیمتش همین‌جا باشه"
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
