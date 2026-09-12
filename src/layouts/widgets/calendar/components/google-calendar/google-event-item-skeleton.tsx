export function GoogleEventItemSkeleton() {
	return (
		<div className="flex items-center gap-0 px-1 py-1.5">
			<div className="flex flex-col items-end w-10 gap-1 pl-1 shrink-0">
				<div className="w-8 h-3 rounded skeleton" />
				<div className="w-6 h-2 rounded skeleton" />
			</div>
			<div className="skeleton w-0.75 self-stretch rounded-full mx-2 shrink-0" />
			<div className="flex-1 flex flex-col gap-1.5">
				<div className="w-3/4 h-3 rounded skeleton" />
				<div className="w-1/3 h-2 rounded skeleton" />
			</div>
		</div>
	)
}
