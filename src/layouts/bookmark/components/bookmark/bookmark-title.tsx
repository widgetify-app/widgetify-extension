export function BookmarkTitle({
	title,
	customTextColor,
}: {
	title: string
	theme?: string
	customTextColor?: string
}) {
	return (
		<div className="mt-0.5 text-center w-20 truncate" dir="auto">
			<span
				style={{ color: customTextColor || undefined, zIndex: 10 }}
				className={`text-[.7rem] font-medium transition-colors duration-300 opacity-85 ${!customTextColor && 'text-content'} group-hover:opacity-100`}
			>
				{title}
			</span>
		</div>
	)
}
