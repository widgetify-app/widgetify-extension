import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { Dropdown, DropdownItem } from '@/components/ui'
import { useAppearance } from '@/context/appearance.context'
import { Page, usePage } from '@/context/page.context'
import { Icon } from '@/icons'
import { NavIconButton } from './nav-icon-button'

export function LayoutDropdown() {
	const { canvasMode, setCanvasMode } = useAppearance()
	const { page, setPage } = usePage()

	const handleAction = (action: () => void) => {
		callEvent('closeAllDropdowns')
		action()
	}

	const handleToggleEditMode = () => {
		handleAction(() => {
			if (page !== Page.Home) {
				setPage(Page.Home)
				setCanvasMode('edit')
			} else {
				setCanvasMode(canvasMode === 'edit' ? 'normal' : 'edit')
			}
			Analytics.event('canvas_edit_mode_toggled')
		})
	}

	const handleOpenWidgetManager = () => {
		handleAction(() => {
			if (page !== Page.Home) {
				setPage(Page.Home)
			}
			callEvent('openAddCustomWidgetModal')
		})
	}

	return (
		<Dropdown
			trigger={
				<NavIconButton
					id="layout-menu-button"
					icon="layout"
					label="چیدمان ویجت‌ها"
				/>
			}
		>
			<div className="bg-glass-surface-2 py-2 min-w-48 px-1" dir="rtl">
				<DropdownItem
					icon={<Icon name="outlineSquares2X2" size={14} />}
					label="مدیریت ویجت‌ها"
					onClick={handleOpenWidgetManager}
				/>

				<DropdownItem
					icon={<Icon name="edit" size={14} />}
					label={
						page === Page.Home && canvasMode === 'edit'
							? 'پایان ویرایش'
							: 'حالت ویرایش'
					}
					onClick={handleToggleEditMode}
				/>

				<DropdownItem
					icon={<Icon name="theme" size={14} />}
					label="تنظیمات ظاهری"
					onClick={() =>
						handleAction(() => callEvent('openSettings', 'appearance'))
					}
				/>

				<DropdownItem
					icon={<Icon name="wallpapers" size={14} />}
					label="تصویر زمینه‌ها"
					onClick={() =>
						handleAction(() => callEvent('openSettings', 'wallpapers'))
					}
				/>
			</div>
		</Dropdown>
	)
}
