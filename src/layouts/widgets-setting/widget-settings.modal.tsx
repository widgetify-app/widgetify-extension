import Modal from '@/components/modal'
import { TabManager } from '@/components/tab-manager'
import { WigiPadSetting } from '../widgets/wigiPad/wigiPad-setting'
import { ManageWidgets } from './manage-widgets/WidgetSettingsModal'

interface WidgetSettingsModalProps {
	isOpen: boolean
	onClose: () => void
}

export function WidgetSettingsModal({ isOpen, onClose }: WidgetSettingsModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="تنظیمات ویجت ها"
			size="xl"
			direction="rtl"
		>
			<TabManager
				tabs={[
					{
						label: 'مدیریت ویجت ها',
						element: <ManageWidgets />,
						value: 'widget_management',
						icon: <></>,
					},
					{
						label: 'ویجی پد',
						element: <WigiPadSetting />,
						value: 'date_settings',
						icon: <></>,
					},
					{
						label: 'ویجی ارز',
						element: <div>Currency Settings Coming Soon!</div>,
						value: 'currency_settings',
						icon: <></>,
					},
					{
						label: 'ویجی نیوز',
						element: <div>News Settings Coming Soon!</div>,
						value: 'news_settings',
						icon: <></>,
					},
					{
						label: 'ویجت آب و هوا',
						element: <div>Weather Settings Coming Soon!</div>,
						value: 'weather_settings',
						icon: <></>,
					},
				]}
				tabOwner="setting"
				direction="rtl"
			/>
		</Modal>
	)
}
