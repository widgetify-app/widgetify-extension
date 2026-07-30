import { useState } from 'react'
import type { Category } from '@/common/wallpaper.interface'
import { Icon } from '@/src/icons'
import { NewBadge, TabNavigation } from '@/components/ui'

type FilterType = 'all' | 'image' | 'video'
type FilterAccess = 'all' | 'free' | 'coin'

interface WallpaperSidebarProps {
	categories: Category[]
	selectedCategoryId: string | null
	onSelectCategory: (categoryId: string | null) => void
	typeFilter: FilterType
	onTypeFilterChange: (type: FilterType) => void
	accessFilter: FilterAccess
	onAccessFilterChange: (access: FilterAccess) => void
	totalCount?: number
}

export function WallpaperSidebar({
	categories,
	selectedCategoryId,
	onSelectCategory,
	typeFilter,
	onTypeFilterChange,
	accessFilter,
	onAccessFilterChange,
	totalCount,
}: WallpaperSidebarProps) {
	const [isFilterOpen, setIsFilterOpen] = useState(false)

	return (
		<aside className="w-42 shrink-0 flex flex-col gap-3 h-full overflow-hidden select-none">
			<div className="flex flex-col flex-1 min-h-0 bg-base-300/40 border border-base-content/10 rounded-2xl p-2.5 overflow-hidden">
				<div className="flex items-center justify-between px-2 py-1.5 mb-1">
					<span className="text-xs font-semibold text-muted">پوشه ها</span>
					<div className="w-8 h-0.5 bg-base-content/10 rounded-full" />
				</div>

				<div className="flex-1 overflow-y-auto space-y-1 pr-0.5">
					<button
						type="button"
						onClick={() => onSelectCategory(null)}
						className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
							selectedCategoryId === null
								? 'bg-[#536DFE] text-white shadow-sm'
								: 'text-content hover:bg-base-content/5'
						}`}
					>
						<div className="flex items-center gap-2">
							<span>همه تصاویر</span>
						</div>
						{totalCount !== undefined && totalCount > 0 && (
							<span
								className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
									selectedCategoryId === null
										? 'bg-white/20 text-white'
										: 'bg-base-content/10 text-muted'
								}`}
							>
								{totalCount.toLocaleString('fa-IR')}
							</span>
						)}
					</button>

					{categories?.map((cat) => {
						const isSelected = selectedCategoryId === cat.id

						return (
							<button
								key={cat.id}
								type="button"
								onClick={() => onSelectCategory(cat.id)}
								className={`relative w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
									isSelected
										? 'bg-[#536DFE] text-white shadow-sm'
										: 'text-content hover:bg-base-content/5'
								}`}
							>
								<div className="flex items-center gap-2 truncate">
									<span className="truncate">{cat.name}</span>
								</div>

								{cat.hasNewContent && !isSelected && (
									<NewBadge className="left-2" />
								)}
							</button>
						)
					})}
				</div>
			</div>

			<div className="bg-base-300/40 border border-base-content/10 rounded-2xl p-2.5 shrink-0 flex flex-col gap-2">
				<button
					type="button"
					onClick={() => setIsFilterOpen((prev) => !prev)}
					className="w-full flex items-center justify-between px-2 py-1 text-xs font-semibold text-content cursor-pointer"
				>
					<div className="flex items-center gap-1.5">
						<Icon name="filter" size={13} className="text-[#536DFE]" />
						<span>فیلتر</span>
					</div>
					<Icon
						name={isFilterOpen ? 'chevronUp' : 'chevronDown'}
						size={14}
						className="text-muted"
					/>
				</button>

				{isFilterOpen && (
					<div className="space-y-2.5 pt-1">
						<div className="space-y-1">
							<span className="text-[11px] text-muted block px-1">
								نوع تصویر
							</span>
							<TabNavigation
								activeTab={typeFilter}
								tabs={[
									{
										id: 'all',
										label: 'همه',
									},
									{
										id: 'image',
										label: 'ساده',
									},
									{
										id: 'video',
										label: 'متحرک',
									},
								]}
								onTabClick={(id) => onTypeFilterChange(id as FilterType)}
								tabMode="simple"
								className="border-0"
								size="small"
							/>
						</div>

						<div className="space-y-1">
							<span className="text-[11px] text-muted block px-1">
								دسترسی
							</span>
							<TabNavigation
								activeTab={accessFilter}
								tabs={[
									{
										id: 'all',
										label: 'همه',
									},
									{
										id: 'free',
										label: 'رایگان',
									},
									{
										id: 'coin',
										label: 'ویج‌کوین',
									},
								]}
								onTabClick={(id) =>
									onAccessFilterChange(id as FilterAccess)
								}
								tabMode="simple"
								className="border-0"
								size="small"
							/>
						</div>
					</div>
				)}
			</div>
		</aside>
	)
}
