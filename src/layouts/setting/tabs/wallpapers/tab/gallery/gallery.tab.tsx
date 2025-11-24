import type { Category } from '@/common/wallpaper.interface'
import { SectionPanel } from '@/components/section-panel'
import { useAuth } from '@/context/auth.context'
import { UploadArea } from '../../components/upload-area.component'
import { useWallpaper } from '../../hooks/use-wallpaper'
import { CategoryView } from './components/category/category-view'
import { WallpaperView } from './components/wallpaper-item/wallpaper-view'

export function GalleryTab() {
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
	const { isAuthenticated } = useAuth()
	function goBackToCategories() {
		setSelectedCategory(null)
	}
	const { customWallpaper, handleCustomWallpaperChange } = useWallpaper(
		[],
		isAuthenticated
	)

	return (
		<>
			<SectionPanel title="گالری تصاویر" size="xs">
				<div className="p-4 rounded-xl">
					{!selectedCategory ? (
						<CategoryView onCategorySelect={setSelectedCategory} />
					) : (
						<WallpaperView
							selectedCategory={selectedCategory}
							onBackToCategories={goBackToCategories}
						/>
					)}
				</div>
			</SectionPanel>

			<SectionPanel title="تصویر دلخواه" size="md">
				<UploadArea
					customWallpaper={customWallpaper}
					onWallpaperChange={handleCustomWallpaperChange}
				/>
			</SectionPanel>
		</>
	)
}
