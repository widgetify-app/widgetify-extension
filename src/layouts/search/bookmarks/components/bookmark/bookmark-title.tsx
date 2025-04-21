import { motion } from 'framer-motion'
export function BookmarkTitle({
	title,
	theme = 'glass',
	customTextColor,
}: { title: string; theme?: string; customTextColor?: string }) {
	const getTitleStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-600 group-hover:text-gray-800'
			case 'dark':
				return 'text-gray-400 group-hover:text-white'
			default: // glass
				return 'text-gray-400 group-hover:text-white'
		}
	}

	return (
		<span
			style={customTextColor ? { color: customTextColor } : undefined}
			className={`text-[.7rem] z-50 w-full text-center font-semibold transition-colors duration-300 truncate ${!customTextColor ? getTitleStyle() : ''}`}
		>
			{title}
		</span>
	)
}

export function BookmarkTooltip({
	title,
	theme = 'glass',
}: { title: string; theme?: string }) {
	const getTooltipStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-800/90 text-white'
			case 'dark':
				return 'bg-black/90 text-white'
			default: // glass
				return 'bg-neutral-900/70 text-white'
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 0.9, y: 0 }}
			className={`absolute z-50 px-2 py-1 text-sm transition-all duration-200 -translate-y-full rounded-lg -top-2 ${getTooltipStyle()}`}
		>
			{title}
		</motion.div>
	)
}
