import { AnimatePresence, motion } from 'framer-motion'
import type React from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { FiGrid, FiImage, FiTag, FiVideo } from 'react-icons/fi'
import type { Wallpaper } from '../../../../../common/wallpaper.interface'
import { WallpaperItem } from '../item.wallpaper'
import { CategoryPanel } from './category-panel.component'

interface WallpaperGalleryProps {
	isLoading: boolean
	error: unknown
	wallpapers: Wallpaper[]
	selectedBackground: string | null
	onSelectBackground: (id: string) => void
}

type FilterType = 'all' | 'image' | 'video' | 'by-category'

function FilterButton({
	type,
	icon,
	label,
	activeFilter,
	count,
	onClick,
	disabled,
}: {
	type: FilterType
	icon: React.ReactNode
	label: string
	activeFilter: FilterType
	count: number
	onClick: () => void
	disabled: boolean
}) {
	return (
		<button
			onClick={onClick}
			className={`flex items-center gap-1 py-1.5 px-3 rounded-lg transition-colors ${
				activeFilter === type
					? 'bg-blue-500/30 text-blue-300 shadow-inner'
					: 'text-gray-400 hover:bg-white/5'
			}`}
			disabled={disabled}
		>
			{icon}
			<span className="text-sm">{label}</span>
			{activeFilter === type && (
				<span className="px-1.5 py-0.5 ml-1 text-xs bg-blue-500/30 rounded-full">
					{count}
				</span>
			)}
		</button>
	)
}

export function WallpaperGallery({
	isLoading,
	error,
	wallpapers,
	selectedBackground,
	onSelectBackground,
}: WallpaperGalleryProps) {
	const [activeFilter, setActiveFilter] = useState<FilterType>('all')
	const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
	const [isTransitioning, setIsTransitioning] = useState(false)
	const galleryRef = useRef<HTMLDivElement>(null)

	const availableCategories = useMemo(() => {
		if (!wallpapers?.length) return []

		const categories = wallpapers
			.map((w) => w.category)
			.filter((category): category is string => !!category)

		return [...new Set(categories)].sort()
	}, [wallpapers])

	const wallpapersByCategory = useMemo(() => {
		const result: Record<string, Wallpaper[]> = {}

		for (const category of availableCategories) {
			result[category] = wallpapers.filter((w) => w.category === category)
		}

		return result
	}, [wallpapers, availableCategories])

	const filteredWallpapers = useMemo(() => {
		let filtered = wallpapers

		if (activeFilter === 'image') {
			filtered = filtered.filter((wallpaper) => wallpaper.type === 'IMAGE')
		} else if (activeFilter === 'video') {
			filtered = filtered.filter((wallpaper) => wallpaper.type === 'VIDEO')
		}

		return filtered
	}, [wallpapers, activeFilter])

	const handleFilterChange = useCallback(
		(filter: FilterType) => {
			if (filter === activeFilter) return

			setIsTransitioning(true)
			setActiveFilter(filter)

			if (galleryRef.current) {
				galleryRef.current.scrollTop = 0
			}

			setTimeout(() => setIsTransitioning(false), 300)
		},
		[activeFilter],
	)

	const toggleCategoryExpand = useCallback((category: string) => {
		setExpandedCategories((prev) => {
			const newSet = new Set(prev)
			if (newSet.has(category)) {
				newSet.delete(category)
			} else {
				newSet.add(category)
			}
			return newSet
		})
	}, [])

	const resetFilters = useCallback(() => {
		setIsTransitioning(true)
		setActiveFilter('all')

		if (galleryRef.current) {
			galleryRef.current.scrollTop = 0
		}

		setTimeout(() => setIsTransitioning(false), 300)
	}, [])

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-full py-6">
				<div className="w-8 h-8 rounded-full border-3 border-t-blue-500 border-blue-500/30 animate-spin"></div>
				<p className="mt-3 text-sm text-gray-400">در حال بارگذاری...</p>
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center p-4 text-center rounded-lg bg-red-500/10">
				<div className="flex items-center justify-center w-10 h-10 mb-3 rounded-full bg-red-500/20">
					<svg
						className="w-5 h-5 text-red-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<h4 className="text-base font-medium text-red-400">خطا در بارگذاری</h4>
				<p className="mt-1 text-xs text-gray-400">لطفا مجددا تلاش کنید</p>
			</div>
		)
	}

	const imageCount = wallpapers.filter((w) => w.type === 'IMAGE').length
	const videoCount = wallpapers.filter((w) => w.type === 'VIDEO').length

	return (
		<div className="space-y-3">
			<div className="flex p-1 rounded-lg backdrop-blur-sm bg-white/5">
				<FilterButton
					type="all"
					icon={<FiGrid size={16} />}
					label="همه"
					activeFilter={activeFilter}
					count={wallpapers.length}
					onClick={() => handleFilterChange('all')}
					disabled={isTransitioning}
				/>
				<FilterButton
					type="image"
					icon={<FiImage size={16} />}
					label="تصاویر"
					activeFilter={activeFilter}
					count={imageCount}
					onClick={() => handleFilterChange('image')}
					disabled={isTransitioning}
				/>
				<FilterButton
					type="video"
					icon={<FiVideo size={16} />}
					label="ویدیوها"
					activeFilter={activeFilter}
					count={videoCount}
					onClick={() => handleFilterChange('video')}
					disabled={isTransitioning}
				/>
				<FilterButton
					type="by-category"
					icon={<FiTag size={16} />}
					label="دسته‌بندی"
					activeFilter={activeFilter}
					count={availableCategories.length}
					onClick={() => handleFilterChange('by-category')}
					disabled={isTransitioning}
				/>
			</div>

			<div
				ref={galleryRef}
				className="h-64 p-2 overflow-x-hidden overflow-y-auto custom-scrollbar"
				style={{ WebkitOverflowScrolling: 'touch' }}
			>
				<AnimatePresence mode="wait">
					<motion.div
						key={`${activeFilter}`}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
					>
						{activeFilter === 'by-category' ? (
							<div className="space-y-2">
								{availableCategories.map((category) => (
									<CategoryPanel
										key={category}
										category={category}
										wallpapers={wallpapersByCategory[category]}
										isExpanded={expandedCategories.has(category)}
										onToggleExpand={() => toggleCategoryExpand(category)}
										selectedBackground={selectedBackground}
										onSelectBackground={onSelectBackground}
									/>
								))}
							</div>
						) : filteredWallpapers.length > 0 ? (
							<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
								{filteredWallpapers.map((wallpaper) => (
									<div key={wallpaper.id} className="transform-gpu">
										<WallpaperItem
											wallpaper={wallpaper}
											selectedBackground={selectedBackground}
											setSelectedBackground={onSelectBackground}
										/>
									</div>
								))}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center py-6 text-center">
								<div className="flex items-center justify-center w-10 h-10 mb-2 rounded-full bg-gray-700/30">
									{activeFilter === 'image' ? (
										<FiImage className="text-gray-400" size={18} />
									) : activeFilter === 'video' ? (
										<FiVideo className="text-gray-400" size={18} />
									) : (
										<FiGrid className="text-gray-400" size={18} />
									)}
								</div>
								<p className="text-sm text-gray-400">موردی یافت نشد</p>
								<button
									onClick={resetFilters}
									className="px-3 py-1 mt-3 text-xs text-blue-300 transition-colors rounded-lg bg-blue-500/20 hover:bg-blue-500/30"
									disabled={isTransitioning}
								>
									نمایش همه
								</button>
							</div>
						)}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	)
}
