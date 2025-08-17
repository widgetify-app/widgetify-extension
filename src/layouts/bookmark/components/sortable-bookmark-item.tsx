import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Bookmark } from '../types/bookmark.types'
import { FolderBookmarkItem } from './bookmark-folder'
import { BookmarkItem } from './bookmark-item'

interface SortableBookmarkProps {
	bookmark: Bookmark
	onClick: (e?: React.MouseEvent<any>) => void
	onMenuClick?: (e: React.MouseEvent<HTMLElement>) => void
	isManageable: boolean
	id: string
}

export function SortableBookmarkItem({
	bookmark,
	onClick,
	onMenuClick,
	isManageable,
	id,
}: SortableBookmarkProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
		useSortable({
			id,
			disabled: !isManageable,
		})

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 10 : 1, // Bring dragged item to front
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`transition-transform duration-200 ${isDragging ? 'z-10' : ''}`}
			{...attributes}
			{...listeners}
		>
			{bookmark.type === 'FOLDER' ? (
				<FolderBookmarkItem
					bookmark={bookmark}
					onClick={onClick}
					isDragging={isDragging}
					onMenuClick={isManageable ? onMenuClick : undefined}
				/>
			) : (
				<BookmarkItem
					bookmark={bookmark}
					onClick={onClick}
					canAdd={true}
					isDragging={isDragging}
					onMenuClick={isManageable ? onMenuClick : undefined}
				/>
			)}
		</div>
	)
}
