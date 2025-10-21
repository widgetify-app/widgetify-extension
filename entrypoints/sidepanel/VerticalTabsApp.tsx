import { HiOutlinePlusCircle } from 'react-icons/hi'
import { TextInput } from '@/components/text-input'
import { safeAwait } from '@/services/api'
import { FavoriteProvider } from './context/favorite.context'
import { FavoriteSites } from './layouts/favorite/favorite-sites'
import { TabsList } from './layouts/tabs/tabs-list'

export default function VerticalTabsApp() {
	const handleNewTab = async () => {
		await safeAwait(browser.tabs.create({}))
	}

	return (
		<FavoriteProvider>
			<div className="flex flex-col min-h-screen text-white" dir="rtl">
				<div className="flex-1">
					<FavoriteSites />

					<div className="mt-2 ">
						<TabsList />
					</div>
				</div>

				<div className="w-56 p-2">
					<TextInput
						onChange={() => {}}
						value=""
						placeholder="جستجو در وب..."
					/>
				</div>
				<footer className="sticky bottom-0 border-t border-content">
					<button
						onClick={handleNewTab}
						className="w-full flex items-center gap-1 justify-center p-4 text-sm font-medium transition-colors hover:bg-base-300 text-content hover:text-primary cursor-pointer text-muted hover:!text-content"
					>
						<HiOutlinePlusCircle />
						تب جدید
					</button>
				</footer>
			</div>
		</FavoriteProvider>
	)
}
