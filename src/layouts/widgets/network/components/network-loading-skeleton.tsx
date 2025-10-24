export function NetworkLoadingSkeleton() {
	return (
		<div className="space-y-2">
			{/* Main Card Skeleton */}
			<div className="relative overflow-hidden border border-content rounded-2xl">
				<div className="p-4 space-y-3">
					{/* Header */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 rounded-full bg-content animate-pulse"></div>
							<div className="w-12 h-3 rounded bg-content animate-pulse"></div>
						</div>
						<div className="w-5 h-5 rounded-full bg-content animate-pulse"></div>
					</div>

					{/* IP Address */}
					<div className="py-2 text-center">
						<div className="w-16 h-3 mx-auto mb-2 rounded bg-content animate-pulse"></div>
						<div className="w-32 h-8 mx-auto bg-content rounded-xl animate-pulse"></div>
					</div>

					{/* Location */}
					<div className="flex items-center justify-center gap-2">
						<div className="w-16 h-6 rounded-full bg-content animate-pulse"></div>
						<div className="w-12 h-6 rounded-full bg-content animate-pulse"></div>
					</div>
				</div>
				<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
			</div>

			{/* Grid Skeleton */}
			<div className="flex-1 space-y-2 ">
				<div className="relative p-3 border rounded-2xl border-content">
					<div className="flex items-center gap-2 mb-1">
						<div className="w-2 h-2 rounded-full bg-content animate-pulse"></div>
						<div className="w-8 h-3 rounded bg-content animate-pulse"></div>
					</div>
					<div className="w-12 h-4 rounded bg-content animate-pulse"></div>
					<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
				</div>
			</div>
		</div>
	)
}
