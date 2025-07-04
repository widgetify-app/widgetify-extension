import { addOpacityToColor } from '@/common/color'
import Tooltip from '@/components/toolTip'
import { SlOptions } from 'react-icons/sl'
import type { Bookmark } from '../types/bookmark.types'
import { EmptyBookmarkSlot } from './bookmark-emptySlot'
import { FolderBookmarkItem } from './bookmark-folder'
import { BookmarkIcon } from './bookmark/bookmark-icon'
import { RenderStickerPattern } from './bookmark/bookmark-sticker'
import { BookmarkTitle } from './bookmark/bookmark-title'

interface BookmarkItemProps {
	bookmark: Bookmark | null
	theme?: string
	canAdd?: boolean
	onClick: (e?: React.MouseEvent<any>) => void
	onMouseDown?: (e?: React.MouseEvent<any>) => void
	draggable?: boolean
	isDragging?: boolean
	onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void
	onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void
	onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void
	onDrop?: (e: React.DragEvent<HTMLDivElement>) => void
	onMenuClick?: (e: React.MouseEvent<HTMLElement>) => void
}

export function BookmarkItem({
	bookmark,
	canAdd = true,
	onMouseDown,
	onClick,
	draggable = false,
	isDragging = false,
	onDragStart,
	onDragOver,
	onDragEnd,
	onDrop,
	onMenuClick,
}: BookmarkItemProps) {
	if (!bookmark) {
		return <EmptyBookmarkSlot onClick={onClick} canAdd={canAdd} />
	}

	const getBookmarkStyle = () => {
		return 'bg-widget hover:bg-base-300 text-content backdrop-blur-sm'
	}

	if (bookmark.type === 'FOLDER') {
		return (
			<FolderBookmarkItem
				bookmark={bookmark}
				onClick={onClick}
				draggable={draggable}
				isDragging={isDragging}
				onDragStart={onDragStart}
				onDragOver={onDragOver}
				onDragEnd={onDragEnd}
				onDrop={onDrop}
				onMenuClick={onMenuClick}
			/>
		)
	}

	const customStyles = bookmark.customBackground
		? {
				backgroundColor: bookmark.customBackground,
				borderColor: addOpacityToColor(bookmark.customBackground, 0.2),
			}
		: {}

	return (
		<div
			draggable={draggable}
			onDragStart={onDragStart}
			onDragOver={onDragOver}
			onDragEnd={onDragEnd}
			onDrop={onDrop}
			className={`relative ${isDragging ? 'opacity-50' : ''}`}
		>
			<Tooltip content={bookmark.title}>
				<button
					onMouseDown={onMouseDown}
					onClick={onClick}
					onAuxClick={onClick}
					style={customStyles}
					className={`relative flex flex-col items-center justify-center p-4 transition-all duration-300 border border-content cursor-pointer group rounded-xl shadow-sm w-[5.4rem] h-[5.7rem] ${
						!bookmark.customBackground ? `${getBookmarkStyle()}` : 'border'
					} transition-transform ease-in-out group-hover:scale-102`}
				>
					{onMenuClick && bookmark && (
						<div
							onMouseDown={(e) => {
								e.stopPropagation()
								onMenuClick(e)
							}} //fix: enable middle-click to open bookmarks when widget is scrollable by adding onMousedown event for middle click (here we prevent the links to be open when we want to open <SlOptions /> (exactly same as what already has been done in onClick 👇) )
							onClick={(e) => {
								e.stopPropagation()
								onMenuClick(e)
							}}
							className={
								'absolute cursor-pointer top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-primary/50 z-10'
							}
						>
							<SlOptions />
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
