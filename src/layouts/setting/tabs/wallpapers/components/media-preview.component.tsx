import type { Wallpaper } from '@/common/wallpaper.interface'
import { useState, useEffect } from 'react'
import { assetCache } from '@/common/utils/assetCache'

interface MediaPreviewProps {
	customWallpaper: Wallpaper
}

export function MediaPreview({ customWallpaper }: MediaPreviewProps) {
	const [cachedSrc, setCachedSrc] = useState<string>(customWallpaper.src)

	useEffect(() => {
		async function loadCachedAsset() {
			try {
				const cached = await assetCache.loadAssetWithCache(customWallpaper.src, {
					fallbackUrl: customWallpaper.src
				})
				setCachedSrc(cached)
			} catch {
				setCachedSrc(customWallpaper.src)
			}
		}
		loadCachedAsset()
	}, [customWallpaper.src])

	if (customWallpaper.type === 'IMAGE') {
		return (
			<img
				src={cachedSrc}
				alt="Custom wallpaper"
				className="object-cover w-full h-full"
			/>
		)
	}

	return (
		<video
			src={cachedSrc}
			className="object-cover w-full h-full"
			autoPlay
			muted
			loop
		/>
	)
}
