import { GalleryTab } from './tab/gallery/gallery.tab'
import { GradientTab } from './tab/gradient.tab'

export function WallpaperSetting() {
	return (
		<div className="w-full max-w-xl mx-auto">
			<div className="flex flex-col gap-4">
				<GalleryTab />
				<GradientTab />
			</div>
		</div>
	)
}
