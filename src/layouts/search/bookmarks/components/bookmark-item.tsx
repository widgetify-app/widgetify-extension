import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaFolder, FaFolderOpen } from 'react-icons/fa'
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

	if (bookmark.type === 'FOLDER') {
		return <FolderBookmarkItem bookmark={bookmark} onClick={onClick} />
	}

	return (
		<motion.button
			onClick={onClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			whileHover={{ scale: 1.02 }}
			className="relative flex flex-col items-center justify-center flex-1 p-4 transition-all duration-300 border cursor-pointer group bg-neutral-900/70 backdrop-blur-sm hover:bg-neutral-800/80 rounded-xl border-white/10 hover:border-white/20 min-w-[5.4rem] max-w-[5.4rem]"
		>
			<BookmarkIcon bookmark={bookmark} />
			<BookmarkTitle title={bookmark.title} />
			{isHovered && <BookmarkTooltip title={bookmark.title} />}
			<div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-white/5 to-transparent rounded-xl" />
		</motion.button>
	)
}

function FolderBookmarkItem({
	bookmark,
	onClick,
}: { bookmark: Bookmark; onClick: () => void }) {
	const [isHovered, setIsHovered] = useState(false)
	const displayIcon =
		bookmark.customImage ||
		(isHovered ? (
			<FaFolderOpen className="w-6 h-6 text-blue-400" />
		) : (
			<FaFolder className="w-6 h-6 text-blue-400" />
		))

	return (
		<motion.button
			onClick={onClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			whileHover={{ scale: 1.02 }}
			className="relative flex flex-col items-center justify-center flex-1 p-4 transition-all duration-300 border cursor-pointer group rounded-xl border-blue-400/20 hover:border-blue-400/40 min-w-[5.4rem] max-w-[5.4rem] backdrop-blur-md bg-blue-900/10 hover:bg-blue-800/20 shadow-sm"
		>
			<div className="absolute inset-0 overflow-hidden rounded-xl">
				<div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-blue-300/10 to-transparent" />
				<div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-blue-900/20 to-transparent" />
			</div>

			<div className="absolute top-0 w-8 h-1 transform -translate-x-1/2 rounded-b-sm left-1/2 bg-blue-400/80" />

			<div className="relative z-10 flex items-center justify-center w-8 h-8 mb-2">
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

			<span className="relative z-10 text-[10px] w-full text-center font-medium text-gray-200 transition-colors duration-300 group-hover:text-white truncate">
				{bookmark.title}
			</span>

			<div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-blue-400/10 to-transparent rounded-xl" />

			<div className="absolute inset-0 border rounded-xl border-white/5" />

			{isHovered && <BookmarkTooltip title={bookmark.title} />}
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
	let displayIcon: string | React.ReactNode

	if (bookmark.customImage) {
		displayIcon = bookmark.customImage
	} else if (bookmark.type === 'BOOKMARK') {
		displayIcon = bookmark.icon
	} else {
		displayIcon = <FaFolder className="w-6 h-6 text-blue-400" />
	}

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
