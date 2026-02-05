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

	return (
		<div className="relative items-center justify-center w-4 h-4 sm:w-5 sm:h-5 md:w-8 md:h-8">
			{typeof displayIcon === 'string' ? (
				<img
					src={displayIcon}
					className="transition-transform duration-300 rounded-md group-hover:scale-105"
					alt={bookmark.title}
					loading="lazy"
					onError={(e) => {
						;(e.target as HTMLImageElement).src = noInternet
					}}
				/>
			) : (
				displayIcon
			)}
		</div>
	)
}
