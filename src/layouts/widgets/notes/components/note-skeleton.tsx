export function NoteSkeleton() {
	return (
		<div
			aria-hidden="true"
			className="flex flex-col gap-1.5 px-2.5 py-2 overflow-hidden rounded-2xl bg-base-content/5"
		>
			<div className="flex items-center justify-between gap-2">
				<div className="w-24 h-3 rounded skeleton" />
				<div className="w-10 h-2.5 rounded skeleton" />
			</div>
			<div className="w-full h-2.5 rounded skeleton" />
			<div className="w-2/3 h-2.5 rounded skeleton" />
		</div>
	)
}
