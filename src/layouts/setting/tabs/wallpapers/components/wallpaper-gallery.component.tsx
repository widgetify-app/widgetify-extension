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
	isLoading,
	error,
	wallpapers,
	selectedBackground,
	onSelectBackground,
	onPreviewBackground,
}: WallpaperGalleryProps) {
	const galleryRef = useRef<HTMLDivElement>(null)

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-full py-6">
				<div className="w-8 h-8 rounded-full border-3 border-t-blue-500 border-blue-500/30 animate-spin"></div>
				<p className={'mt-3 text-sm text-muted'}>در حال بارگذاری...</p>
			</div>
		)
	}

	if (error) {
		return (
			<div
				className={
					'flex flex-col items-center justify-center p-4 text-center rounded-lg'
				}
			>
				<h4 className="text-base font-medium text-red-400">خطا در بارگذاری</h4>
			</div>
		)
	}

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
