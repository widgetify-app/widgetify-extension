import { UploadArea } from './upload-area.component'
import { useWallpaperContext } from '@/context/wallpaper.context'

export function WallpaperHeader() {
	const {
		handleCustomWallpaperChange,
		handleRemoveCustomWallpaper,
		customWallpaper,
	} = useWallpaperContext()

	return (
		<header className="flex flex-col gap-3 pb-3 border-b border-base-content/10 select-none">
			<div className="flex flex-col gap-0.5">
				<h2 className="text-lg font-bold text-content tracking-tight">
					تصویر سفارشی
				</h2>
			</div>
			<UploadArea
				customWallpaper={customWallpaper}
				onWallpaperChange={handleCustomWallpaperChange}
				onWallpaperRemove={handleRemoveCustomWallpaper}
			/>
			<div className="flex flex-col gap-0.5">
				<h2 className="text-lg font-bold text-content tracking-tight">
					تصویر زمینه‌ها
				</h2>
				<p className="text-xs text-muted">
					تصویر زمینه مورد علاقه‌ت رو انتخاب کن
				</p>
			</div>
		</header>
	)
}
