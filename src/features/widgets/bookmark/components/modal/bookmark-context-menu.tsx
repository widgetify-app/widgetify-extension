import { t } from '@/common/i18n'
import { PopoverMenu, PopoverMenuItem, PopoverMenuDivider } from '@/components/ui'
import { Icon } from '@/icons'

interface BookmarkContextMenuProps {
	position: { x: number; y: number }
	onDelete: () => void
	onEdit: () => void
	onOpenInNewTab?: () => void
	onClose: () => void
	isFolder?: boolean
}

export function BookmarkContextMenu({
	position,
	onDelete,
	onEdit,
	onOpenInNewTab,
	onClose,
}: BookmarkContextMenuProps) {
	return (
		<PopoverMenu isOpen={true} onClose={onClose} position={position} width={160}>
			{onOpenInNewTab && (
				<PopoverMenuItem
					icon={<Icon name="plus" size={12} />}
					label={t('widgets.bookmark.menu.openInNewTab')}
					onClick={() => {
						onOpenInNewTab()
						onClose()
					}}
				/>
			)}

			<PopoverMenuItem
				icon={<Icon name="pen" size={12} />}
				label={t('widgets.bookmark.menu.edit')}
				onClick={() => {
					onEdit()
					onClose()
				}}
			/>

			<PopoverMenuDivider />

			<PopoverMenuItem
				icon={<Icon name="trash" size={12} />}
				label={t('widgets.bookmark.grid.delete')}
				variant="danger"
				onClick={() => {
					onDelete()
					onClose()
				}}
			/>
		</PopoverMenu>
	)
}
