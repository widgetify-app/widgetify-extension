export function MiniAppCardSkeleton() {
	return (
		<div className="flex items-center gap-3 p-2 border border-ds-surface-3 rounded-2xl bg-ds-surface-2">
			<div className="w-8 h-8 rounded-xl skeleton bg-ds-fill-2 shrink-0" />
			<div className="flex-1 space-y-2">
				<div className="w-28 h-3.5 rounded-full skeleton bg-ds-fill-2" />
				<div className="w-40 h-2.5 rounded-full skeleton bg-ds-fill" />
			</div>
		</div>
	)
}
