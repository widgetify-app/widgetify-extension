import { FavoriteProvider } from './context/favorite.context'
import { FavoriteSites } from './layouts/favorite/favorite-sites'
import { TabsList } from './layouts/tabs/tabs-list'

export default function VerticalTabsApp() {
	return (
		<FavoriteProvider>
			<div className="min-h-screen text-white" dir="rtl">
				<FavoriteSites />

				<div className="mt-2 border-t border-gray-700">
					<TabsList />
				</div>
			</div>
		</FavoriteProvider>
	)
}
