import { ContextMenu } from '@/components/contextMenu.component'
import { LuPen, LuPlus, LuTrash } from 'react-icons/lu'

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
			return 'text-error hover:text-error/90 hover:!bg-error/10'
		}

		return 'text-content hover:text-content/90 hover:!bg-base-300/70'
	}

	return (
		<ContextMenu position={position} className="gap-y-1">
			{onOpenInNewTab && (
				<button
					onClick={onOpenInNewTab}
					className={`w-full px-3 py-1 flex items-center gap-x-1.5 cursor-pointer rounded-lg transition-colors duration-200 ${getMenuItemStyle()}`}
				>
					<LuPlus size={15} />
					<span className="font-medium">در تب جدید</span>
				</button>
			)}

			<button
				onClick={onEdit}
				className={`w-full px-3 py-1 flex items-center gap-x-[9px] cursor-pointer rounded-lg transition-colors duration-200 ${getMenuItemStyle()}`}
			>
				<LuPen size={13} />
				<span className="font-medium">ویرایش</span>
			</button>

			<button
				onClick={onDelete}
				className={`w-full px-3 py-1 flex items-center gap-x-2.5 cursor-pointer rounded-lg transition-colors duration-200 ${getMenuItemStyle(true)}`}
			>
				<LuTrash size={14} />
				<span className="font-medium">حذف</span>
			</button>
		</ContextMenu>
	)
}
