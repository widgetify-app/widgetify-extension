export function MakeSkeletonFriendItem(count: number) {
	return [...Array(count)].map((_, catIdx) => (
		<div
			key={`loading-${catIdx}`}
			className="w-full border h-14 rounded-xl skeleton bg-base-content/5 border-content"
		></div>
	))
}
