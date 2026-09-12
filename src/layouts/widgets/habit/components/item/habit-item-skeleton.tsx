export function HabitItemSkeleton() {
	return (
		<div className="w-full p-1.5 border rounded-xl border-base-300/40 bg-base-200 text-right animate-pulse">
			<div className="flex items-center gap-2">
				<div className="rounded-lg w-7 h-7 shrink-0 skeleton " />

				<div className="flex-1 min-w-0 space-y-1.5">
					<div className="w-1/2 h-3 rounded skeleton " />
					<div className="w-1/3 h-2 rounded skeleton " />
				</div>

				<div className="h-2.5 w-8 rounded skeleton shrink-0" />
			</div>

			<div className="flex gap-0.5 mt-1.5">
				{Array.from({ length: 7 }).map((_, index) => (
					<div key={index} className="flex-1 h-1.5 rounded-full skeleton" />
				))}
			</div>
		</div>
	)
}
