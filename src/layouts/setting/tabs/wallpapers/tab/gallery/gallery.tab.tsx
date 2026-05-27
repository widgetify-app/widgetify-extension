import type { Category } from '@/common/wallpaper.interface'
import { SectionPanel } from '@/components/section-panel'
import { CategoryView } from './components/category/category-view'
import { WallpaperView } from './components/wallpaper-item/wallpaper-view'
import { UploadArea } from '../../components/upload-area.component'
import { useAuth } from '@/context/auth.context'
import { useWallpaper } from '../../hooks/use-wallpaper'

export function GalleryTab() {
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
	const { user, isSuccessFetchingUser } = useAuth()
	const { customWallpaper, handleCustomWallpaperChange } = useWallpaper([])
	function goBackToCategories() {
		setSelectedCategory(null)
	}

	return (
		<SectionPanel title="گالری تصاویر" size="xs">
			<div className="p-1">
				{!selectedCategory ? (
					<CategoryView onCategorySelect={setSelectedCategory} />
				) : (
					<WallpaperView
						selectedCategory={selectedCategory}
						onBackToCategories={goBackToCategories}
					/>
				)}
			</div>

			{user?.isVip && isSuccessFetchingUser ? (
				<SectionPanel title="تصویر دلخواه" size="xs">
					<div className="p-4">
						<UploadArea
							customWallpaper={customWallpaper}
							onWallpaperChange={handleCustomWallpaperChange}
						/>
					</div>
				</SectionPanel>
			) : null}
		</SectionPanel>
	)
}
