import type React from 'react'
import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import { Modal } from '@/components/ui'
import { PetSettings } from '@/features/widgets/pet/pet-setting'
import { RssFeedSetting } from '@/features/widgets/news/news-setting'
import { WeatherSetting } from '@/features/widgets/weather/weather-setting'
import { WigiArzSetting } from '@/features/widgets/wigi-arz/wigi-arz-setting'
import { ComboSetting } from '@/features/widgets/combo-widget/combo-widget-setting'
import { DotCalendarSetting } from '@/features/widgets/dot-calendar/dot-calendar-setting'
import { CalendarSetting } from '@/features/widgets/calendar/calendar-setting'
import { WidgetTabKeys } from '../types'

interface WidgetSettingModalConfig {
	title: string
	size: 'sm' | 'md' | 'lg' | 'xl'
	className?: string
	Component: React.ComponentType
}

const WIDGET_SETTING_MODALS: Record<string, WidgetSettingModalConfig> = {
	[WidgetTabKeys.Pet]: {
		title: 'تنظیمات حیوان خانگی',
		size: 'lg',
		className: 'max-w-2xl',
		Component: PetSettings,
	},
	[WidgetTabKeys.weather_settings]: {
		title: 'تنظیمات آب و هوا',
		size: 'lg',
		Component: WeatherSetting,
	},
	[WidgetTabKeys.wigiArz]: {
		title: 'تنظیمات ویجی ارز',
		size: 'lg',
		Component: WigiArzSetting,
	},
	[WidgetTabKeys.news_settings]: {
		title: 'تنظیمات اخبار',
		size: 'md',
		Component: RssFeedSetting,
	},
	[WidgetTabKeys.combo_settings]: {
		title: 'تنظیمات ویجت ترکیبی',
		size: 'lg',
		Component: ComboSetting,
	},
	[WidgetTabKeys.dot_calendar_settings]: {
		title: 'تنظیمات روزشمار',
		size: 'md',
		Component: DotCalendarSetting,
	},
	[WidgetTabKeys.calendar_settings]: {
		title: 'تنظیمات تقویم',
		size: 'md',
		Component: CalendarSetting,
	},
}

interface WidgetSettingsRequest {
	tab: WidgetTabKeys | null
	instanceId?: string
	size?: { w: number; h: number }
}

export function WidgetSettings() {
	const [request, setRequest] = useState<WidgetSettingsRequest | null>(null)
	const [isOpen, setIsOpen] = useState(false)

	useEffect(
		() =>
			listenEvent('openWidgetsSettings', (data) => {
				if (!data.tab || data.tab === WidgetTabKeys.widget_management) {
					callEvent('openAddCustomWidgetModal')
				} else {
					setRequest(data)
					setIsOpen(true)
					Analytics.event('widget_settings_opened')
				}
			}),
		[]
	)

	const activeSettingConfig = request?.tab ? WIDGET_SETTING_MODALS[request.tab] : null

	return (
		<Modal
			isOpen={isOpen && !!activeSettingConfig}
			onClose={() => setIsOpen(false)}
			title={activeSettingConfig?.title}
			size={activeSettingConfig?.size}
			className={activeSettingConfig?.className}
			closeOnBackdropClick
		>
			{activeSettingConfig && (
				<activeSettingConfig.Component
					key={`${request?.tab}-${request?.instanceId}`}
					{...({ instanceId: request?.instanceId, size: request?.size } as any)}
				/>
			)}
		</Modal>
	)
}
