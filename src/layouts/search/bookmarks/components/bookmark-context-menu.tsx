import { MenuItem, MenuList } from '@material-tailwind/react'
import { FaTrash } from 'react-icons/fa6'

interface BookmarkContextMenuProps {
	position: { x: number; y: number }
	onDelete: () => void
}

export function BookmarkContextMenu({ position, onDelete }: BookmarkContextMenuProps) {
	return (
		<MenuList
			className="bg-neutral-800 border-white/10 p-1 min-w-[150px]"
			style={{
				position: 'fixed',
				left: position.x,
				top: position.y,
			}}
		>
			<MenuItem
				className="flex items-center gap-2 text-red-400 hover:bg-red-500/10  "
				onClick={onDelete}
			>
				<FaTrash />
				حذف
			</MenuItem>
		</MenuList>
	)
}
