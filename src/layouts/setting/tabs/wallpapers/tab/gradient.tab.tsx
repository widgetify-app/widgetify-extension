import { GradientWallpaper } from '../components/gradient-wallpaper.component'
import { useWallpaper } from '../hooks/use-wallpaper'

export function GradientTab() {
	const { selectedBackground, handleSelectBackground } = useWallpaper([])

	return (
		<GradientWallpaper
			onSelectGradient={handleSelectBackground}
			selectedGradient={
				selectedBackground && selectedBackground.type === 'GRADIENT'
					? selectedBackground
					: undefined
			}
		/>
	)
}
