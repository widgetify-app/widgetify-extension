import { useState } from 'react'
import { FaFolder, FaFolderOpen } from 'react-icons/fa'
import { SlOptions } from 'react-icons/sl'
import { addOpacityToColor } from '@/common/color'
import Tooltip from '@/components/toolTip'
import type { Bookmark } from '../types/bookmark.types'
import { RenderStickerPattern } from './bookmark/bookmark-sticker'
import { BookmarkTitle } from './bookmark/bookmark-title'
import { useBookmarkStore } from '../context/bookmark.context'
import { getFaviconFromUrl } from '@/common/utils/icon'
import { BookmarkIcon } from './bookmark/bookmark-icon'

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

	const getFolderStyle = () => {
		return 'bg-content bg-glass hover:bg-primary/20'
	}

	const folderItems = getCurrentFolderItems(bookmark.id)
		.filter((item) => item.type === 'BOOKMARK')
		.slice(0, 6)

	const renderFolderIcons = () => {
		// if (bookmark.icon) {
		// 	return <BookmarkIcon bookmark={bookmark} />
		// }

		if (folderItems.length > 0) {
			return (
				<div className="grid grid-cols-3 gap-1.5">
					{folderItems.map((child, index) => (
						<div
							key={index}
							className="flex items-center justify-center w-5 h-5"
						>
							<img
								src={child.icon || getFaviconFromUrl(child.url || '')}
								className="object-center p-0.5 h-full rounded-md"
								alt=""
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

	return (
		<div className={`relative ${isDragging ? 'opacity-50' : ''} group`}>
			<Tooltip content={bookmark.title} className="w-full lg:min-w-[5.4rem]">
				<button
					onClick={onClick}
					onAuxClick={onClick}
					onMouseDown={handleMouseDown}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
					style={customStyles}
					className={`relative flex flex-col items-center justify-center p-2 transition-all duration-300 mt-1 cursor-pointer rounded-b-3xl rounded-tl-3xl w-full md:h-[5.2rem] shadow-sm 
					border-l border-b border-r border-t-0
					${!bookmark.customBackground ? 'border-primary/0 hover:border-primary/40' : 'border-transparent'}
					before:content-[''] before:absolute before:-top-[8px] before:-right-px before:w-1/2 before:h-2 before:rounded-t-lg before:border-t before:border-r before:border-l before:transition-all before:duration-300 before:border-primary/0 group-hover:before:border-primary/40
					${
						!bookmark.customBackground
							? `${getFolderStyle()} before:bg-base-200`
							: `before:bg-inherit `
					}
					transition-all ease-in-out duration-300 folder-bookmark-item`}
				>
					{RenderStickerPattern(bookmark)}

					<div className="flex items-center justify-center flex-1 w-full">
						{renderFolderIcons()}
					</div>
					<BookmarkTitle
						title={bookmark.title}
						customTextColor={bookmark.customTextColor || ''}
					/>

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
