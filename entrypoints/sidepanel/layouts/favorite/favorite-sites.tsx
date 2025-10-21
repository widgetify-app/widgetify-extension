import Analytics from '@/analytics'
import Tooltip from '@/components/toolTip'
import { useFavoriteStore } from '../../context/favorite.context'
import type { FavoriteSite } from './favorite.types'

export function FavoriteSites() {
	const { favorites } = useFavoriteStore()

	if (favorites.length === 0) return null
	const onClick = (item: FavoriteSite) => {
		Analytics.event('vertical_tabs_favorite_site_clicked')
		browser.tabs.create({ url: item.url })
	}
	return (
		<div className="p-4">
			<div className="grid grid-cols-5 gap-4 justify-items-center">
				{[...favorites, ...favorites].map((item, index) => (
					<div
						key={`fav-${index}`}
						className="flex items-center justify-center w-full h-12 p-2 transition-all rounded-lg cursor-pointer bg-base-300 hover:bg-base-200 aspect-square"
						onClick={() => onClick(item)}
					>
						<Tooltip content={item.title}>
							<img
								src={item.favicon}
								alt={item.title}
								className="object-cover w-full h-full rounded-md "
							/>
						</Tooltip>
					</div>
				))}
			</div>
		</div>
	)
}
