import { UploadArea } from './upload-area.component'
import { useWallpaperContext } from '@/context/wallpaper.context'

export function WallpaperHeader() {
	const { handleCustomWallpaperChange } = useWallpaperContext()
	return (
		<header className="flex flex-col gap-3 pb-3 border-b border-base-content/10 select-none">
			<div className="flex flex-col gap-0.5">
				<h2 className="text-lg font-bold text-content tracking-tight">
					انتخاب از سیستم
				</h2>
			</div>
			<UploadArea
				customWallpaper={null}
				onWallpaperChange={handleCustomWallpaperChange}
			/>
			<div className="flex flex-col gap-0.5">
				<h2 className="text-lg font-bold text-content tracking-tight">
					تصویر زمینه‌ها
				</h2>
				<p className="text-xs text-muted">
					تصویر زمینه مورد علاقه خود را انتخاب کنید
				</p>
			</div>
		</header>
	)
}
