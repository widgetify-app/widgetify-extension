import { callEvent } from '@/common/utils/call-event'
import { Dropdown, DropdownItem } from '@/components/ui'
import { useAppearance } from '@/context/appearance.context'
import { Icon } from '@/icons'

export function LayoutDropdown() {
	const { canvasMode, setCanvasMode } = useAppearance()

	const handleAction = (action: () => void) => {
		callEvent('closeAllDropdowns')
		action()
	}

	const handleToggleEditMode = () => {
		handleAction(() => {
			setCanvasMode(canvasMode === 'edit' ? 'normal' : 'edit')
		})
	}

	return (
		<Dropdown
			trigger={
				<div
					className="relative p-2 transition-all cursor-pointer nav-btn text-subtle hover:text-content active:scale-90"
					id="layout-menu-button"
				>
					<Icon name="appsPlus" size={15} />
				</div>
			}
		>
			<div className="bg-content py-2 bg-glass min-w-48 px-1" dir="rtl">
				<DropdownItem
					icon={<Icon name="appsPlus" size={14} />}
					label="مدیریت ویجت‌ها"
					onClick={() =>
						handleAction(() => callEvent('openAddCustomWidgetModal'))
					}
				/>

				<DropdownItem
					icon={<Icon name="edit" size={14} />}
					label={canvasMode === 'edit' ? 'پایان ویرایش' : 'حالت ویرایش'}
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
