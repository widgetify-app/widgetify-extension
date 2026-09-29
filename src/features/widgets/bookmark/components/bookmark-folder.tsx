import { memo, useMemo, useState } from 'react'
import { addOpacityToColor } from '@/common/utils/color'
import type { Bookmark } from '@/services/bookmark/bookmark.interface'
import { RenderStickerPattern } from './bookmark/bookmark-sticker'
import { BookmarkTitle } from './bookmark/bookmark-title'
import { useBookmarkStore } from '../bookmark.context'
import { BookmarkIcon } from './bookmark/bookmark-icon'
import { Icon } from '@/icons'
import { cn } from '@/common/utils/cn'

export const FolderBookmarkItem = memo(function FolderBookmarkItem({
	bookmark,
	onClick,
	isDragging = false,
	onMenuClick,
}: {
	bookmark: Bookmark
	onClick: (e?: React.MouseEvent<any>) => void
	isDragging?: boolean
	onMenuClick?: (e: React.MouseEvent<HTMLElement>) => void
}) {
	const { bookmarks, getCurrentFolderItems } = useBookmarkStore()

	const [isHovered, setIsHovered] = useState(false)

	const folderItems = useMemo(
		() =>
			getCurrentFolderItems(bookmark.id)
				.filter((item) => item.type === 'BOOKMARK')
				.slice(0, 6),
		[bookmarks, bookmark.id]
	)

	const renderFolderIcons = () => {
		if (bookmark.icon) {
			return <BookmarkIcon bookmark={bookmark} />
		}

		if (folderItems.length > 0) {
			return (
				<div className="grid grid-cols-3 gap-1.5 p-0.5 items-center justify-center">
					{folderItems.map((child, index) => (
						<div
							key={index}
							className="flex items-center justify-center w-5.5 h-5.5 overflow-hidden rounded-lg [&>div]:!w-5.5 [&>div]:!h-5.5 [&>div_img]:!w-5.5 [&>div_img]:!h-5.5 [&>div_img]:!rounded-lg [&>div_div]:!text-4xs [&>div_div]:!rounded-lg"
						>
							<BookmarkIcon bookmark={child} />
						</div>
					))}
				</div>
			)
		}

		return isHovered ? (
			<Icon name="folderOpen" className="w-8 h-8 text-brand" />
		) : (
			<Icon name="folder" className="w-8 h-8 text-brand" />
		)
	}

	const customStyles = bookmark.customBackground
		? ({
				'--custom-bg': bookmark.customBackground,
				'--custom-border': addOpacityToColor(bookmark.customBackground, 0.2),
				backgroundColor: bookmark.customBackground,
				borderColor: addOpacityToColor(bookmark.customBackground, 0.2),
			} as React.CSSProperties)
		: {}

	const handleMouseDown = (e: React.MouseEvent) => {
		if (e.button === 1) {
			e.preventDefault()
		}
	}

	return (
		<div
			className={cn(
				'relative flex w-full h-full overflow-hidden group/menu',
				isDragging && 'opacity-50'
			)}
		>
			<button
				type="button"
				onClick={onClick}
				onAuxClick={onClick}
				onMouseDown={handleMouseDown}
				onContextMenu={(e) => {
					e.preventDefault()
					e.stopPropagation()
					onMenuClick?.(e)
				}}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				style={customStyles}
				className={cn(
					'relative flex group h-20 md:h-[5.9rem] border border-surface-3 w-full flex-col items-center justify-between px-2 py-1.5 transition-ui duration-300 cursor-pointer rounded-widget shadow-sm ease-in-out',
					!bookmark.customBackground
						? 'bg-glass-surface-2 hover:bg-glass-surface-3 text-fg'
						: 'before:bg-inherit '
				)}
			>
				{RenderStickerPattern(bookmark)}
				<div className="flex flex-col items-center justify-between w-full h-full min-h-0">
					<div className="flex items-center justify-center flex-1 min-h-0">
						{renderFolderIcons()}
					</div>

					<BookmarkTitle
						title={bookmark.title}
						customTextColor={bookmark.customTextColor || ''}
					/>
				</div>
			</button>

			{onMenuClick && (
				<button
					type="button"
					aria-label="گزینه‌های پوشه"
					onClick={(e) => {
						e.stopPropagation()
						onMenuClick(e)
					}}
					className="absolute z-10 p-1 transition-ui duration-200 rounded-full opacity-0 cursor-pointer top-1 right-1.5 group-hover/menu:opacity-100 focus-visible:opacity-100 hover:bg-fill-2"
				>
					<Icon name="menuOption" size={12} strokeWidth={2} />
				</button>
			)}
		</div>
	)
})
