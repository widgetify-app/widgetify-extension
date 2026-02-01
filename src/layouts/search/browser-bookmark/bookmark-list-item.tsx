import { FiChevronRight, FiFolder, FiExternalLink } from 'react-icons/fi'
import { getFaviconFromUrl } from '@/common/utils/icon'
import type { FetchedBrowserBookmark } from '@/layouts/bookmark/utils/browser-bookmarks.util'

interface Props {
	item: FetchedBrowserBookmark
	onClick: (item: FetchedBrowserBookmark) => void
}

export function BookmarkListItem({ item, onClick }: Props) {
	const isFolder = item.type === 'FOLDER'

	return (
		<div
			onClick={() => onClick(item)}
			className="flex items-center gap-2.5 p-2 hover:bg-primary/5 rounded-xl cursor-pointer transition-all group"
		>
			{isFolder ? (
				<FiFolder className="text-warning shrink-0" size={18} />
			) : (
				<img
					src={getFaviconFromUrl(item.url || '')}
					className="w-4 h-4 rounded-sm shrink-0"
					alt=""
				/>
			)}

			<span className="flex-1 text-xs font-medium truncate transition-colors text-base-content/80 group-hover:text-base-content">
				{item.title || (isFolder ? 'پوشه بدون نام' : 'بدون عنوان')}
			</span>

			{isFolder ? (
				<FiChevronRight
					size={12}
					className="transition-opacity opacity-20 group-hover:opacity-60"
				/>
			) : (
				<FiExternalLink
					size={12}
					className="transition-opacity opacity-0 group-hover:opacity-40"
				/>
			)}
		</div>
	)
}
