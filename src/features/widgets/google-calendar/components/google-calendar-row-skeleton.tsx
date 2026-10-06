export function GoogleCalendarRowSkeleton() {
	return (
		<div aria-hidden="true" className="flex items-center gap-2.5 px-2 min-h-10.5">
			<div className="flex flex-col gap-1 w-9.5 shrink-0">
				<div className="w-8 h-2.5 rounded-sm skeleton" />
				<div className="w-6 h-2 rounded-sm skeleton" />
			</div>
			<div className="rounded-full size-2 skeleton shrink-0" />
			<div className="flex flex-col flex-1 gap-1.5">
				<div className="w-2/3 h-2.5 rounded-sm skeleton" />
				<div className="w-1/3 h-2 rounded-sm skeleton" />
			</div>
		</div>
	)
}
