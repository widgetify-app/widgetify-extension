import { AnimatePresence, motion } from 'framer-motion'
import type React from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { FiGrid, FiImage, FiTag, FiVideo } from 'react-icons/fi'
import type { Wallpaper } from '../../../../../common/wallpaper.interface'
import { useTheme } from '../../../../../context/theme.context'
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
	const { theme } = useTheme()

	const getButtonStyle = () => {
		if (activeFilter === type) {
			switch (theme) {
				case 'light':
					return 'bg-blue-500/20 text-blue-600 shadow-inner'
				case 'dark':
					return 'bg-blue-500/30 text-blue-300 shadow-inner'
				default: // glass
					return 'bg-blue-500/30 text-blue-300 shadow-inner'
			}
		}

		switch (theme) {
			case 'light':
				return 'text-gray-600 hover:bg-gray-100/70'
			case 'dark':
				return 'text-gray-300 hover:bg-gray-700/50'
			default: // glass
				return 'text-gray-400 hover:bg-white/5'
		}
	}

	const getBadgeStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-blue-500/20 text-blue-700'
			case 'dark':
				return 'bg-blue-500/30 text-blue-300'
			default: // glass
				return 'bg-blue-500/30 text-blue-300'
		}
	}

	return (
		<button
			onClick={onClick}
			className={`flex items-center gap-1 py-1.5 px-3 rounded-lg transition-colors ${getButtonStyle()}`}
			disabled={disabled}
		>
			{icon}
			<span className="text-sm">{label}</span>
			{activeFilter === type && (
				<span className={`px-1.5 py-0.5 ml-1 text-xs rounded-full ${getBadgeStyle()}`}>
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
	const { theme, themeUtils } = useTheme()
	const [activeFilter, setActiveFilter] = useState<FilterType>('all')
	const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
	const [isTransitioning, setIsTransitioning] = useState(false)
	const galleryRef = useRef<HTMLDivElement>(null)

	const getFilterContainerStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-100/50 backdrop-blur-sm'
			case 'dark':
				return 'bg-gray-800/50 backdrop-blur-sm'
			default: // glass
				return 'bg-white/5 backdrop-blur-sm'
		}
	}

	const getGalleryStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-100/30'
			case 'dark':
				return 'bg-gray-900/30'
			default: // glass
				return ''
		}
	}

	const getErrorContainerStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-red-500/10'
			default:
				return 'bg-red-500/10'
		}
	}

	const getErrorIconStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-red-500/10 text-red-500'

			default:
				return 'bg-red-500/20 text-red-400'
		}
	}

	const getEmptyStateStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-200/50 text-gray-500'
			case 'dark':
				return 'bg-gray-800/30 text-gray-400'
			default: // glass
				return 'bg-gray-700/30 text-gray-400'
		}
	}

	const getEmptyStateButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-blue-700 bg-blue-500/10 hover:bg-blue-500/20'
			case 'dark':
				return 'text-blue-300 bg-blue-500/20 hover:bg-blue-500/30'
			default: // glass
				return 'text-blue-300 bg-blue-500/20 hover:bg-blue-500/30'
		}
	}

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
				<p className={`mt-3 text-sm ${themeUtils.getDescriptionTextStyle()}`}>
					در حال بارگذاری...
				</p>
			</div>
		)
	}

	if (error) {
		return (
			<div
				className={`flex flex-col items-center justify-center p-4 text-center rounded-lg ${getErrorContainerStyle()}`}
			>
				<div
					className={`flex items-center justify-center w-10 h-10 mb-3 rounded-full ${getErrorIconStyle()}`}
				>
					<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<h4 className="text-base font-medium text-red-400">خطا در بارگذاری</h4>
				<p className={`mt-1 text-xs ${themeUtils.getDescriptionTextStyle()}`}>
					لطفا مجددا تلاش کنید
				</p>
			</div>
		)
	}

	const imageCount = wallpapers.filter((w) => w.type === 'IMAGE').length
	const videoCount = wallpapers.filter((w) => w.type === 'VIDEO').length

	return (
		<div className="space-y-3">
			<div className={`flex p-1 rounded-lg ${getFilterContainerStyle()}`}>
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
				className={`p-2 overflow-x-hidden overflow-y-auto h-72 custom-scrollbar rounded-lg ${getGalleryStyle()}`}
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
								<div
									className={`flex items-center justify-center w-10 h-10 mb-2 rounded-full ${getEmptyStateStyle()}`}
								>
									{activeFilter === 'image' ? (
										<FiImage size={18} />
									) : activeFilter === 'video' ? (
										<FiVideo size={18} />
									) : (
										<FiGrid size={18} />
									)}
								</div>
								<p className={`text-sm ${themeUtils.getDescriptionTextStyle()}`}>
									موردی یافت نشد
								</p>
								<button
									onClick={resetFilters}
									className={`px-3 py-1 mt-3 text-xs transition-colors rounded-lg ${getEmptyStateButtonStyle()}`}
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
