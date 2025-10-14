import { SlOptions } from 'react-icons/sl'
import { addOpacityToColor } from '@/common/color'
import Tooltip from '@/components/toolTip'
import type { Bookmark } from '../types/bookmark.types'
import { BookmarkIcon } from './bookmark/bookmark-icon'
import { RenderStickerPattern } from './bookmark/bookmark-sticker'
import { BookmarkTitle } from './bookmark/bookmark-title'
import { EmptyBookmarkSlot } from './bookmark-emptySlot'

interface BookmarkItemProps {
	bookmark: Bookmark | null
	theme?: string
	canAdd?: boolean
	onClick: (e?: React.MouseEvent<any>) => void
	isDragging?: boolean
	onMenuClick?: (e: React.MouseEvent<HTMLElement>) => void
}

export function BookmarkItem({
	bookmark,
	canAdd = true,
	onClick,
	isDragging = false,
	onMenuClick,
}: BookmarkItemProps) {
	if (!bookmark) {
		return <EmptyBookmarkSlot onClick={onClick} canAdd={canAdd} />
	}

	const getBookmarkStyle = () => {
		return 'bg-widget hover:bg-base-300 text-content backdrop-blur-sm bg-glass'
	}

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
		<div className={`relative ${isDragging ? 'opacity-50' : ''}`}>
			<Tooltip content={bookmark.title} className="w-full lg:min-w-[5.4rem]">
				<button
					onClick={onClick}
					onAuxClick={onClick}
					onMouseDown={handleMouseDown}
					style={customStyles}
					className={`relative flex flex-col items-center justify-center p-2 transition-all duration-300 border border-content cursor-pointer group rounded-2xl shadow-sm w-full h-20 md:h-[5.5rem] ${!bookmark.customBackground ? `${getBookmarkStyle()}` : 'border'} transition-transform ease-in-out group-hover:scale-102`}
				>
					{onMenuClick && bookmark && (
						<div
							onMouseDown={(e) => {
								e.stopPropagation()
								onMenuClick(e)
							}}
							onClick={(e) => {
								e.stopPropagation()
								onMenuClick(e)
							}}
							className={
								'absolute cursor-pointer top-1.5 right-1.5 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-base-content/10 z-10'
							}
						>
							<SlOptions size={12} />
						</div>
					)}
					{RenderStickerPattern(bookmark)}
					<BookmarkIcon bookmark={bookmark} />
					<BookmarkTitle
						title={bookmark.title}
						customTextColor={bookmark.customTextColor}
					/>

					<div
						className={
							'absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-black/5 to-transparent rounded-xl'
						}
					/>
				</button>
			</Tooltip>
		</div>
	)
}
