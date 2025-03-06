import { motion } from 'framer-motion'
import { FiChevronDown, FiChevronUp, FiTag } from 'react-icons/fi'
import { wallpaperCategoryTranslations } from '../../../../../common/constants/translations'
import type { Wallpaper } from '../../../../../common/wallpaper.interface'
import { WallpaperItem } from '../item.wallpaper'

interface CategoryPanelProps {
	category: string
	wallpapers: Wallpaper[]
	isExpanded: boolean
	onToggleExpand: () => void
	selectedBackground: string | null
	onSelectBackground: (id: string) => void
}

export function CategoryPanel({
	category,
	wallpapers,
	isExpanded,
	onToggleExpand,
	selectedBackground,
	onSelectBackground,
}: CategoryPanelProps) {
	const displayName = wallpaperCategoryTranslations[category] || category

	return (
		<motion.div
			className="mb-3 overflow-hidden rounded-lg bg-white/5"
			initial={{ opacity: 0, y: 5 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<button
				onClick={onToggleExpand}
				className="flex items-center justify-between w-full p-3 text-left transition-colors hover:bg-white/5"
			>
				<div className="flex items-center gap-2">
					<div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20">
						<FiTag size={12} className="text-purple-300" />
					</div>
					<span className="text-sm font-medium text-gray-200">{displayName}</span>
					<span className="px-2 py-0.5 text-xs bg-white/10 rounded-full text-gray-400">
						{wallpapers.length}
					</span>
				</div>
				{isExpanded ? (
					<FiChevronUp size={18} className="text-gray-400" />
				) : (
					<FiChevronDown size={18} className="text-gray-400" />
				)}
			</button>

			{isExpanded && (
				<div className="p-3 pt-0">
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
					>
						<div className="grid grid-cols-2 gap-2 mt-3 sm:grid-cols-3">
							{wallpapers.map((wallpaper) => (
								<div key={wallpaper.id} className="transform-gpu">
									<WallpaperItem
										wallpaper={wallpaper}
										selectedBackground={selectedBackground}
										setSelectedBackground={onSelectBackground}
									/>
								</div>
							))}
						</div>
					</motion.div>
				</div>
			)}
		</motion.div>
	)
}
