export function NetworkLoadingSkeleton() {
	return (
		<div className="space-y-2">
			{/* Main Card Skeleton */}
			<div className="relative overflow-hidden border border-content rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-teal-500/10 border-content/10">
				<div className="p-4 space-y-3">
					{/* Header */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
							<div className="w-12 h-3 bg-gray-300 rounded animate-pulse"></div>
						</div>
						<div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
					</div>

					{/* IP Address */}
					<div className="py-2 text-center">
						<div className="w-16 h-3 mx-auto mb-2 bg-gray-300 rounded animate-pulse"></div>
						<div className="w-32 h-8 mx-auto bg-gray-300 rounded-xl animate-pulse"></div>
					</div>

					{/* Location */}
					<div className="flex items-center justify-center gap-2">
						<div className="w-16 h-6 bg-gray-300 rounded-full animate-pulse"></div>
						<div className="w-12 h-6 bg-gray-300 rounded-full animate-pulse"></div>
					</div>
				</div>
			</div>

			{/* Grid Skeleton */}
			<div className="grid grid-cols-2 gap-2">
				<div className="p-3 border rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
					<div className="flex items-center gap-2 mb-1">
						<div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
						<div className="w-8 h-3 bg-gray-300 rounded animate-pulse"></div>
					</div>
					<div className="w-12 h-4 bg-gray-300 rounded animate-pulse"></div>
				</div>
				<div className="p-3 border rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
					<div className="flex items-center gap-2 mb-1">
						<div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
						<div className="w-8 h-3 bg-gray-300 rounded animate-pulse"></div>
					</div>
					<div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
				</div>
			</div>
		</div>
	)
}
