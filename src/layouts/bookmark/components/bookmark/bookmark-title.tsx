import { getCardBackground, getTextColor } from '@/context/theme.context'
import { motion } from 'framer-motion'
export function BookmarkTitle({
	title,
	theme = 'glass',
	customTextColor,
}: { title: string; theme?: string; customTextColor?: string }) {
	return (
		<span
			style={customTextColor ? { color: customTextColor } : undefined}
			className={`text-[.7rem] z-50 w-full text-center font-semibold transition-colors duration-300 truncate opacity-85 ${!customTextColor ? `${getTextColor(theme)} ` : ''} group-hover:opacity-100`}
		>
			{title}
		</span>
	)
}

export function BookmarkTooltip({
	title,
	theme = 'glass',
}: { title: string; theme?: string }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 0.9, y: 0 }}
			className={`absolute z-50 px-2 py-1 text-sm transition-all duration-200 -translate-y-full rounded-lg -top-2 ${getCardBackground(theme)} shadow-md`}
		>
			{title}
		</motion.div>
	)
}
