import { useWallpaperContext } from '@/context/wallpaper.context'
import { WallpaperPicker } from '@/features/market/market'
import { UploadArea } from './components/upload-area'

export function WallpaperSetting() {
	const {
		customWallpaper,
		selectedBackground,
		handleCustomWallpaperChange,
		handleRemoveCustomWallpaper,
	} = useWallpaperContext()

	return (
		<WallpaperPicker
			leading={
				<UploadArea
					customWallpaper={customWallpaper}
					isActive={
						Boolean(customWallpaper) &&
						selectedBackground?.id === customWallpaper?.id
					}
					onWallpaperChange={handleCustomWallpaperChange}
					onWallpaperRemove={handleRemoveCustomWallpaper}
				/>
			}
		/>
	)
}
