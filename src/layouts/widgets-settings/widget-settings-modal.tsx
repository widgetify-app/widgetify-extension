import type { JSX } from 'react'
import Modal from '@/components/modal'
import { TabManager } from '@/components/tab-manager'
import { RssFeedSetting } from '../widgets/news/rss-feed-setting'
import { WeatherSetting } from '../widgets/weather/weather-setting'
import { WigiArzSetting } from '../widgets/wigiArz/wigiArz-setting'
import { WigiPadSetting } from '../widgets/wigiPad/wigiPad-setting'
import { WidgetTabKeys } from './constant/tab-keys'
import { ManageWidgets } from './manage-widgets/manage-widgets'

interface WidgetSettingsModalProps {
	isOpen: boolean
	onClose: () => void
	selectedTab: string | null
}
const tabs: {
	label: string
	element: JSX.Element
	value: WidgetTabKeys
	icon: JSX.Element
}[] = [
	{
		label: 'مدیریت ویجت ها',
		element: <ManageWidgets />,
		value: WidgetTabKeys.widget_management,
		icon: <></>,
	},
	{
		label: 'ویجی پد',
		element: <WigiPadSetting />,
		value: WidgetTabKeys.wigiPad,
		icon: <></>,
	},
	{
		label: 'ویجی ارز',
		element: <WigiArzSetting />,
		value: WidgetTabKeys.wigiArz,
		icon: <></>,
	},
	{
		label: 'ویجی نیوز',
		element: <RssFeedSetting />,
		value: WidgetTabKeys.news_settings,
		icon: <></>,
	},
	{
		label: 'ویجت آب و هوا',
		element: <WeatherSetting />,
		value: WidgetTabKeys.weather_settings,
		icon: <></>,
	},
]

export function WidgetSettingsModal({
	isOpen,
	onClose,
	selectedTab,
}: WidgetSettingsModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="تنظیمات ویجت ها"
			size="xl"
			direction="rtl"
		>
			<TabManager
				tabs={tabs}
				tabOwner="setting"
				defaultTab={selectedTab || WidgetTabKeys.widget_management}
				direction="rtl"
			/>
		</Modal>
	)
}
