import { FaFolder } from 'react-icons/fa'
import { getFaviconFromUrl } from '@/common/utils/icon'
import type { Bookmark } from '../../types/bookmark.types'
import noInternet from '@/assets/images/no-internet.png'

export function BookmarkIcon({ bookmark }: { bookmark: Bookmark }) {
	let displayIcon: string | React.ReactNode

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

	const handleImageAnalysis = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
		const img = e.target as HTMLImageElement

		if (img.naturalWidth < 32 || img.naturalHeight < 32) {
			img.src = 'https://cdn.widgetify.ir/system/bookmark.png'
		}
	}

	return (
		<div className="relative flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 md:w-8 md:h-8">
			{typeof displayIcon === 'string' ? (
				<img
					src={displayIcon}
					className="object-contain transition-transform duration-300 rounded-md group-hover:scale-105"
					alt={bookmark.title}
					loading="lazy"
					onLoad={handleImageAnalysis}
					onError={(e) => {
						const target = e.target as HTMLImageElement
						if (target.src !== noInternet) target.src = noInternet
					}}
				/>
			) : (
				displayIcon
			)}
		</div>
	)
}
