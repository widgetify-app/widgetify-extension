import type { Wallpaper } from '../../../../../common/wallpaper.interface'
import { WallpaperItem } from '../item.wallpaper'

interface WallpaperGalleryProps {
	isLoading: boolean
	error: unknown
	wallpapers: Wallpaper[]
	selectedBackground: string | null
	onSelectBackground: (id: string) => void
}

export function WallpaperGallery({
	isLoading,
	error,
	wallpapers,
	selectedBackground,
	onSelectBackground,
}: WallpaperGalleryProps) {
	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="w-8 h-8 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="p-4 text-center text-red-400 bg-red-500/10 rounded-xl">
				<p>خطا در بارگذاری تصاویر زمینه</p>
			</div>
		)
	}

	return (
		<div className="grid grid-cols-3 gap-4 p-2">
			{wallpapers.map((wallpaper) => (
				<WallpaperItem
					wallpaper={wallpaper}
					key={wallpaper.id}
					selectedBackground={selectedBackground}
					setSelectedBackground={onSelectBackground}
				/>
			))}
		</div>
	)
}
