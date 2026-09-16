export function SuggestionSkeleton() {
	return (
		<div className="px-2 pt-2 pb-1 space-y-1">
			{Array.from({ length: 4 }).map((_, i) => (
				<div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl">
					<div className="w-4 h-4 rounded bg-base-content/10 animate-pulse shrink-0" />
					<div
						className="h-3.5 rounded bg-base-content/10 animate-pulse"
						style={{ width: `${55 + i * 10}%` }}
					/>
				</div>
			))}
		</div>
	)
}
