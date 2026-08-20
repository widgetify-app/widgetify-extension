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
	isCustomMode?: boolean
}

export function SortableBookmarkItem({
	bookmark,
	onClick,
	onMenuClick,
	id,
	isCustomMode = false,
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
			className={`transition-transform duration-200 ${isDragging ? 'z-10' : ''} ${isCustomMode ? 'h-full w-full' : ''}`}
			{...attributes}
			{...listeners}
		>
			{bookmark.type === 'FOLDER' ? (
				<FolderBookmarkItem
					bookmark={bookmark}
					onClick={onClick}
					isDragging={isDragging}
					onMenuClick={onMenuClick}
					isCustomMode={isCustomMode}
				/>
			) : (
				<BookmarkItem
					bookmark={bookmark}
					onClick={onClick}
					isDragging={isDragging}
					onMenuClick={onMenuClick}
					isCustomMode={isCustomMode}
				/>
			)}
		</div>
	)
}
