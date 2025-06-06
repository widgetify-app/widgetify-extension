import { ContextMenu } from '@/components/contextMenu.component'

interface BookmarkContextMenuProps {
	position: { x: number; y: number }
	onDelete: () => void
	onEdit: () => void
	onOpenInNewTab?: () => void
	isFolder?: boolean
}

export function BookmarkContextMenu({
	position,
	onDelete,
	onEdit,
	onOpenInNewTab,
}: BookmarkContextMenuProps) {
	const getMenuItemStyle = (isDelete = false) => {
		if (isDelete) {
			return 'text-error hover:text-error/70 hover:!bg-error/10'
		}

		return 'bg-content text-primary hover:!bg-primary/10 hover:text-primary/70'
	}

	return (
		<ContextMenu position={position}>
			{onOpenInNewTab && (
				<button
					onClick={onOpenInNewTab}
					className={`w-full px-2 py-1.5 cursor-pointer text-center rounded-md transition-colors duration-200 ${getMenuItemStyle()}`}
				>
					باز کردن در تب جدید
				</button>
			)}

			<button
				onClick={onEdit}
				className={`w-full px-2 py-1.5 cursor-pointer text-center rounded-md transition-colors duration-200 ${getMenuItemStyle()}`}
			>
				ویرایش
			</button>

			<button
				onClick={onDelete}
				className={`w-full px-2 cursor-pointer py-1.5 text-center rounded-md transition-colors duration-200 ${getMenuItemStyle(true)}`}
			>
				حذف
			</button>
		</ContextMenu>
	)
}
