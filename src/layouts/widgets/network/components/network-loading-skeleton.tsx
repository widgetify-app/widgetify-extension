export function NetworkLoadingSkeleton() {
	return (
		<div className="space-y-3">
			{[...Array(4)].map((_, index) => (
				<div
					key={index}
					className="p-3 border border-content rounded-xl bg-gradient-to-r from-base-100 to-base-200/50"
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
							<div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
						</div>
						<div className="w-20 h-6 bg-gray-300 rounded-full animate-pulse"></div>
					</div>
				</div>
			))}
		</div>
	)
}
