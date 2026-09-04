import { useState } from 'react'
import { addOpacityToColor } from '@/common/color'
import type { Bookmark } from '../types/bookmark.types'
import { RenderStickerPattern } from './bookmark/bookmark-sticker'
import { BookmarkTitle } from './bookmark/bookmark-title'
import { useBookmarkStore } from '../context/bookmark.context'
import { BookmarkIcon } from './bookmark/bookmark-icon'
import { Icon } from '@/src/icons'
import { cn } from '@/common/utils/cn'

export function FolderBookmarkItem({
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
	const { getCurrentFolderItems } = useBookmarkStore()

	const [isHovered, setIsHovered] = useState(false)

	const folderItems = getCurrentFolderItems(bookmark.id)
		.filter((item) => item.type === 'BOOKMARK')
		.slice(0, 6)

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
							className="flex items-center justify-center w-5.5 h-5.5 overflow-hidden rounded-md [&>div]:!w-5.5 [&>div]:!h-5.5 [&>div_img]:!w-5.5 [&>div_img]:!h-5.5 [&>div_img]:!rounded-md [&>div_div]:!text-[8px] [&>div_div]:!rounded-md"
						>
							<BookmarkIcon bookmark={child} />
						</div>
					))}
				</div>
			)
		}

		return isHovered ? (
			<Icon name="folderOpen" className="w-8 h-8 text-primary" />
		) : (
			<Icon name="folder" className="w-8 h-8 text-primary" />
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
				'relative flex w-full h-full overflow-hidden',
				isDragging && 'opacity-50'
			)}
		>
			<button
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
					'relative flex group h-20 md:h-[5.9rem] w-full flex-col items-center justify-between px-2 py-1.5 transition-all duration-300 cursor-pointer rounded-widget shadow-xs ease-in-out',
					!bookmark.customBackground
						? 'bg-content bg-glass hover:bg-base-300 text-content'
						: 'before:bg-inherit border-transparent'
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

				{onMenuClick && (
					<div
						onClick={(e) => {
							e.stopPropagation()
							onMenuClick(e)
						}}
						className={
							'absolute cursor-pointer top-0.5 right-0.5 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-base-content/10 z-10'
						}
					>
						<Icon name="menuOption" size={12} strokeWidth={2} />
					</div>
				)}
			</button>
		</div>
	)
}
