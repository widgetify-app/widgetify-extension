import type { Wallpaper } from '../../../../../common/wallpaper.interface'

interface MediaPreviewProps {
	customWallpaper: Wallpaper
}

export function MediaPreview({ customWallpaper }: MediaPreviewProps) {
	if (customWallpaper.type === 'IMAGE') {
		return (
			<img
				src={customWallpaper.src}
				alt="Custom wallpaper"
				className="object-cover w-full h-full"
			/>
		)
	}

	return (
		<video
			src={customWallpaper.src}
			className="object-cover w-full h-full"
			autoPlay
			muted
			loop
		/>
	)
}
