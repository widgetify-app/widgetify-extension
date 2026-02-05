import { useState } from 'react'
import { FaFolder, FaFolderOpen } from 'react-icons/fa'
import { SlOptions } from 'react-icons/sl'
import { addOpacityToColor } from '@/common/color'
import type { Bookmark } from '../types/bookmark.types'
import { RenderStickerPattern } from './bookmark/bookmark-sticker'
import { BookmarkTitle } from './bookmark/bookmark-title'
import { useBookmarkStore } from '../context/bookmark.context'
import { getFaviconFromUrl } from '@/common/utils/icon'
import { BookmarkIcon } from './bookmark/bookmark-icon'
import noInternet from '@/assets/images/no-internet.png'

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
				<div className="grid grid-cols-3 gap-1.5 min-h-10 max-h-10">
					{folderItems.map((child, index) => (
						<div
							key={index}
							className="flex items-center justify-center w-4 h-4"
						>
							<img
								src={child.icon || getFaviconFromUrl(child.url || '')}
								className="object-center p-0.5 h-full rounded-md"
								onError={(e) => {
									;(e.target as HTMLImageElement).src = noInternet
								}}
							/>
						</div>
					))}
				</div>
			)
		}

		return isHovered ? (
			<FaFolderOpen className="w-8 h-8 text-blue-400" />
		) : (
			<FaFolder className="w-8 h-8 text-blue-400" />
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

	const getFolderStyle = () => {
		return 'bg-content bg-glass hover:bg-primary/20'
	}

	return (
		<div
			className={`relative ${isDragging ? 'opacity-50' : ''} group h-20 md:h-[5.5rem] flex overflow-hidden`}
		>
			<button
				onClick={onClick}
				onAuxClick={onClick}
				onMouseDown={handleMouseDown}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				style={customStyles}
				className={`relative h-[calc(100%-0.6rem)] self-end flex flex-col items-center justify-center px-2 py-0.5  transition-all duration-300 cursor-pointer group rounded-tl-2xl rounded-b-2xl shadow-sm w-full ${!bookmark.customBackground ? `bg-content hover:bg-base-300 text-content backdrop-blur-sm bg-glass` : ''} transition-transform ease-in-out 
				before:content-[''] before:absolute before:-top-[10px] before:-right-px before:w-1/2 before:h-2.5 before:rounded-tl-2xl before:rounded-tr-lg before:border-t-md before:border-r before:border-l before:transition-all before:duration-300 before:border-base-300 group-hover:before:border-primary/40 border-content
					${
						!bookmark.customBackground
							? `${getFolderStyle()} before:bg-base-200 hover:border-primary/40!`
							: `before:bg-inherit border-transparent`
					}
					transition-all ease-in-out duration-300 folder-bookmark-item border-l border-b border-r border-t-0
				`}
			>
				{RenderStickerPattern(bookmark)}

				<div className="flex flex-col h-full">
					<div className="flex items-center justify-center flex-1">
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
							'absolute cursor-pointer top-1.5 right-1.5 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-base-content/10 z-10'
						}
					>
						<SlOptions size={12} />
					</div>
				)}
			</button>
		</div>
	)
}
