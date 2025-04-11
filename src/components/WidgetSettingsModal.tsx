import { useTheme } from '@/context/theme.context'
import { useWidgetVisibility } from '@/context/widget-visibility.context'
import CustomCheckbox from './checkbox'
import Modal from './modal'

interface WidgetSettingsModalProps {
	isOpen: boolean
	onClose: () => void
}

export function WidgetSettingsModal({ isOpen, onClose }: WidgetSettingsModalProps) {
	const { visibility, toggleWidget } = useWidgetVisibility()
	const { themeUtils } = useTheme()

	const handleNewsToggle = () => {
		if (visibility.widgetify) {
			toggleWidget('widgetify')
		}

		toggleWidget('news')
	}

	const handleWidgetifyToggle = () => {
		if (!visibility.widgetify && visibility.news) {
			toggleWidget('news')
		}

		toggleWidget('widgetify')
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="تنظیمات ویجت"
			size="md"
			direction="rtl"
		>
			<div className="p-4 space-y-4">
				<p className={`text-sm mb-4 ${themeUtils.getTextColor()}`}>
					انتخاب کنید کدام ویجت‌ها در داشبورد شما نمایش داده شوند. نوار جستجو همیشه نمایش
					داده می‌شود.
				</p>

				<div className="space-y-3">
					<CustomCheckbox
						checked={visibility.widgetify}
						onChange={handleWidgetifyToggle}
						label="نمایش کارت ویجتیفای"
					/>

					<div className="relative">
						<CustomCheckbox
							checked={visibility.news}
							onChange={handleNewsToggle}
							label="ویجی نیوز"
						/>
						{visibility.widgetify && (
							<div className="mt-1 mr-6 text-xs font-light text-amber-500">
								برای فعال کردن اخبار، باید کارت ویجتیفای غیرفعال باشد
							</div>
						)}
						{!visibility.widgetify && !visibility.news && (
							<div className="mt-1 mr-6 text-xs font-light text-blue-500">
								می‌توانید اخبار را فعال کنید
							</div>
						)}
					</div>

					<div className="my-3 border-t border-gray-200 dark:border-gray-700"></div>

					<CustomCheckbox
						checked={visibility.arzLive}
						onChange={() => toggleWidget('arzLive')}
						label="نمایش ارز و مبادله"
					/>

					<CustomCheckbox
						checked={visibility.calendar}
						onChange={() => toggleWidget('calendar')}
						label="نمایش تقویم"
					/>

					<CustomCheckbox
						checked={visibility.weather}
						onChange={() => toggleWidget('weather')}
						label="نمایش آب و هوا"
					/>
				</div>
			</div>
		</Modal>
	)
}
