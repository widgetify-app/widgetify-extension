import { useState } from 'react'
import { FaFolder, FaFolderOpen } from 'react-icons/fa'
import { SlOptions } from 'react-icons/sl'
import { addOpacityToColor } from '@/common/color'
import Tooltip from '@/components/toolTip'
import type { Bookmark } from '../types/bookmark.types'
import { RenderStickerPattern } from './bookmark/bookmark-sticker'
import { BookmarkTitle } from './bookmark/bookmark-title'

export function FolderBookmarkItem({
	bookmark,
	onClick,
	draggable = false,
	isDragging = false,
	onDragStart,
	onDragOver,
	onDragEnd,
	onDrop,
	onMenuClick,
}: {
	bookmark: Bookmark
	onClick: (e?: React.MouseEvent<any>) => void
	draggable?: boolean
	isDragging?: boolean
	onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void
	onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void
	onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void
	onDrop?: (e: React.DragEvent<HTMLDivElement>) => void
	onMenuClick?: (e: React.MouseEvent<HTMLElement>) => void
}) {
	const [isHovered, setIsHovered] = useState(false)

	const getFolderStyle = () => {
		return 'border border-primary/0 hover:border-primary/40 bg-widget backdrop-blur-md hover:bg-primary/20'
	}

	const displayIcon =
		bookmark.customImage ||
		(isHovered ? (
			<FaFolderOpen className="w-6 h-6 text-blue-400" />
		) : (
			<FaFolder className="w-6 h-6 text-blue-400" />
		))

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
			<Tooltip content={bookmark.title} className="w-full lg:min-w-[5.4rem]">
				<button
					onClick={onClick}
					onAuxClick={onClick}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
					style={customStyles}
					className={`relative flex flex-col items-center justify-center p-4 transition-all duration-300 cursor-pointer group rounded-2xl w-full h-16 md:h-[5.5rem] shadow-sm ${!bookmark.customBackground ? getFolderStyle() : 'border hover:border-blue-400/40'} transition-all ease-in-out duration-300`}
				>
					{RenderStickerPattern(bookmark)}
					<div className="absolute inset-0 overflow-hidden rounded-xl">
						<div
							className={
								'absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-info/5 to-transparent'
							}
						/>
						<div
							className={
								'absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-primary/10 to-transparent'
							}
						/>
					</div>
					<div className="absolute -top-[1px] w-8 h-1 transform -translate-x-1/2 rounded-b-sm left-1/2 bg-blue-400/80" />
					<div className="relative z-10 flex items-center justify-center w-8 h-8 mb-2">
						{typeof displayIcon === 'string' ? (
							<img
								src={displayIcon}
								className="transition-transform duration-300 group-hover:scale-110"
								alt={bookmark.title}
							/>
						) : (
							displayIcon
						)}
					</div>
					<BookmarkTitle
						title={bookmark.title}
						customTextColor={bookmark.customTextColor}
					/>
					<div
						className={
							'absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-blue-400/10 to-transparent rounded-xl'
						}
					/>
					<div className="absolute inset-0 border rounded-xl border-white/5" />

					{onMenuClick && (
						<div
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
				</button>
			</Tooltip>
		</div>
	)
}
