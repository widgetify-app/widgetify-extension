export function NewsSkeleton() {
	return (
		<div
			aria-hidden="true"
			className="flex items-center gap-2.5 p-2 border rounded-2xl border-base-content/10 bg-base-content/5"
		>
			<div className="rounded-xl w-14 h-14 shrink-0 skeleton" />
			<div className="flex flex-col flex-1 min-w-0 gap-1.5">
				<div className="w-full h-3 rounded skeleton" />
				<div className="w-2/3 h-3 rounded skeleton" />
				<div className="w-20 h-2.5 rounded skeleton mt-0.5" />
			</div>
		</div>
	)
}
