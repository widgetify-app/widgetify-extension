import { Icon } from '@/src/icons'
import {
	PopoverMenu,
	PopoverMenuItem,
	PopoverMenuDivider,
} from '@/components/ui'

interface CanvasContextMenuProps {
	x: number
	y: number
	canvasMode: 'normal' | 'edit'
	onClose: () => void
	onToggleEditMode: () => void
	onOpenAddWidget: () => void
	onOpenPresets?: () => void
	onOpenAppearanceSettings: () => void
	onOpenHelp?: () => void
}

export function CanvasContextMenu({
	x,
	y,
	canvasMode,
	onClose,
	onToggleEditMode,
	onOpenAddWidget,
	onOpenPresets,
	onOpenAppearanceSettings,
	onOpenHelp,
}: CanvasContextMenuProps) {
	return (
		<PopoverMenu
			isOpen={true}
			onClose={onClose}
			position={{ x, y }}
			width={208}
		>
			<PopoverMenuItem
				icon={<Icon name="edit" size={14} />}
				label={canvasMode === 'edit' ? 'پایان ویرایش' : 'ویرایش ویجت‌ها'}
				onClick={() => {
					onToggleEditMode()
					onClose()
				}}
			/>

			<PopoverMenuItem
				icon={<Icon name="plus" size={14} />}
				label="افزودن ویجت"
				onClick={() => {
					onOpenAddWidget()
					onClose()
				}}
			/>

			{onOpenPresets && (
				<PopoverMenuItem
					icon={<Icon name="squares2X2" size={14} />}
					label="چیدمان‌های آماده"
					onClick={() => {
						onOpenPresets()
						onClose()
					}}
				/>
			)}

			<PopoverMenuItem
				icon={<Icon name="brush" size={14} />}
				label="تنظیمات ظاهری"
				onClick={() => {
					onOpenAppearanceSettings()
					onClose()
				}}
			/>

			{onOpenHelp && (
				<>
					<PopoverMenuDivider />
					<PopoverMenuItem
						icon={<Icon name="help" size={14} />}
						label="راهنمای ویجت‌ها"
						onClick={() => {
							onOpenHelp()
							onClose()
						}}
					/>
				</>
			)}
		</PopoverMenu>
	)
}
