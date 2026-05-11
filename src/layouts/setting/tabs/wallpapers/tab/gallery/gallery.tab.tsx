import type { Category } from '@/common/wallpaper.interface'
import { SectionPanel } from '@/components/section-panel'
import { CategoryView } from './components/category/category-view'
import { WallpaperView } from './components/wallpaper-item/wallpaper-view'

export function GalleryTab() {
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
	function goBackToCategories() {
		setSelectedCategory(null)
	}

	return (
		<SectionPanel title="گالری تصاویر" size="xs">
			<div className="p-4">
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
	)
}
