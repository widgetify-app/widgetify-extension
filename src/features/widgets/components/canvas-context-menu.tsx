import { Icon } from '@/icons'
import { PopoverMenu, PopoverMenuItem, PopoverMenuDivider } from '@/components/ui'
import { t } from '@/common/i18n'

interface CanvasContextMenuProps {
	x: number
	y: number
	canvasMode: 'normal' | 'edit'
	onClose: () => void
	onToggleEditMode: () => void
	onOpenAddWidget: () => void
	onOpenSlots: () => void
	onOpenAppearanceSettings: () => void
	onOpenWallpaperSettings: () => void
	onOpenHelp?: () => void
}

export function CanvasContextMenu({
	x,
	y,
	canvasMode,
	onClose,
	onToggleEditMode,
	onOpenAddWidget,
	onOpenSlots,
	onOpenAppearanceSettings,
	onOpenWallpaperSettings,
	onOpenHelp,
}: CanvasContextMenuProps) {
	return (
		<PopoverMenu isOpen={true} onClose={onClose} position={{ x, y }} width={208}>
			<PopoverMenuItem
				icon={<Icon name="edit" size={14} />}
				label={
					canvasMode === 'edit'
						? t('widgets.canvas.editEnd')
						: t('widgets.canvas.editWidgets')
				}
				onClick={() => {
					onToggleEditMode()
					onClose()
				}}
			/>

			<PopoverMenuItem
				icon={<Icon name="plus" size={14} />}
				label={t('widgets.canvas.addWidget')}
				onClick={() => {
					onOpenAddWidget()
					onClose()
				}}
			/>

			<PopoverMenuItem
				icon={<Icon name="squares2X2" size={14} />}
				label={t('widgets.slots.title')}
				onClick={() => {
					onOpenSlots()
					onClose()
				}}
			/>

			<PopoverMenuDivider />
			<PopoverMenuItem
				icon={<Icon name="brush" size={14} />}
				label={t('widgets.canvas.appearanceSettings')}
				onClick={() => {
					onOpenAppearanceSettings()
					onClose()
				}}
			/>

			<PopoverMenuItem
				icon={<Icon name="wallpapers" size={14} />}
				label={t('widgets.canvas.wallpapers')}
				onClick={() => {
					onOpenWallpaperSettings()
					onClose()
				}}
			/>

			{onOpenHelp && (
				<>
					<PopoverMenuDivider />
					<PopoverMenuItem
						icon={<Icon name="help" size={14} />}
						label={t('widgets.canvas.widgetsHelp')}
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
