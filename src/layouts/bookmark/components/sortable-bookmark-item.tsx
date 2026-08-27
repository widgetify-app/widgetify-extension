import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Bookmark } from '../types/bookmark.types'
import { FolderBookmarkItem } from './bookmark-folder'
import { BookmarkItem } from './bookmark-item'

interface SortableBookmarkProps {
	bookmark: Bookmark
	onClick: (e?: React.MouseEvent<any>) => void
	onMenuClick?: (e: React.MouseEvent<HTMLElement>) => void
	id: string
}

export function SortableBookmarkItem({
	bookmark,
	onClick,
	onMenuClick,
	id,
}: SortableBookmarkProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
		useSortable({
			id,
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
					onMenuClick={onMenuClick}
				/>
			) : (
				<BookmarkItem
					bookmark={bookmark}
					onClick={onClick}
					isDragging={isDragging}
					onMenuClick={onMenuClick}
				/>
			)}
		</div>
	)
}
