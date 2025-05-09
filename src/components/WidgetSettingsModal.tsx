import { getTextColor, useTheme } from '@/context/theme.context'
import { useWidgetVisibility } from '@/context/widget-visibility.context'
import CustomCheckbox from './checkbox'
import Modal from './modal'

interface WidgetSettingsModalProps {
	isOpen: boolean
	onClose: () => void
}

export function WidgetSettingsModal({ isOpen, onClose }: WidgetSettingsModalProps) {
	const { visibility, toggleWidget } = useWidgetVisibility()
	const { theme } = useTheme()

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

	const handleComboWidgetToggle = () => {
		if (!visibility.comboWidget && visibility.arzLive) {
			toggleWidget('arzLive')
		}

		toggleWidget('comboWidget')
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="⚙️ تنظیمات ویجت"
			size="md"
			direction="rtl"
		>
			<div className="p-4 space-y-4">
				<p className={`text-sm mb-4 ${getTextColor(theme)}`}>
					انتخاب کنید کدام ویجت‌ها در داشبورد شما نمایش داده شوند.
				</p>

				<div className="space-y-4">
					<div className="p-3 space-y-3 rounded-lg bg-black/5 dark:bg-white/5">
						<h3 className={`text-sm font-bold mb-2 ${getTextColor(theme)}`}>
							ویجت‌های ستون راست
						</h3>

						<CustomCheckbox
							checked={visibility.widgetify}
							onChange={handleWidgetifyToggle}
							label="🏠 نمایش کارت ویجتیفای"
							fontSize="font-light"
						/>

						<div className="relative">
							<CustomCheckbox
								checked={visibility.news}
								onChange={handleNewsToggle}
								label="📰 ویجی نیوز"
								disabled={visibility.widgetify}
								fontSize="font-light"
							/>
							{visibility.widgetify && (
								<div className="mt-1 mr-6 text-xs font-light text-amber-500">
									ابتدا کارت ویجتیفای را غیرفعال کنید
								</div>
							)}
						</div>
					</div>

					<div className="p-3 space-y-3 rounded-lg bg-black/5 dark:bg-white/5">
						<h3 className={`text-sm font-bold mb-2 ${getTextColor(theme)}`}>
							ویجت‌های ستون چپ
						</h3>

						<div className="relative">
							<CustomCheckbox
								checked={visibility.comboWidget}
								onChange={handleComboWidgetToggle}
								label="🔄 ویجت ترکیبی (ارز و اخبار در یک ویجت)"
								fontSize="font-light"
							/>
						</div>

						<CustomCheckbox
							checked={visibility.arzLive && !visibility.comboWidget}
							onChange={() => {
								if (!visibility.comboWidget) {
									toggleWidget('arzLive')
								}
							}}
							label="💰 ویجی‌ ارز"
							disabled={visibility.comboWidget}
							fontSize="font-light"
						/>
						{visibility.comboWidget && (
							<div className="pr-6 mt-1 text-xs font-light text-blue-500">
								با فعال بودن ویجت ترکیبی، ویجی ارز در همان ویجت قابل دسترسی است
							</div>
						)}
					</div>

					<div className="p-3 space-y-3 rounded-lg bg-black/5 dark:bg-white/5">
						<h3 className={`text-sm font-bold mb-2 ${getTextColor(theme)}`}>
							ویجت‌های پایین صفحه
						</h3>

						<CustomCheckbox
							checked={visibility.calendar}
							onChange={() => toggleWidget('calendar')}
							label="📅 نمایش تقویم"
							fontSize="font-light"
						/>

						<CustomCheckbox
							checked={visibility.weather}
							onChange={() => toggleWidget('weather')}
							label="🌤️ نمایش آب و هوا"
							fontSize="font-light"
						/>

						<CustomCheckbox
							checked={visibility.todos}
							onChange={() => toggleWidget('todos')}
							label="✅ نمایش یادداشت ها"
							fontSize="font-light"
						/>

						<CustomCheckbox
							checked={visibility.tools}
							onChange={() => toggleWidget('tools')}
							label="🧰 نمایش ابزارها"
							fontSize="font-light"
						/>
					</div>
				</div>
			</div>
		</Modal>
	)
}
