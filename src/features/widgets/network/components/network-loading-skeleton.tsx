export function NetworkLoadingSkeleton() {
	return (
		<div aria-hidden="true" className="flex flex-col flex-1 min-h-0">
			<div className="flex items-center gap-2.5 px-1 py-2.5">
				<div className="flex-none rounded-full size-6.5 skeleton" />
				<div className="flex flex-col flex-1 gap-1.5">
					<div className="w-24 h-3 rounded-sm skeleton" />
					<div className="w-16 h-2.5 rounded-sm skeleton" />
				</div>
			</div>
			<div className="flex flex-col gap-2 px-1 py-2.5 border-t border-line">
				<div className="w-12 h-2.5 rounded-sm skeleton" />
				<div className="h-4 rounded-sm w-28 skeleton" />
			</div>
			<div className="flex flex-col gap-2 px-1 py-2.5 border-t border-line">
				<div className="w-10 h-2.5 rounded-sm skeleton" />
				<div className="w-16 h-6 rounded-sm skeleton" />
			</div>
		</div>
	)
}
