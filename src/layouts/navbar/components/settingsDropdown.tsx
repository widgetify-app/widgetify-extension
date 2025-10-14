import { useCallback } from 'react'
import { HiCog, HiViewGridAdd } from 'react-icons/hi'
import { callEvent } from '@/common/utils/call-event'
import { Dropdown } from '@/components/dropdown'
import Tooltip from '@/components/toolTip'

interface SettingsProps {
	setShowSettings: (value: boolean) => void
}
export const SettingsDropdown = ({ setShowSettings }: SettingsProps) => {
	const handleWidgetSettingsClick = useCallback(() => {
		callEvent('openWidgetsSettings', { tab: null })
		callEvent('closeAllDropdowns')
	}, [])

	const handleSettingsClick = useCallback(() => {
		setShowSettings(true)
		callEvent('closeAllDropdowns')
	}, [])

	const trigger = (
		<Tooltip content="تنظیمات و مدیریت" position="bottom">
			<div
				className="relative flex items-center justify-center w-8 h-8 px-1 transition-all duration-300 rounded-full cursor-pointer hover:opacity-80 group hover:bg-primary/10"
				id="settings-button"
			>
				<HiCog size={20} className="text-muted group-hover:!text-primary" />
			</div>
		</Tooltip>
	)

	return (
		<Dropdown trigger={trigger} position="bottom-right" width="200px">
			<div className="py-2 bg-content bg-glass">
				<button
					onClick={(_e) => {
						handleSettingsClick()
					}}
					className="flex items-center w-full gap-3 px-3 py-2 text-sm text-right transition-colors rounded-none cursor-pointer group hover:bg-primary/10 hover:text-primary"
				>
					<HiCog size={16} className="text-muted group-hover:!text-primary" />
					<span>تنظیمات</span>
				</button>

				<button
					onClick={(_e) => {
						handleWidgetSettingsClick()
					}}
					className="flex items-center justify-between w-full px-3 py-2 text-sm text-right transition-colors rounded-none cursor-pointer group hover:bg-primary/10 hover:text-primary"
				>
					<div className="flex items-center gap-3">
						<HiViewGridAdd
							size={16}
							className="text-muted group-hover:!text-primary"
						/>
						<span>مدیریت ویجت‌ها</span>
					</div>
				</button>
			</div>
		</Dropdown>
	)
}
