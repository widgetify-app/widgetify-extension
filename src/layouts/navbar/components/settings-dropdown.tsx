import { useCallback } from 'react'
import { callEvent } from '@/common/utils/call-event'
import { UI, useAppearanceSetting } from '@/context/appearance.context'
import { showToast } from '@/common/toast'
import { Icon } from '@/src/icons'
import { useAuth } from '@/context/auth.context'
import { Dropdown } from '@/components/dropdown'

export const SettingsDropdown = () => {
	const { isAuthenticated } = useAuth()
	const { canReOrderWidget, toggleCanReOrderWidget, ui, setUI } = useAppearanceSetting()
	const triggerRef = useRef<HTMLDivElement>(null)

	const handleWidgetSettingsClick = useCallback(() => {
		callEvent('openWidgetsSettings', { tab: null })
		callEvent('closeAllDropdowns')
	}, [])

	const handleSettingsClick = useCallback(() => {
		callEvent('openSettings', 'general')
		callEvent('closeAllDropdowns')
	}, [])

	const onClick = () => {
		if (ui === UI.SIMPLE) {
			showToast('در حالت ظاهری ساده، امکان تغییر و جابجایی ویجت ها نیست!', 'error')
			return
		}
		toggleCanReOrderWidget()
		callEvent('closeAllDropdowns')
	}

	const onClickToChangeUI = () => {
		setUI(ui === 'SIMPLE' ? UI.ADVANCED : UI.SIMPLE)
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

				<div
					className="relative px-3 py-2 cursor-pointer border-base-300 group hover:bg-primary/10 hover:text-primary"
					onClick={() => onClickToOpenGallery()}
				>
					<div className="flex items-center gap-3">
						<Icon
							name={'wallpapers'}
							size={14}
							className="text-muted group-hover:!text-primary"
						/>
						تصویر زمینه‌ها
					</div>
				</div>

				{isAuthenticated ? (
					<div
						className="relative px-3 py-2 cursor-pointer border-base-300 group hover:bg-primary/10 hover:text-primary"
						onClick={() => onClickToChangeUI()}
					>
						<div className="flex items-center gap-3">
							<Icon
								name={ui === UI.ADVANCED ? 'simple_ui' : 'advanced_ui'}
								size={14}
								className="text-muted group-hover:text-primary!"
							/>
							{ui === UI.SIMPLE ? (
								<span> تغییر حالت ظاهری به پیشفرض</span>
							) : (
								<span>تغییر حالت ظاهری به ساده</span>
							)}
						</div>
					</div>
				) : null}

				<div
					className="relative px-3 py-2 border-t cursor-pointer border-base-300 group hover:bg-primary/10 hover:text-primary"
					onClick={() => onClick()}
				>
					<div className="flex items-center gap-3">
						<Icon
							name="outlineDrag"
							size={14}
							className="text-muted group-hover:!text-primary"
						/>
						{canReOrderWidget ? (
							<span>غیرفعال‌سازی حالت جابجایی</span>
						) : (
							<span>حالت جابجایی ویجت ها</span>
						)}
					</div>
				</div>
			</div>
		</Dropdown>
	)
}
