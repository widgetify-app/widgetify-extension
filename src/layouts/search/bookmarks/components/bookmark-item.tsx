import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaFolder } from 'react-icons/fa'
import type { Bookmark } from '../types/bookmark.types'

interface BookmarkItemProps {
	bookmark: Bookmark | null
	onClick: () => void
}

export function BookmarkItem({ bookmark, onClick }: BookmarkItemProps) {
	const [isHovered, setIsHovered] = useState(false)

	if (!bookmark) {
		return <EmptyBookmarkSlot onClick={onClick} />
	}

	return (
		<motion.button
			onClick={onClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			whileHover={{ scale: 1.02 }}
			className={getBookmarkClassName(bookmark)}
		>
			<BookmarkIcon bookmark={bookmark} />
			<BookmarkTitle title={bookmark.title} />
			{isHovered && <BookmarkTooltip title={bookmark.title} />}
			<BackgroundOverlay />
		</motion.button>
	)
}

function EmptyBookmarkSlot({ onClick }: { onClick: () => void }) {
	return (
		<motion.button
			onClick={onClick}
			whileHover={{ scale: 1.02 }}
			className="relative flex flex-col items-center justify-center flex-1 p-4 transition-all duration-300 border cursor-pointer group bg-neutral-900/70 backdrop-blur-sm hover:bg-neutral-800/80 rounded-xl border-white/10 hover:border-white/20 min-w-[5.4rem] max-w-[5.4rem]"
		>
			<div className="relative flex items-center justify-center w-8 h-8 mb-2">+</div>
			<span className="text-[10px] text-gray-400">افزودن</span>
		</motion.button>
	)
}

function BookmarkIcon({ bookmark }: { bookmark: Bookmark }) {
	const displayIcon = getDisplayIcon(bookmark)

	return (
		<div className="relative flex items-center justify-center w-8 h-8 mb-2">
			{typeof displayIcon === 'string' ? (
				<motion.img
					initial={{ scale: 0.9 }}
					animate={{ scale: 1 }}
					src={displayIcon}
					className="transition-transform duration-300 group-hover:scale-110"
					alt={bookmark.title}
				/>
			) : (
				displayIcon
			)}
		</div>
	)
}

function BookmarkTitle({ title }: { title: string }) {
	return (
		<span className="text-[10px] w-full text-center font-medium text-gray-400 transition-colors duration-300 group-hover:text-white truncate">
			{title}
		</span>
	)
}

function BookmarkTooltip({ title }: { title: string }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 0.9, y: 0 }}
			className="absolute z-50 px-2 py-1 text-sm text-white transition-all duration-200 -translate-y-full rounded-lg bg-neutral-900/70 -top-2"
		>
			{title}
		</motion.div>
	)
}

function BackgroundOverlay() {
	return (
		<div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-white/5 to-transparent rounded-xl" />
	)
}

function getDisplayIcon(bookmark: Bookmark): React.ReactNode | string {
	if (bookmark.customImage) {
		return bookmark.customImage
	}

	if (bookmark.type === 'FOLDER') {
		return bookmark.folderIcon || <FaFolder className="w-6 h-6 text-blue-400" />
	}

	return bookmark.icon
}

function getBookmarkClassName(bookmark: Bookmark): string {
	const baseClasses =
		'relative flex flex-col items-center justify-center flex-1 p-4 transition-all duration-300 border cursor-pointer group backdrop-blur-sm rounded-xl border-white/10 hover:border-white/20 min-w-[5.4rem] max-w-[5.4rem]'
	const typeClasses =
		bookmark.type === 'FOLDER'
			? 'bg-blue-900/20 hover:bg-blue-800/30'
			: 'bg-neutral-900/70 hover:bg-neutral-800/80'

	return `${baseClasses} ${typeClasses}`
}
