import { memo } from 'react'
import { addOpacityToColor, getContrastingTextColor } from '@/common/utils/color'
import type { Bookmark } from '@/services/bookmark/bookmark.interface'
import { BookmarkIcon } from './bookmark/bookmark-icon'
import { RenderStickerPattern } from './bookmark/bookmark-sticker'
import { BookmarkTitle } from './bookmark/bookmark-title'
import { Icon } from '@/icons'
import { cn } from '@/common/utils/cn'

interface BookmarkItemProps {
	bookmark: Bookmark
	theme?: string
	onClick: (e?: React.MouseEvent<any>) => void
	isDragging?: boolean
	onMenuClick?: (e: React.MouseEvent<HTMLElement>) => void
}

export const BookmarkItem = memo(function BookmarkItem({
	bookmark,
	onClick,
	isDragging = false,
	onMenuClick,
}: BookmarkItemProps) {
	const customStyles = bookmark.customBackground
		? {
				backgroundColor: bookmark.customBackground,
				borderColor: addOpacityToColor(bookmark.customBackground, 0.2),
			}
		: {}

	const handleMouseDown = (e: React.MouseEvent) => {
		if (e.button === 1) {
			e.preventDefault()
		}
	}

	return (
		<div
			className={cn(
				'relative w-full h-full group/menu',
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
				style={customStyles}
				className={cn(
					'relative flex flex-col items-center justify-between px-2 py-1.5 h-20 md:h-[5.9rem] w-full duration-300 border border-surface-3 cursor-pointer group rounded-widget shadow-sm transition-transform ease-in-out group-hover:scale-102',
					!bookmark.customBackground
						? 'bg-glass-surface-2 hover:bg-glass-surface-3 text-fg'
						: ''
				)}
			>
				{RenderStickerPattern(bookmark)}

				<div className="flex flex-col items-center justify-between w-full h-full min-h-0">
					<div className="flex items-center justify-center flex-1 min-h-0">
						<BookmarkIcon bookmark={bookmark} />
					</div>

					<BookmarkTitle
						title={bookmark.title}
						customTextColor={bookmark.customTextColor || ''}
					/>
				</div>

				<div className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none group-hover:opacity-100 bg-fill rounded-widget" />
			</button>

			{onMenuClick && (
				<button
					type="button"
					aria-label="گزینه‌های بوکمارک"
					onMouseDown={(e) => {
						e.stopPropagation()
						onMenuClick(e)
					}}
					onClick={(e) => {
						e.stopPropagation()
						onMenuClick(e)
					}}
					style={{
						color: bookmark.customBackground
							? getContrastingTextColor(bookmark.customBackground)
							: undefined,
					}}
					className="absolute z-10 p-1 transition-ui duration-200 rounded-full opacity-0 cursor-pointer top-1 right-1.5 group-hover/menu:opacity-100 focus-visible:opacity-100 hover:bg-fill-2"
				>
					<Icon name="menuOption" size={12} strokeWidth={2} />
				</button>
			)}
		</div>
	)
})
