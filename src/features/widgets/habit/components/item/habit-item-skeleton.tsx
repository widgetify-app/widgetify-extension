interface HabitItemSkeletonProps {
	isStacked?: boolean
}

export function HabitItemSkeleton({ isStacked = false }: HabitItemSkeletonProps) {
	const head = (
		<>
			<div className="rounded-full size-8 shrink-0 skeleton" />
			<div className="flex flex-col flex-1 min-w-0 gap-1.5">
				<div className="w-1/2 h-3 rounded-sm skeleton" />
				<div className="w-1/3 h-2 rounded-sm skeleton" />
			</div>
		</>
	)

	if (isStacked) {
		return (
			<div aria-hidden="true" className="flex flex-col gap-0.5 px-2 pt-1 pb-2">
				<div className="flex items-center gap-2.5 h-9.75">{head}</div>
				<div className="h-4 rounded-sm skeleton ms-10.5" />
			</div>
		)
	}

	return (
		<div aria-hidden="true" className="flex items-center gap-2.5 px-2 min-h-11.5">
			{head}
			<div className="w-14 h-1.5 rounded-xs skeleton shrink-0" />
		</div>
	)
}
