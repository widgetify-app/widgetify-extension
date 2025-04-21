import { addOpacityToColor } from '@/common/color'
import { getFaviconFromUrl } from '@/common/utils/icon'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaFolder, FaFolderOpen } from 'react-icons/fa'
import { FaPlus } from 'react-icons/fa6'
import type { Bookmark } from '../types/bookmark.types'

interface BookmarkItemProps {
	bookmark: Bookmark | null
	theme?: string
	canAdd?: boolean
	onClick: (e?: React.MouseEvent<any>) => void
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

export function BookmarkItem({
	bookmark,
	theme = 'glass',
	canAdd = true,
	onClick,
}: BookmarkItemProps) {
	const [isHovered, setIsHovered] = useState(false)

	if (!bookmark) {
		return <EmptyBookmarkSlot onClick={onClick} theme={theme} canAdd={canAdd} />
	}

	if (bookmark.type === 'FOLDER') {
		return <FolderBookmarkItem bookmark={bookmark} onClick={onClick} theme={theme} />
	}

	const customStyles = bookmark.customBackground
		? {
				backgroundColor: bookmark.customBackground,
				borderColor: addOpacityToColor(bookmark.customBackground, 0.2),
			}
		: {}

	return (
		<motion.button
			onClick={onClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			whileHover={{ scale: 1.02 }}
			style={customStyles}
			className={`relative flex flex-col items-center justify-center p-4 transition-all duration-300 border cursor-pointer group rounded-xl w-[5.4rem] h-[5.7rem] ${!bookmark.customBackground ? getBookmarkStyle(theme) : 'border'}`}
		>
			{renderStickerPattern(bookmark)}
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
	)
}

function FolderBookmarkItem({
	bookmark,
	onClick,
	theme = 'glass',
}: {
	bookmark: Bookmark
	onClick: (e?: React.MouseEvent<any>) => void
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

	const customStyles = bookmark.customBackground
		? {
				backgroundColor: bookmark.customBackground,
				borderColor: addOpacityToColor(bookmark.customBackground, 0.2),
			}
		: {}

	return (
		<motion.button
			onClick={onClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			whileHover={{ scale: 1.02 }}
			style={customStyles}
			className={`relative flex flex-col items-center justify-center p-4 transition-all duration-300 border cursor-pointer group rounded-xl w-[5.4rem] h-[5.7rem] shadow-sm ${!bookmark.customBackground ? getFolderStyle() : 'border hover:border-blue-400/40'}`}
		>
			{renderStickerPattern(bookmark)}
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

			<BookmarkTitle
				title={bookmark.title}
				theme={theme}
				customTextColor={bookmark.customTextColor}
			/>
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
	canAdd,
}: { onClick: (e?: React.MouseEvent<any>) => void; theme?: string; canAdd: boolean }) {
	const [isHovered, setIsHovered] = useState(false)

	const getEmptySlotStyle = () => {
		if (!canAdd) {
			return `opacity-30 ${getBookmarkStyle(theme)} cursor-default`
		}

		switch (theme) {
			case 'light':
				return `${getBookmarkStyle(theme)} border-blue-300/40 hover:border-blue-400/70 hover:bg-blue-50/50`
			case 'dark':
				return `${getBookmarkStyle(theme)} border-blue-500/20 hover:border-blue-400/40 hover:bg-blue-900/20`
			default: // glass
				return `${getBookmarkStyle(theme)} border-blue-400/20 hover:border-blue-400/40 hover:bg-blue-900/10`
		}
	}

	return (
		<motion.button
			onClick={canAdd ? onClick : undefined}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			whileHover={canAdd ? { scale: 1.02 } : { scale: 1 }}
			transition={{ type: 'spring', stiffness: 400, damping: 17 }}
			className={`relative flex flex-col items-center justify-center p-4 transition-all duration-300 border cursor-pointer group rounded-xl w-[5.4rem] h-[5.7rem] ${getEmptySlotStyle()}`}
		>
			<div className="relative flex items-center justify-center opacity-60 w-14 h-14">
				{canAdd ? (
					<div className="flex items-center justify-center ">
						<FaPlus />
					</div>
				) : (
					<div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-500/20"></div>
				)}
			</div>

			{canAdd && (
				<div
					className={`absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-t ${theme === 'light' ? 'from-black/5' : 'from-white/5'} to-transparent rounded-xl`}
				/>
			)}

			{canAdd && isHovered && <BookmarkTooltip title="افزودن بوکمارک" theme={theme} />}
		</motion.button>
	)
}

function BookmarkIcon({ bookmark }: { bookmark: Bookmark }) {
	let displayIcon: string | React.ReactNode

	if (bookmark.customImage) {
		displayIcon = bookmark.customImage
	} else if (bookmark.type === 'BOOKMARK') {
		if (!bookmark.icon || bookmark.url === bookmark.icon) {
			displayIcon = getFaviconFromUrl(bookmark.url)
		} else {
			displayIcon = bookmark.icon
		}
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

function BookmarkTitle({
	title,
	theme = 'glass',
	customTextColor,
}: { title: string; theme?: string; customTextColor?: string }) {
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
			style={customTextColor ? { color: customTextColor } : undefined}
			className={`text-[.7rem] w-full text-center font-medium transition-colors duration-300 truncate ${!customTextColor ? getTitleStyle() : ''}`}
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

const renderStickerPattern = (bookmark: Bookmark) => {
	if (!bookmark.sticker) return null

	const isImageSticker = bookmark.sticker.startsWith('http')

	const seed = bookmark.title.length % 7

	const stickerPositions = [
		{
			top: `${5 + seed}px`,
			left: `${5 - seed}px`,
			rotate: `${15 + seed * 3}deg`,
			size: 25,
			opacity: 0.55,
			zIndex: 2,
			scale: 1.05 + seed * 0.02,
			shadow: '0 2px 4px rgba(0,0,0,0.2)',
		},
		{
			top: `${4 - seed}px`,
			right: `${5 + seed}px`,
			rotate: `${-20 - seed * 4}deg`,
			size: 22,
			opacity: 0.48,
			zIndex: 2,
			scale: 1 + seed * 0.01,
			shadow: '0 1px 3px rgba(0,0,0,0.15)',
		},
		{
			bottom: `${7 + seed}px`,
			left: `${9 - seed}px`,
			rotate: `${10 - seed * 2.5}deg`,
			size: 20,
			opacity: 0.42,
			zIndex: 1,
			scale: 0.98 + seed * 0.01,
			shadow: '0 1px 2px rgba(0,0,0,0.1)',
		},
		{
			bottom: `${9 - seed}px`,
			right: `${8 + seed}px`,
			rotate: `${25 + seed * 3.5}deg`,
			size: 23,
			opacity: 0.45,
			zIndex: -1,
			scale: 1.02 + seed * 0.015,
			shadow: '0 1px 3px rgba(0,0,0,0.18)',
		},
		{
			top: '50%',
			left: '50%',
			rotate: `${seed * 1.5}deg`,
			size: 26,
			opacity: 0.35,
			zIndex: 0,
			transform: 'translate(-50%,-50%)',
			scale: 1.08,
			glow: `rgba(255, 255, 255, 0.${3 + (seed % 3)})`,
		},
	]

	if (isImageSticker) {
		return (
			<>
				{stickerPositions.map((pos, i) => (
					<div
						key={i}
						className="absolute pointer-events-none"
						style={{
							top: pos.top,
							left: pos.left,
							right: pos.right,
							bottom: pos.bottom,
							width: pos.size,
							height: pos.size,
							transform: `${pos.transform ?? ''} rotate(${pos.rotate}) scale(${pos.scale || 1})`,
							zIndex: pos.zIndex,
							filter: `${pos.shadow ? `drop-shadow(${pos.shadow})` : ''} ${pos.glow ? `drop-shadow(0 0 2px ${pos.glow})` : ''}`,
							transition: 'transform 0.3s ease-in-out',
						}}
					>
						<img
							src={bookmark.sticker}
							alt=""
							className="object-contain w-full h-full rounded-sm"
							style={{
								opacity: pos.opacity,
								filter: pos.glow ? `drop-shadow(0 0 1px ${pos.glow})` : undefined,
							}}
						/>
					</div>
				))}
			</>
		)
	}

	return (
		<>
			{stickerPositions.map((pos, i) => (
				<div
					key={i}
					className="absolute flex items-center justify-center pointer-events-none"
					style={{
						top: pos.top,
						left: pos.left,
						right: pos.right,
						bottom: pos.bottom,
						width: pos.size,
						height: pos.size,
						fontSize: pos.size - 4,
						transform: `${pos.transform ?? ''} rotate(${pos.rotate}) scale(${pos.scale || 1})`,
						zIndex: pos.zIndex,
						fontFamily: "'Segoe UI Emoji', 'Noto Color Emoji', sans-serif",
						filter: `${pos.glow ? `drop-shadow(0 0 2px ${pos.glow})` : ''}`,
						transition: 'transform 0.3s ease-in-out',
					}}
				>
					<span
						style={{
							opacity: pos.opacity,
							filter: pos.shadow ? `drop-shadow(${pos.shadow})` : undefined,
						}}
					>
						{bookmark.sticker}
					</span>
				</div>
			))}
		</>
	)
}
