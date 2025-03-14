import { CiSearch } from 'react-icons/ci'
import { BookmarkProvider } from '../../context/bookmark.context'
import { useTheme } from '../../context/theme.context'
import { BookmarksComponent } from './bookmarks/bookmarks'
import Browser from 'webextension-polyfill'

export function SearchLayout() {
	const { theme, themeUtils } = useTheme()

	const getSearchBoxBackground = () => {
		switch (theme) {
			case 'light':
				return 'bg-white hover:bg-white/95'
			case 'dark':
				return 'bg-neutral-800  hover:bg-neutral-700/90'
			default:
				return 'bg-neutral-900/70 backdrop-blur-sm hover:bg-neutral-800/80'
		}
	}

	const getSearchButtonStyles = () => {
		switch (theme) {
			case 'light':
				return 'text-blue-600 bg-blue-100/80 hover:bg-blue-200/90 hover:text-blue-700'
			case 'dark':
				return 'text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 hover:text-blue-200'
			default:
				return 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 hover:text-blue-300'
		}
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const query = (e.target as HTMLFormElement).search.value
		if (query.trim()) {
			Browser.search.query({ text: query })
		}
	}

	return (
		<>
			<div className="flex flex-col items-center justify-center max-h-80">
				<form className="w-full" onSubmit={handleSubmit}>
					<div
						className={`relative overflow-hidden transition-all duration-300 shadow-xl rounded-2xl group ${getSearchBoxBackground()}`}
					>
						<input
							type="text"
							name="search"
							className={`w-full py-4 pl-16 pr-6 text-lg font-light text-right bg-transparent focus:outline-none ${themeUtils.getTextColor()}`}
							placeholder="جستجو در گوگل..."
							autoComplete="off"
						/>
						<button
							type="submit"
							className={`absolute p-2 transition-all duration-300 -translate-y-1/2 rounded-lg cursor-pointer left-3 top-1/2 ${getSearchButtonStyles()}`}
						>
							<CiSearch size={20} />
						</button>
						<div
							className={`absolute inset-0 transition-all duration-300 border pointer-events-none rounded-2xl ${themeUtils.getBorderColor()}`}
						/>
					</div>
				</form>
				<BookmarkProvider>
					<BookmarksComponent />
				</BookmarkProvider>
			</div>
		</>
	)
}
