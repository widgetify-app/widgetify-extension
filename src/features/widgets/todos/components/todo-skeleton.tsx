export function TodoSkeleton() {
	return (
		<div aria-hidden="true" className="flex items-center gap-2.5 px-2 min-h-8.5">
			<div className="rounded-full size-4 skeleton shrink-0" />
			<div className="w-2/3 h-2.5 rounded-sm skeleton" />
		</div>
	)
}
