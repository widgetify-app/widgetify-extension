import { BookmarkProvider } from '@/context/bookmark.context'
import { useTheme } from '@/context/theme.context'
import { useRef, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { MdOutlineClear } from 'react-icons/md'
import Browser from 'webextension-polyfill'
import { BookmarksComponent } from './bookmarks/bookmarks'

export function SearchLayout() {
	const { theme, themeUtils } = useTheme()
	const [searchQuery, setSearchQuery] = useState('')
	const searchRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	const getSearchBoxBackground = () => {
		switch (theme) {
			case 'light':
				return 'bg-white hover:bg-white/95'
			case 'dark':
				return 'bg-neutral-800 hover:bg-neutral-700/90'
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

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const query = searchQuery.trim()
		if (query) {
			Browser.search.query({ text: query })
		}
	}

	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value)
	}

	const handleClearSearch = () => {
		setSearchQuery('')
		if (inputRef.current) {
			inputRef.current.focus()
		}
	}

	return (
		<>
			<div className="flex flex-col items-center justify-center">
				<div className="relative w-full" ref={searchRef}>
					<form className="w-full" onSubmit={handleSubmit}>
						<div
							className={`relative overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl group ${getSearchBoxBackground()}`}
						>
							<input
								ref={inputRef}
								type="text"
								name="search"
								value={searchQuery}
								onChange={handleSearchInputChange}
								className={`w-full py-4 pr-12 pl-16 text-lg font-medium text-right bg-transparent focus:outline-none ${themeUtils.getTextColor()}`}
								placeholder="جستجو ..."
								autoComplete="off"
							/>
							<button
								type="submit"
								className={`absolute p-3 transition-all duration-300 -translate-y-1/2 rounded-lg cursor-pointer left-2 top-1/2 ${getSearchButtonStyles()}`}
							>
								<CiSearch size={22} />
							</button>
							{searchQuery && (
								<button
									type="button"
									onClick={handleClearSearch}
									className={
										'absolute p-2 transition-all duration-200 -translate-y-1/2 rounded-full cursor-pointer right-3 top-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
									}
								>
									<MdOutlineClear size={16} />
								</button>
							)}
							<div
								className={`absolute inset-0 transition-all duration-300 border pointer-events-none rounded-xl ${themeUtils.getBorderColor()}`}
							/>
						</div>
					</form>
				</div>
				<BookmarkProvider>
					<BookmarksComponent />
				</BookmarkProvider>
			</div>
		</>
	)
}
