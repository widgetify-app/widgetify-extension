import { motion } from 'framer-motion'
import { FiChevronDown, FiChevronUp, FiTag } from 'react-icons/fi'
import { wallpaperCategoryTranslations } from '@/common/constant/translations'
import type { Wallpaper } from '@/common/wallpaper.interface'
import { useGeneralSetting } from '@/context/general-setting.context'
import { useTheme } from '@/context/theme.context'
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
	const { theme } = useTheme()
	const displayName = wallpaperCategoryTranslations[category] || category

	const getPanelBackgroundStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-100/70'
			case 'dark':
				return 'bg-gray-800/70'
			default: // glass
				return 'bg-white/5'
		}
	}

	const getHeaderHoverStyle = () => {
		switch (theme) {
			case 'light':
				return 'hover:bg-gray-200/50'
			case 'dark':
				return 'hover:bg-gray-700/50'
			default: // glass
				return 'hover:bg-white/5'
		}
	}

	const getTitleStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-700'
			case 'dark':
				return 'text-gray-200'
			default: // glass
				return 'text-gray-200'
		}
	}

	const getCountBadgeStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-200/80 text-gray-700'
			case 'dark':
				return 'bg-gray-700/80 text-gray-300'
			default: // glass
				return 'bg-white/10 text-gray-400'
		}
	}

	const getIconContainerStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-purple-500/10 text-purple-600'
			case 'dark':
				return 'bg-purple-500/20 text-purple-400'
			default: // glass
				return 'bg-purple-500/20 text-purple-300'
		}
	}

	const getChevronStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-500'

			default:
				return 'text-gray-400'
		}
	}

	return (
		<motion.div
			className={`mb-3 overflow-hidden rounded-lg ${getPanelBackgroundStyle()}`}
			initial={{ opacity: 0, y: 5 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<button
				onClick={onToggleExpand}
				className={`flex items-center justify-between w-full p-3 text-left transition-colors ${getHeaderHoverStyle()}`}
			>
				<div className="flex items-center gap-2">
					<div
						className={`flex items-center justify-center w-6 h-6 rounded-full ${getIconContainerStyle()}`}
					>
						<FiTag size={12} />
					</div>
					<span className={`text-sm font-medium ${getTitleStyle()}`}>{displayName}</span>
					<span className={`px-2 py-0.5 text-xs rounded-full ${getCountBadgeStyle()}`}>
						{wallpapers.length}
					</span>
				</div>
				{isExpanded ? (
					<FiChevronUp size={18} className={getChevronStyle()} />
				) : (
					<FiChevronDown size={18} className={getChevronStyle()} />
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
