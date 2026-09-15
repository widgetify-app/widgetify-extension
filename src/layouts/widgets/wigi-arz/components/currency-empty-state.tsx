import type React from 'react'
import { callEvent } from '@/common/utils/call-event'
import { Button } from '@/components/ui'
import { WidgetTabKeys } from '@/layouts/widgets-settings/tab-keys'

interface CurrencyEmptyStateProps {
	compact?: boolean
	instanceId?: string
}

export const CurrencyEmptyState: React.FC<CurrencyEmptyStateProps> = ({
	compact,
	instanceId,
}) => {
	const onSettingClick = () => {
		callEvent('openWidgetsSettings', { tab: WidgetTabKeys.wigiArz, instanceId })
	}

	if (compact) {
		return (
			<div className="flex flex-col items-center justify-center flex-1 px-5 py-16 gap-y-1.5">
				<span
					aria-hidden="true"
					className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-base-content/10"
				>
					💲
				</span>
				<p className="mt-1 text-center text-content">
					ارزهای مورد نظر خود را اضافه کنید
				</p>
				<Button rounded="xl" size="sm" color="primary" onClick={onSettingClick}>
					افزودن ارز
				</Button>
			</div>
		)
	}

	return (
		<div className="flex flex-col items-center justify-center flex-1 min-h-0 px-5 py-4 text-center gap-y-2">
			<img
				src="https://cdn.widgetify.ir/system/no-items.png"
				alt=""
				className="flex-1 object-contain w-auto min-h-0 max-w-40 select-none"
			/>
			<div className="flex flex-col shrink-0 gap-0.5">
				<p className="text-xs font-bold text-content">هنوز ارزی اضافه نکردی</p>
				<p className="text-[11px] text-muted">
					برای مشاهده قیمت لحظه‌ای، ارزهای دلخواهت رو انتخاب کن
				</p>
			</div>
			<Button
				rounded="xl"
				size="sm"
				color="primary"
				onClick={onSettingClick}
				className="mt-1 shrink-0"
			>
				افزودن ارز
			</Button>
		</div>
	)
}
