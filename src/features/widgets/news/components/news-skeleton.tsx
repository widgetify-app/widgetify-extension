export function NewsSkeleton() {
	return (
		<div aria-hidden="true" className="flex items-center gap-2.5 px-2 py-1.5">
			<div className="flex-none rounded-lg size-11 skeleton" />
			<div className="flex flex-col flex-1 min-w-0 gap-1.5">
				<div className="w-full h-2.5 rounded-sm skeleton" />
				<div className="w-2/3 h-2.5 rounded-sm skeleton" />
				<div className="w-16 h-2 rounded-sm skeleton" />
			</div>
		</div>
	)
}
