export function NewsSkeleton() {
	return (
		<div
			aria-hidden="true"
			className="flex items-center gap-2 p-1.5 rounded-xl bg-subtle"
		>
			<div className="w-10 h-10 rounded-lg shrink-0 skeleton opacity-40" />
			<div className="flex flex-col flex-1 min-w-0 gap-1">
				<div className="w-full h-2.5 rounded skeleton opacity-30" />
				<div className="w-2/3 h-2.5 rounded skeleton opacity-25" />
				<div className="w-16 h-2 rounded skeleton opacity-20 mt-0.5" />
			</div>
		</div>
	)
}
