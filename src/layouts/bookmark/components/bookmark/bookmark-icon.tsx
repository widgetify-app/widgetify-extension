import { getCachedFaviconFromUrl, getDefaultFavicon } from '@/common/utils/icon'
import { FaFolder } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import type { Bookmark } from '../../types/bookmark.types'

export function BookmarkIcon({ bookmark }: { bookmark: Bookmark }) {
	const [displayIcon, setDisplayIcon] = useState<string | React.ReactNode>()
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		async function loadIcon() {
			if (bookmark.customImage) {
				setDisplayIcon(bookmark.customImage)
				return
			}

			if (bookmark.type === 'BOOKMARK') {
				setIsLoading(true)
				try {
					if (!bookmark.icon || bookmark.url === bookmark.icon) {
						const cachedIcon = await getCachedFaviconFromUrl(bookmark.url)
						setDisplayIcon(cachedIcon)
					} else {
						setDisplayIcon(bookmark.icon)
					}
				} catch (error) {
					// Fallback to default favicon if caching fails
					setDisplayIcon(getDefaultFavicon())
				} finally {
					setIsLoading(false)
				}
			} else {
				setDisplayIcon(<FaFolder className="w-6 h-6 text-blue-400" />)
			}
		}

		loadIcon()
	}, [bookmark.customImage, bookmark.type, bookmark.icon, bookmark.url])

	return (
		<div className="relative flex items-center justify-center w-8 h-8 mb-2">
			{isLoading ? (
				<div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
			) : typeof displayIcon === 'string' ? (
				<img
					src={displayIcon}
					className="transition-transform duration-300 group-hover:scale-110"
					alt={bookmark.title}
					onError={() => setDisplayIcon(getDefaultFavicon())}
				/>
			) : (
				displayIcon
			)}
		</div>
	)
}
