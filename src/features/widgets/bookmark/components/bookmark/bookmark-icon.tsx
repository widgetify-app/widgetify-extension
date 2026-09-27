import { getFaviconFromUrl } from '@/features/widgets/utils/icon'
import type { Bookmark } from '@/services/bookmark/bookmark.interface'
import { useState } from 'react'
import { Icon } from '@/icons'
const colors = [
	'bg-[#2b7fff99]',
	'bg-[#ad46ff99]',
	'bg-[#f6339a99]',
	'bg-[#fb2c3699]',
	'bg-[#ff690099]',
	'bg-[#f0b10099]',
	'bg-[#00c95099]',
	'bg-[#00bba799]',
	'bg-[#00b8db99]',
	'bg-[#615fff99]',
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
		displayIcon = <Icon name="folder" className="w-6 h-6 text-brand" />
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
		<div className="relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8">
			{typeof displayIcon === 'string' && !imageError ? (
				<img
					src={displayIcon}
					className="object-contain max-w-full max-h-full transition-transform duration-300 rounded-lg group-hover:scale-105"
					alt={bookmark.title}
					loading="lazy"
					onLoad={handleImageAnalysis}
					onError={() => setImageError(true)}
				/>
			) : typeof displayIcon === 'string' && imageError ? (
				<div
					className={`flex items-center justify-center w-full h-full rounded-xl font-semibold text-3xs sm:text-xs md:text-sm ${colorClass}`}
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
