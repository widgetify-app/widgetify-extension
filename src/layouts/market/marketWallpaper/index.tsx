import { useAuth } from '@/context/auth.context'
import { WallpaperGallery } from '@/layouts/setting/tabs/wallpapers/components/wallpaper-gallery.component'
import { useWallpaper } from '@/layouts/setting/tabs/wallpapers/hooks/use-wallpaper'
import { useGetWallpapers } from '@/services/hooks/wallpapers/getWallpaperCategories.hook'

export function MarketWallpaper() {
	const { isAuthenticated } = useAuth()
	const { data, error, isLoading } = useGetWallpapers(
		{
			market: true,
		},
		true
	)
	const { selectedBackground, handleSelectBackground } = useWallpaper(
		data?.wallpapers,
		isAuthenticated
	)

	return (
		<WallpaperGallery
			error={error}
			isLoading={isLoading}
			wallpapers={data?.wallpapers || []}
			selectedBackground={selectedBackground}
			onSelectBackground={handleSelectBackground}
			onPreviewBackground={() => {}}
		/>
	)
}
