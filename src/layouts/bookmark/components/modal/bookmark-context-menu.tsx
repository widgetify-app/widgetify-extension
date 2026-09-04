import {
	PopoverMenu,
	PopoverMenuItem,
	PopoverMenuDivider,
} from '@/components/ui'
import { Icon } from '@/src/icons'

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
		<PopoverMenu
			isOpen={true}
			onClose={onClose}
			position={position}
			width={160}
		>
			{onOpenInNewTab && (
				<PopoverMenuItem
					icon={<Icon name="plus" size={13} />}
					label="در تب جدید"
					onClick={() => {
						onOpenInNewTab()
						onClose()
					}}
				/>
			)}

			<PopoverMenuItem
				icon={<Icon name="pen" size={13} />}
				label="ویرایش"
				onClick={() => {
					onEdit()
					onClose()
				}}
			/>

			<PopoverMenuDivider />

			<PopoverMenuItem
				icon={<Icon name="trash" size={13} />}
				label="حذف"
				variant="danger"
				onClick={() => {
					onDelete()
					onClose()
				}}
			/>
		</PopoverMenu>
	)
}
