import { getTextColor } from '@/context/theme.context'

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
