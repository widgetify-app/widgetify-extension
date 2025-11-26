import { useAuth } from '@/context/auth.context'
import { GradientWallpaper } from '../components/gradient-wallpaper.component'
import { useWallpaper } from '../hooks/use-wallpaper'

export function GradientTab() {
	const { isAuthenticated } = useAuth()
	const { selectedBackground, handleSelectBackground } = useWallpaper(
		[],
		isAuthenticated
	)

	return (
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
	)
}
