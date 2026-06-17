import { FaFolder } from 'react-icons/fa'
import { getFaviconFromUrl } from '@/common/utils/icon'
import type { Bookmark } from '../../types/bookmark.types'
import { useState } from 'react'
const colors = [
	'bg-blue-500/60',
	'bg-purple-500/60',
	'bg-pink-500/60',
	'bg-red-500/60',
	'bg-orange-500/60',
	'bg-yellow-500/60',
	'bg-green-500/60',
	'bg-teal-500/60',
	'bg-cyan-500/60',
	'bg-indigo-500/60',
]
const DEF = 'https://cdn.widgetify.ir/system/bookmark.png'

const getInitials = (title: string) => {
	return title
		.split(' ')
		.filter((word) => word.length > 0)
		.slice(0, 2)
		.map((word) => word[0])
		.join('')
		.toUpperCase()
}

const getColorFromTitle = (title: string) => {
	let hash = 0
	for (let i = 0; i < title.length; i++) {
		hash = title.charCodeAt(i) + ((hash << 5) - hash)
	}

	return colors[Math.abs(hash) % colors.length]
}

export function BookmarkIcon({ bookmark }: { bookmark: Bookmark }) {
	let displayIcon: string | React.ReactNode
	const [imageError, setImageError] = useState(false)

	if (bookmark.icon) {
		displayIcon = bookmark.icon
	} else if (bookmark.type === 'BOOKMARK') {
		if (!bookmark.icon && bookmark.url) {
			displayIcon = getFaviconFromUrl(bookmark.url)
		} else {
			displayIcon = bookmark.icon
		}
	} else {
		displayIcon = <FaFolder className="w-6 h-6 text-blue-400" />
	}

	if (displayIcon === '') {
		displayIcon = DEF
	}

	const handleImageAnalysis = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
		const img = e.target as HTMLImageElement

		if (img.naturalWidth < 32 || img.naturalHeight < 32) {
			img.src = DEF
		}
	}

	const hasCustomColors = bookmark.customBackground && bookmark.customTextColor
	const backgroundColor = hasCustomColors ? bookmark.customBackground : ''
	const textColor = hasCustomColors
		? bookmark.customTextColor
		: 'rgba(255, 255, 255, 1)'
	const colorClass = hasCustomColors ? '' : getColorFromTitle(bookmark.title)

	return (
		<div className="relative flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 md:w-9 md:h-9">
			{typeof displayIcon === 'string' && !imageError ? (
				<img
					src={displayIcon}
					className="object-contain transition-transform duration-300 rounded-md group-hover:scale-105"
					alt={bookmark.title}
					loading="lazy"
					onLoad={handleImageAnalysis}
					onError={() => setImageError(true)}
				/>
			) : typeof displayIcon === 'string' && imageError ? (
				<div
					className={`flex items-center justify-center w-full h-full rounded-xl font-semibold text-[10px] sm:text-xs md:text-sm ${colorClass}`}
					style={
						hasCustomColors
							? {
									backgroundColor: backgroundColor || '',
									color: textColor || '',
								}
							: undefined
					}
				>
					{getInitials(bookmark.title)}
				</div>
			) : (
				displayIcon
			)}
		</div>
	)
}
