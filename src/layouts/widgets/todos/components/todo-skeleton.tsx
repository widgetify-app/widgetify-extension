export function TodoSkeleton() {
	return (
		<div
			aria-hidden="true"
			className="flex flex-row justify-between gap-1 p-1 overflow-hidden border rounded-lg shadow-sm border-base-content/10 bg-glass bg-base-content/5"
		>
			<div className="flex items-center gap-1">
				<div className="w-5 h-5 rounded-md skeleton shrink-0" />
				<div className="w-32 h-5 skeleton" />
			</div>
			<div className="w-5 h-5 rounded-md skeleton shrink-0" />
		</div>
	)
}
