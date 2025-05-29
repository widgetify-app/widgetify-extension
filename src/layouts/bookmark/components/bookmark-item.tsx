import { addOpacityToColor } from '@/common/color'
import { getBookmarkStyle, getContainerBackground } from '@/context/theme.context'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { SlOptions } from 'react-icons/sl'
import type { Bookmark } from '../types/bookmark.types'
import { EmptyBookmarkSlot } from './bookmark-emptySlot'
import { FolderBookmarkItem } from './bookmark-folder'
import { BookmarkIcon } from './bookmark/bookmark-icon'
import { RenderStickerPattern } from './bookmark/bookmark-sticker'
import { BookmarkTitle, BookmarkTooltip } from './bookmark/bookmark-title'

interface BookmarkItemProps {
	bookmark: Bookmark | null
	theme?: string
	canAdd?: boolean
	onClick: (e?: React.MouseEvent<any>) => void
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
	theme = 'glass',
	canAdd = true,
	onClick,
	draggable = false,
	isDragging = false,
	onDragStart,
	onDragOver,
	onDragEnd,
	onDrop,
	onMenuClick,
}: BookmarkItemProps) {
	const [isHovered, setIsHovered] = useState(false)

	if (!bookmark) {
		return <EmptyBookmarkSlot onClick={onClick} theme={theme} canAdd={canAdd} />
	}

	if (bookmark.type === 'FOLDER') {
		return (
			<FolderBookmarkItem
				bookmark={bookmark}
				onClick={onClick}
				theme={theme}
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
			{' '}
			<motion.button
				onClick={onClick}
				onAuxClick={onClick}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				whileHover={{ scale: 1.02 }}
				style={customStyles}
				className={`relative flex flex-col items-center justify-center p-4 transition-all duration-300 border cursor-pointer group rounded-xl w-[5.4rem] h-[5.7rem] ${!bookmark.customBackground ? `${getBookmarkStyle(theme)} ${getContainerBackground(theme)}` : 'border'}`}
			>
				{onMenuClick && bookmark && (
					<div
						onClick={(e) => {
							e.stopPropagation()
							onMenuClick(e)
						}}
						className={`absolute cursor-pointer top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-${theme === 'light' ? 'black/40' : 'white/10'} z-10`}
					>
						<SlOptions />
					</div>
				)}
				{RenderStickerPattern(bookmark)}
				<BookmarkIcon bookmark={bookmark} />
				<BookmarkTitle
					title={bookmark.title}
					theme={theme}
					customTextColor={bookmark.customTextColor}
				/>
				{isHovered && <BookmarkTooltip title={bookmark.title} theme={theme} />}
				<div
					className={`absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-t ${theme === 'light' ? 'from-black/5' : 'from-white/5'} to-transparent rounded-xl`}
				/>
			</motion.button>
		</div>
	)
}
