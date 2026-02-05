export function BookmarkTitle({
	title,
	customTextColor,
}: {
	title: string
	theme?: string
	customTextColor?: string
}) {
	return (
		<div className="mt-0.5 truncate w-full text-center" dir="auto">
			<span
				style={{
					color: customTextColor || undefined,
					zIndex: 10,
				}}
				className={`text-[.7rem]  w-full text-center font-medium transition-colors duration-300 truncate opacity-85 ${!customTextColor && 'text-content'} group-hover:opacity-100`}
			>
				{title}
			</span>
		</div>
	)
}
