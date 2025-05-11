import { getFaviconFromUrl } from '@/common/utils/icon'
import { FaFolder } from 'react-icons/fa'
import type { Bookmark } from '../../types/bookmark.types'

export function BookmarkIcon({ bookmark }: { bookmark: Bookmark }) {
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
				<img
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
