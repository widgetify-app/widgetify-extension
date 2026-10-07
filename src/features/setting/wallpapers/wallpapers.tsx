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
		<div className="flex flex-col w-full gap-3">
			<header>
				<h2 className="text-lg font-bold text-fg-strong">تصویر زمینه</h2>
				<p className="text-xs text-fg-muted">
					یکی رو انتخاب کن تا همون لحظه پشت صفحه بشینه، یا عکس خودت رو بذار.
				</p>
			</header>
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
		</div>
	)
}
