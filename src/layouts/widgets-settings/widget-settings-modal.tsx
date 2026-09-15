import type React from 'react'
import { Modal } from '@/components/ui'
import { PetSettings } from '@widget/pet/pet-setting'
import { RssFeedSetting } from '@widget/news/rss-feed-setting'
import { WeatherSetting } from '@widget/weather/weather-setting'
import { WigiArzSetting } from '@widget/wigi-arz/wigi-arz-setting'
import { WidgetTabKeys } from './tab-keys'

interface WidgetSettingModalConfig {
	title: string
	size: 'sm' | 'md' | 'lg' | 'xl'
	Component: React.ComponentType
}

const WIDGET_SETTING_MODALS: Record<string, WidgetSettingModalConfig> = {
	[WidgetTabKeys.Pet]: {
		title: 'تنظیمات حیوان خانگی',
		size: 'lg',
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
		title: 'تنظیمات ویجی نیوز',
		size: 'lg',
		Component: RssFeedSetting,
	},
}

interface WidgetSettingsModalProps {
	isOpen: boolean
	onClose: () => void
	selectedTab: WidgetTabKeys | null
	activeSettingTab?: WidgetTabKeys | null
	instanceId?: string
	size?: { w: number; h: number }
	onCloseSetting?: () => void
}

export function WidgetSettingsModal({
	isOpen,
	onClose,
	selectedTab,
	activeSettingTab,
	instanceId,
	size,
	onCloseSetting,
}: WidgetSettingsModalProps) {
	const settingKey =
		activeSettingTab ||
		(selectedTab && selectedTab !== WidgetTabKeys.widget_management
			? selectedTab
			: null)

	const activeSettingConfig = settingKey ? WIDGET_SETTING_MODALS[settingKey] : null
	const handleCloseSetting = onCloseSetting || onClose

	return (
		<Modal
			isOpen={!!activeSettingConfig}
			onClose={handleCloseSetting}
			title={activeSettingConfig?.title}
			size={activeSettingConfig?.size}
			direction="rtl"
			closeOnBackdropClick
		>
			{activeSettingConfig && (
				<activeSettingConfig.Component {...({ instanceId, size } as any)} />
			)}
		</Modal>
	)
}
