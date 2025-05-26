import { RequireAuth } from '@/components/auth/require-auth'
import { useAuth } from '@/context/auth.context'
import { GradientWallpaper } from '../components/gradient-wallpaper.component'
import { useWallpaper } from '../hooks/use-wallpaper'
import { useWallpapersByCategory } from '../hooks/use-wallpapers-by-category'

export function GradientTab() {
	const { allWallpapers } = useWallpapersByCategory()
	const { isAuthenticated } = useAuth()
	const {
		selectedBackground,

		handleSelectBackground,
	} = useWallpaper(allWallpapers, isAuthenticated)

	return (
		<RequireAuth mode="preview">
			<div className="shadow-sm rounded-xl">
				<GradientWallpaper
					onSelectGradient={handleSelectBackground}
					selectedGradient={
						selectedBackground && selectedBackground.type === 'GRADIENT'
							? selectedBackground
							: undefined
					}
				/>
			</div>
		</RequireAuth>
	)
}
