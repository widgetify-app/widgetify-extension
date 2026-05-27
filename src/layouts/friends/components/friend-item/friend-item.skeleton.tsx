export function MakeSkeletonFriendItem(count: number) {
	return [...Array(count)].map((_, catIdx) => (
		<div
			key={`loading-${catIdx}`}
			className="w-full h-8 border rounded-xl skeleton bg-base-content/5 border-content"
		></div>
	))
}
