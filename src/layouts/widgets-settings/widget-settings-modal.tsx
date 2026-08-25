import React from 'react'
import { Modal } from '@/components/ui'
import { PetSettings } from '../widgetify-card/pets/setting/pet-setting'
import { RssFeedSetting } from '../widgets/news/rss-feed-setting'
import { WeatherSetting } from '../widgets/weather/weather-setting'
import { WigiArzSetting } from '../widgets/wigi-arz/wigi-arz-setting'
import { WigiPadSetting } from '../widgets/wigi-pad/wigi-pad-setting'
import { WidgetTabKeys } from './constant/tab-keys'
import { AddWidgetModal } from '../widgets-manager'
import { UI, useAppearanceSetting } from '@/context/appearance.context'

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
	[WidgetTabKeys.wigiPad]: {
		title: 'تنظیمات ویجی پد',
		size: 'lg',
		Component: WigiPadSetting,
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
	const { ui } = useAppearanceSetting()

	if (ui === UI.SIMPLE) {
		return null
	}

	const isManageOpen =
		isOpen && (!selectedTab || selectedTab === WidgetTabKeys.widget_management)

	const settingKey =
		activeSettingTab ||
		(selectedTab && selectedTab !== WidgetTabKeys.widget_management
			? selectedTab
			: null)

	const activeSettingConfig = settingKey ? WIDGET_SETTING_MODALS[settingKey] : null
	const handleCloseSetting = onCloseSetting || onClose

	return (
		<>
			{isManageOpen && <AddWidgetModal isOpen={isManageOpen} onClose={onClose} />}

			{activeSettingConfig && (
				<Modal
					isOpen={true}
					onClose={handleCloseSetting}
					title={activeSettingConfig.title}
					size={activeSettingConfig.size}
					direction="rtl"
					closeOnBackdropClick
				>
					<activeSettingConfig.Component {...({ instanceId, size } as any)} />
				</Modal>
			)}
		</>
	)
}
