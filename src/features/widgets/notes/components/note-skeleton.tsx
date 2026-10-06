export function NoteSkeleton() {
	return (
		<div aria-hidden="true" className="flex items-start gap-2.5 p-2">
			<div className="grid size-4 place-items-center shrink-0">
				<div className="rounded-full size-1.75 skeleton" />
			</div>
			<div className="flex flex-col flex-1 gap-1.5">
				<div className="w-1/2 h-3 rounded-sm skeleton" />
				<div className="w-5/6 h-2.5 rounded-sm skeleton" />
			</div>
		</div>
	)
}
