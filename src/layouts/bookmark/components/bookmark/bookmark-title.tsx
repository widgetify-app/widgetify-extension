export function BookmarkTitle({
	title,
	customTextColor,
}: {
	title: string
	theme?: string
	customTextColor?: string
}) {
	return (
		<div className="px-1 text-center truncate w-full max-w-full shrink-0" dir="auto">
			<span
				style={{ color: customTextColor || undefined, zIndex: 10 }}
				className={`text-3xs sm:text-2xs md:text-xs font-medium leading-tight transition-colors duration-300 opacity-85 block truncate ${!customTextColor && 'text-fg'} group-hover:opacity-100`}
			>
				{title}
			</span>
		</div>
	)
}
