import { useRef } from 'react'
import type { Wallpaper } from '@/common/wallpaper.interface'
import { WallpaperItem } from '../tab/gallery/components/wallpaper-item/wallpaper-item'

interface WallpaperGalleryProps {
	isLoading: boolean
	error: unknown
	wallpapers: Wallpaper[]
	selectedBackground: Wallpaper | null
	onSelectBackground: (wallpaper: Wallpaper) => void
	onPreviewBackground: (wallpaper: Wallpaper) => void
}

export function WallpaperGallery({
	wallpapers,
	selectedBackground,
	onSelectBackground,
	onPreviewBackground,
}: WallpaperGalleryProps) {
	const galleryRef = useRef<HTMLDivElement>(null)

	return (
		<div
			ref={galleryRef}
			className={'p-2 overflow-x-hidden bg-content rounded-b-xl rounded-l-xl'}
			style={{ WebkitOverflowScrolling: 'touch' }}
		>
			<div>
				<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
					{wallpapers.map((wallpaper) => (
						<div key={wallpaper.id} className="transform-gpu">
							<WallpaperItem
								wallpaper={wallpaper}
								selectedBackground={selectedBackground}
								setSelectedBackground={onSelectBackground}
								onPreviewBackground={onPreviewBackground}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
