import type { Category } from '@/common/wallpaper.interface'
import { Pagination } from '@/components/pagination'
import { useGetWallpaperCategoriesPaginated } from '@/services/hooks/wallpapers/getWallpaperCategories.hook'
import { CategoryFolder } from './category-folder.component'

interface CategoryGridProps {
	onCategorySelect: (category: Category) => void
}
const CATEGORIES_PER_PAGE = 9
export function CategoryView({ onCategorySelect }: CategoryGridProps) {
	const [currentPage, setCurrentPage] = useState(1)

	const {
		data: categoryResponse,
		isLoading,
		isFetching,
		error,
	} = useGetWallpaperCategoriesPaginated({
		page: currentPage,
		limit: CATEGORIES_PER_PAGE,
	})

	const goToNextPage = () => {
		if (currentPage < (categoryResponse?.totalPages || 1)) {
			setCurrentPage(currentPage + 1)
		}
	}

	const goToPrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1)
		}
	}

	if (isLoading) {
		return (
			<div className="grid grid-cols-2 gap-3 md:grid-cols-3">
				{Array.from({ length: CATEGORIES_PER_PAGE }).map((_, index) => (
					<div
						key={index}
						className="w-full h-24 bg-content bg-glass rounded-2xl"
					>
						<div className="w-24 h-3 mt-1 mr-2 bg-base-content/5 rounded-xl skeleton"></div>
						<div className="grid grid-cols-2 mt-1 gap-1 p-0.5 px-2">
							{[1, 2, 3, 4].map((_, imgIndex) => (
								<div
									key={imgIndex}
									className="w-full h-8 rounded bg-base-content/5 skeleton"
								></div>
							))}
						</div>
					</div>
				))}
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-48">
				<div className="text-red-500">خطا در بارگذاری دسته‌بندی‌ها</div>
			</div>
		)
	}

	return (
		<div>
			<div className="grid grid-cols-2 gap-3 md:grid-cols-3">
				{categoryResponse?.categories?.map((category) => (
					<CategoryFolder
						key={category.id}
						id={category.id}
						name={category.name}
						previewImages={category.wallpapers || []}
						onSelect={() => onCategorySelect(category)}
					/>
				))}
			</div>

			<Pagination
				currentPage={currentPage}
				totalPages={categoryResponse?.totalPages || 1}
				onNextPage={goToNextPage}
				onPrevPage={goToPrevPage}
				isLoading={isFetching}
			/>
		</div>
	)
}
