import { useState } from 'react'
import type { Category } from '@/common/wallpaper.interface'
import { SectionPanel } from '@/components/section-panel'
import { CategoryView } from './components/category/category-view'
import { WallpaperView } from './components/wallpaper-item/wallpaper-view'
import { UploadArea } from '../../components/upload-area.component'
import { useWallpaperContext } from '@/context/wallpaper.context'

export function GalleryTab() {
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
	const { customWallpaper, handleCustomWallpaperChange } = useWallpaperContext()

	return (
		<SectionPanel title="گالری تصاویر" size="xs">
			<div className="p-1">
				{!selectedCategory ? (
					<CategoryView onCategorySelect={setSelectedCategory} />
				) : (
					<WallpaperView
						selectedCategory={selectedCategory}
						onBackToCategories={() => setSelectedCategory(null)}
					/>
				)}
			</div>

			<SectionPanel title="تصویر دلخواه" size="xs">
				<div className="p-1">
					<UploadArea
						customWallpaper={customWallpaper}
						onWallpaperChange={handleCustomWallpaperChange}
					/>
				</div>
			</SectionPanel>
		</SectionPanel>
	)
}
