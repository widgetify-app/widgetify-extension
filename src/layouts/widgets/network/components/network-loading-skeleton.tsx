export function NetworkLoadingSkeleton() {
	return (
		<div aria-hidden="true" className="flex-1 space-y-2">
			<div className="relative overflow-hidden border border-content rounded-2xl">
				<div className="p-2 space-y-3 max-h-32 min-h-32">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 rounded-full skeleton" />
							<div className="w-12 h-3 rounded skeleton" />
						</div>
						<div className="w-5 h-5 rounded-sm skeleton" />
					</div>

					<div className="py-2 text-center">
						<div className="w-16 h-3 mx-auto mb-2 rounded skeleton" />
						<div className="w-32 h-8 mx-auto skeleton rounded-xl" />
					</div>

					<div className="flex items-center justify-center gap-2">
						<div className="w-16 h-6 rounded-full skeleton" />
						<div className="w-12 h-6 rounded-full skeleton" />
					</div>
				</div>
			</div>

			<div className="p-3 border rounded-2xl border-content">
				<div className="flex items-center gap-2 mb-1">
					<div className="w-4 h-4 rounded skeleton" />
					<div className="w-24 h-3 rounded skeleton" />
				</div>
				<div className="w-12 h-4 rounded skeleton" />
			</div>

			<div className="w-full h-10 rounded-2xl skeleton" />
		</div>
	)
}
