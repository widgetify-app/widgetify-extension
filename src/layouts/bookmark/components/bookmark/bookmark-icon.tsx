import { FaFolder } from 'react-icons/fa'
import { getFaviconFromUrl } from '@/common/utils/icon'
import type { Bookmark } from '../../types/bookmark.types'

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
		<div className="relative items-center justify-center w-4 h-4 mb-2 sm:w-5 sm:h-5 md:w-8 md:h-8">
			{typeof displayIcon === 'string' ? (
				<img
					src={displayIcon}
					className="transition-transform duration-300 rounded-md group-hover:scale-105"
					alt={bookmark.title}
					loading="lazy"
				/>
			) : (
				displayIcon
			)}
		</div>
	)
}
