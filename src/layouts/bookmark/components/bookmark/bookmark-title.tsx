export function BookmarkTitle({
	title,
	customTextColor,
}: {
	title: string
	theme?: string
	customTextColor?: string
}) {
	return (
		<div className="px-1 text-center truncate w-22 max-w-22" dir="auto">
			<span
				style={{ color: customTextColor || undefined, zIndex: 10 }}
				className={`text-[.65rem] sm:text-[.7rem] md:text-[.75rem] font-medium transition-colors duration-300 opacity-85 block truncate ${!customTextColor && 'text-content'} group-hover:opacity-100`}
			>
				{title}
			</span>
		</div>
	)
}
