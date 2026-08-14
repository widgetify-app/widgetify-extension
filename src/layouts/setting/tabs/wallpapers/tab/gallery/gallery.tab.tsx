import { useState } from 'react'
import { useGetWallpaperCategories } from '@/services/hooks/wallpapers/get-wallpaper-categories.hook'
import { WallpaperSidebar } from '../../components/wallpaper-sidebar'
import { WallpaperHeader } from '../../components/wallpaper-header'
import { WallpaperView } from './components/wallpaper-item/wallpaper-view'

export function GalleryTab() {
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
	const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all')
	const [accessFilter, setAccessFilter] = useState<'all' | 'free' | 'coin'>('all')

	const { data: categories } = useGetWallpaperCategories()

	return (
		<div className="flex flex-col h-full w-full gap-1 overflow-hidden">
			<WallpaperHeader />

			<div className="flex flex-row gap-3 flex-1 min-h-0 overflow-hidden">
				<WallpaperSidebar
					categories={categories.categories}
					selectedCategoryId={selectedCategoryId}
					onSelectCategory={setSelectedCategoryId}
					typeFilter={typeFilter}
					onTypeFilterChange={setTypeFilter}
					accessFilter={accessFilter}
					onAccessFilterChange={setAccessFilter}
				/>

				<div className="flex-1 min-h-0 overflow-hidden flex flex-col">
					<WallpaperView
						selectedCategoryId={selectedCategoryId}
						typeFilter={typeFilter}
						accessFilter={accessFilter}
					/>
				</div>
			</div>
		</div>
	)
}
