import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaFolder, FaFolderOpen } from 'react-icons/fa'
import type { Bookmark } from '../types/bookmark.types'

interface BookmarkItemProps {
	bookmark: Bookmark | null
	onClick: () => void
	theme?: string
}

const getBookmarkStyle = (theme: string) => {
	switch (theme) {
		case 'light':
			return 'bg-white hover:bg-gray-100/95 border-gray-300/30 hover:border-gray-400/50 text-gray-800'
		case 'dark':
			return 'bg-neutral-900  hover:bg-neutral-700/95 border-gray-700/50 hover:border-gray-600/70 text-gray-200'
		default: // glass
			return 'bg-neutral-900/70 backdrop-blur-sm hover:bg-neutral-800/80 border-white/10 hover:border-white/20 text-gray-300'
	}
}

export function BookmarkItem({ bookmark, onClick, theme = 'glass' }: BookmarkItemProps) {
	const [isHovered, setIsHovered] = useState(false)

	if (!bookmark) {
		return <EmptyBookmarkSlot onClick={onClick} theme={theme} />
	}

	if (bookmark.type === 'FOLDER') {
		return <FolderBookmarkItem bookmark={bookmark} onClick={onClick} theme={theme} />
	}

	return (
		<motion.button
			onClick={onClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			whileHover={{ scale: 1.02 }}
			className={`relative flex flex-col items-center justify-center flex-1 p-4 transition-all duration-300 border cursor-pointer group rounded-xl min-w-[5.4rem] max-w-[5.4rem] ${getBookmarkStyle(theme)}`}
		>
			<BookmarkIcon bookmark={bookmark} />
			<BookmarkTitle title={bookmark.title} theme={theme} />
			{isHovered && <BookmarkTooltip title={bookmark.title} theme={theme} />}
			<div
				className={`absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-t ${theme === 'light' ? 'from-black/5' : 'from-white/5'} to-transparent rounded-xl`}
			/>
		</motion.button>
	)
}

function FolderBookmarkItem({
	bookmark,
	onClick,
	theme = 'glass',
}: {
	bookmark: Bookmark
	onClick: () => void
	theme?: string
}) {
	const [isHovered, setIsHovered] = useState(false)

	const getFolderStyle = () => {
		switch (theme) {
			case 'light':
				return 'border-blue-400/20 hover:border-blue-400/40 bg-white hover:bg-gray-100/95'
			case 'dark':
				return 'border-blue-400/20 bg-neutral-900 hover:bg-neutral-700/95'
			default: // glass
				return 'border-blue-400/20 hover:border-blue-400/40 backdrop-blur-md bg-blue-900/10 hover:bg-blue-800/20'
		}
	}

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
			className={`relative flex flex-col items-center justify-center flex-1 p-4 transition-all duration-300 border cursor-pointer group rounded-xl min-w-[5.4rem] max-w-[5.4rem] shadow-sm ${getFolderStyle()}`}
		>
			<div className="absolute inset-0 overflow-hidden rounded-xl">
				<div
					className={`absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b ${theme === 'light' ? 'from-blue-300/10' : 'from-blue-300/10'} to-transparent`}
				/>
				<div
					className={`absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t ${theme === 'light' ? 'from-blue-200/20' : 'from-blue-900/20'} to-transparent`}
				/>
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

			<BookmarkTitle title={bookmark.title} theme={theme} />
			<div
				className={
					'absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-blue-400/10 to-transparent rounded-xl'
				}
			/>

			<div className="absolute inset-0 border rounded-xl border-white/5" />

			{isHovered && <BookmarkTooltip title={bookmark.title} theme={theme} />}
		</motion.button>
	)
}

function EmptyBookmarkSlot({
	onClick,
	theme = 'glass',
}: { onClick: () => void; theme?: string }) {
	return (
		<motion.button
			onClick={onClick}
			whileHover={{ scale: 1.02 }}
			className={`relative flex flex-col items-center justify-center flex-1 p-4 transition-all duration-300 border cursor-pointer group rounded-xl min-w-[5.4rem] max-w-[5.4rem] ${getBookmarkStyle(theme)}`}
		>
			<div className="relative flex items-center justify-center w-8 h-8 mb-2">+</div>
			<span className="text-[10px]">افزودن</span>
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

function BookmarkTitle({ title, theme = 'glass' }: { title: string; theme?: string }) {
	const getTitleStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-600 group-hover:text-gray-800'
			case 'dark':
				return 'text-gray-400 group-hover:text-white'
			default: // glass
				return 'text-gray-400 group-hover:text-white'
		}
	}

	return (
		<span
			className={`text-[10px] w-full text-center font-medium transition-colors duration-300 truncate ${getTitleStyle()}`}
		>
			{title}
		</span>
	)
}

function BookmarkTooltip({ title, theme = 'glass' }: { title: string; theme?: string }) {
	const getTooltipStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-800/90 text-white'
			case 'dark':
				return 'bg-black/90 text-white'
			default: // glass
				return 'bg-neutral-900/70 text-white'
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 0.9, y: 0 }}
			className={`absolute z-50 px-2 py-1 text-sm transition-all duration-200 -translate-y-full rounded-lg -top-2 ${getTooltipStyle()}`}
		>
			{title}
		</motion.div>
	)
}
