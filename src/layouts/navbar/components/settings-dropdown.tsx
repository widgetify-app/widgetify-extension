import { useCallback, useRef } from 'react'
import { callEvent } from '@/common/utils/call-event'
import { Icon } from '@/src/icons'
import { Dropdown } from '@/components/ui'
import { UI, useAppearanceSetting } from '@/context/appearance.context'

export const SettingsDropdown = () => {
	const triggerRef = useRef<HTMLDivElement>(null)
	const { ui } = useAppearanceSetting()

	const handleWidgetSettingsClick = useCallback(() => {
		if (ui === UI.CUSTOM) {
			callEvent('openAddCustomWidgetModal')
		} else {
			callEvent('openWidgetsSettings', { tab: null })
		}
		callEvent('closeAllDropdowns')
	}, [ui])

	const handleSettingsClick = useCallback(() => {
		callEvent('openSettings', 'general')
		callEvent('closeAllDropdowns')
	}, [])

	const onClickToOpenAppearance = () => {
		callEvent('openSettings', 'appearance')
		callEvent('closeAllDropdowns')
	}

	const onClickToOpenGallery = () => {
		callEvent('openSettings', 'wallpapers')
		callEvent('closeAllDropdowns')
	}

	return (
		<Dropdown
			trigger={
				<div
					ref={triggerRef}
					className="relative p-2 transition-all cursor-pointer nav-btn text-base-content/40 hover:text-base-content active:scale-90"
					id="settings-button"
				>
					<Icon name="settings" size={14} />
				</div>
			}
		>
			<div className="py-2 bg-content bg-glass min-w-50 rounded-2xl">
				<button
					onClick={(_e) => {
						handleSettingsClick()
					}}
					className="flex items-center w-full gap-3 px-3 py-2 text-sm text-right transition-colors rounded-none cursor-pointer group hover:bg-primary/10 hover:text-primary"
				>
					<Icon
						name="settings"
						size={14}
						className="text-muted group-hover:text-primary!"
					/>
					<span>تنظیمات</span>
				</button>

				{ui !== UI.SIMPLE && (
					<button
						onClick={(_e) => {
							handleWidgetSettingsClick()
						}}
						className="flex items-center justify-between w-full px-3 py-2 text-sm text-right transition-colors rounded-none cursor-pointer group hover:bg-primary/10 hover:text-primary"
					>
						<div className="flex items-center gap-3">
							<Icon
								name="appsPlus"
								size={14}
								className="text-muted group-hover:text-primary!"
							/>
							<span>مدیریت ویجت‌ها</span>
						</div>
					</button>
				)}

				<div
					className="relative px-3 py-2 cursor-pointer border-base-300 group hover:bg-primary/10 hover:text-primary"
					onClick={() => onClickToOpenGallery()}
				>
					<div className="flex items-center gap-3">
						<Icon
							name={'wallpapers'}
							size={14}
							className="text-muted group-hover:text-primary!"
						/>
						تصویر زمینه‌ها
					</div>
				</div>

				<div
					className="relative px-3 py-2 cursor-pointer border-base-300 group hover:bg-primary/10 hover:text-primary"
					onClick={() => onClickToOpenAppearance()}
				>
					<div className="flex items-center gap-3">
						<Icon
							name="theme"
							size={14}
							className="text-muted group-hover:text-primary!"
						/>
						<span>حالت ظاهری</span>
					</div>
				</div>
			</div>
		</Dropdown>
	)
}
