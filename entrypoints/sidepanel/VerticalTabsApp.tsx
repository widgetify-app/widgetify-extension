import { HiOutlinePlusCircle } from 'react-icons/hi'
import Analytics from '@/analytics'
import { getFromStorage } from '@/common/storage'
import { Theme } from '@/context/theme.context'
import { safeAwait } from '@/services/api'
import { FavoriteProvider } from './context/favorite.context'
import { FavoriteSites } from './layouts/favorite/favorite-sites'
import { SearchBoxSidePanel } from './layouts/searchbox/searchbox'
import { TabsList } from './layouts/tabs/tabs-list'

export default function VerticalTabsApp() {
	const handleNewTab = async () => {
		await safeAwait(browser.tabs.create({}))
	}

	useEffect(() => {
		function changeTheme(theme: 'light' | 'dark') {
			console.log('Changing theme to:', theme)
			document.documentElement.setAttribute('data-theme', theme)
		}
		async function loadTheme() {
			const theme = await getFromStorage('theme')
			if (theme === Theme.Light) {
				changeTheme('light')
			} else changeTheme('dark')
		}

		loadTheme()
		Analytics.event('sidepanel_view')
	}, [])

	return (
		<FavoriteProvider>
			<div className="flex flex-col h-screen text-white" dir="rtl">
				<header className="flex items-center justify-between flex-shrink-0 p-2 border-b border-content bg-base-200">
					<div className="flex items-center gap-2">
						<span className="text-white badge badge-primary badge-sm">
							نسخه آزمایشی
						</span>
					</div>

					<SearchBoxSidePanel />
				</header>
				<div className="flex flex-col flex-1 min-h-0 overflow-hidden">
					<div className="flex-shrink-0">
						<FavoriteSites />
					</div>

					<div className="flex-1 pb-2 mt-2 overflow-y-auto">
						<TabsList />
					</div>
				</div>

				<footer className="flex-shrink-0 border-t border-content bg-base-200">
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
