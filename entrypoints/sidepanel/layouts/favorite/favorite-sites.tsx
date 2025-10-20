import Tooltip from '@/components/toolTip'
import { useFavoriteStore } from '../../context/favorite.context'

export function FavoriteSites() {
	const { favorites } = useFavoriteStore()

	if (favorites.length === 0) return null

	return (
		<div className="p-4">
			<div className="grid grid-cols-5 gap-x-3 gap-y-2 sm:grid-cols-8">
				{/* Empty slots */}
				{favorites.map((item, index) => {
					return (
						<div
							key={`empty-${index}`}
							className="flex items-center justify-center w-8 h-8 p-1 transition-all rounded-md cursor-pointer hover:bg-base-300"
						>
							<Tooltip content={item.title}>
								<img
									src={item.favicon}
									alt={item.title}
									className="object-cover w-full h-full rounded-md"
								/>
							</Tooltip>
						</div>
					)
				})}
			</div>
		</div>
	)
}
