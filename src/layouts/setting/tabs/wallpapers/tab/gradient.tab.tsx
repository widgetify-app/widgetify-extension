import { SectionPanel } from '@/components/section-panel'
import { GradientWallpaper } from '../components/gradient-wallpaper.component'
import { useWallpaper } from '../hooks/use-wallpaper'
import { useWallpapersByCategory } from '../hooks/use-wallpapers-by-category'

export function GradientTab() {
	const { allWallpapers } = useWallpapersByCategory()

	const {
		selectedBackground,

		handleSelectBackground,
	} = useWallpaper(allWallpapers)

	return (
		<SectionPanel title="تنظیمات گرادیان" delay={0.1}>
			<div className="p-4 shadow-sm rounded-xl">
				<GradientWallpaper
					onSelectGradient={handleSelectBackground}
					selectedGradient={
						selectedBackground && selectedBackground.type === 'GRADIENT'
							? selectedBackground
							: undefined
					}
				/>
			</div>
		</SectionPanel>
	)
}
