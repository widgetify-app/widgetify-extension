import { useEffect, useRef, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { MdOutlineClear } from 'react-icons/md'
import Browser from 'webextension-polyfill'
import { TrendingSearches } from './trending/trending-searches'

export function SearchLayout() {
	const [searchQuery, setSearchQuery] = useState('')
	const [isInputFocused, setIsInputFocused] = useState(false)
	const searchRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)

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

	const handleSelectTrend = (trend: string) => {
		setSearchQuery(trend)
		setIsInputFocused(false)
		// Optional: auto-submit the search
		// Browser.search.query({ text: trend })
	}

	useEffect(() => {
		// Close trends dropdown when clicking outside
		const handleClickOutside = (event: MouseEvent) => {
			if (
				isInputFocused &&
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setIsInputFocused(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [isInputFocused])

	return (
		<>
			<div className="flex flex-col items-center justify-center">
				<div className="relative w-full" ref={searchRef}>
					<form className="w-full" onSubmit={handleSubmit}>
						<div
							className={
								'relative overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl group bg-content'
							}
						>
							<input
								ref={inputRef}
								type="text"
								name="search"
								value={searchQuery}
								onChange={handleSearchInputChange}
								onFocus={() => setIsInputFocused(true)}
								className={
									'w-full py-4 pr-12 pl-16 text-lg font-light text-right focus:outline-none text-content placeholder:text-gray-400 dark:placeholder:text-content'
								}
								placeholder="جستجو ..."
								autoComplete="off"
							/>
							<button
								type="submit"
								className={
									'absolute p-3 transition-all duration-300 -translate-y-1/2 rounded-lg cursor-pointer left-2 top-1/2'
								}
							>
								<CiSearch size={22} />
							</button>
							{searchQuery && (
								<button
									type="button"
									onClick={handleClearSearch}
									className={
										'absolute p-2 transition-all duration-200 -translate-y-1/2 rounded-full cursor-pointer right-3 top-1/2 text-gray-400 hover:text-gray-600 dark:text-content dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
									}
								>
									<MdOutlineClear size={16} />
								</button>
							)}
							<div
								className={
									'absolute inset-0 transition-all duration-300 border pointer-events-none rounded-xl border-content'
								}
							/>
						</div>
					</form>

					{/* Trending searches that shows on input focus */}
					<TrendingSearches
						visible={isInputFocused && searchQuery === ''}
						onSelectTrend={handleSelectTrend}
					/>
				</div>
			</div>
		</>
	)
}
