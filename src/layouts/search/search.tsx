import { useEffect, useRef, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { MdOutlineClear } from 'react-icons/md'
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
			browser.search.query({ text: query })
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
		setIsInputFocused(false)
		// Optional: auto-submit the search
		browser.search.query({ text: trend })
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
								'relative flex items-center gap-x-2 py-2 px-3 overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl rounded-4xl group bg-widget search-box'
							}
						>
							<button
								type="submit"
								className={
									'h-9 w-9 shrink-0 flex items-center justify-center rounded-full opacity-70 hover:opacity-100 hover:bg-base-300 cursor-pointer transition-all duration-300'
								}
								onClick={() => {
									if (!searchQuery) {
										inputRef.current?.focus()
									}
								}}
							>
								<CiSearch size={22} strokeWidth={1} opacity={0.5} />
							</button>
							<input
								ref={inputRef}
								type="text"
								name="search"
								value={searchQuery}
								onChange={handleSearchInputChange}
								onFocus={() => setIsInputFocused(true)}
								className={
									'w-full py-1.5 text-base font-light text-right focus:outline-none text-content placeholder:text-content'
								}
								placeholder="جستجو ..."
								autoComplete="off"
							/>
							<button
								type="button"
								onClick={handleClearSearch}
								className={`h-9 w-9 shrink-0 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 ${searchQuery ? 'opacity-70 hover:opacity-100 hover:bg-base-300' : 'opacity-0 pointer-events-none'}`}
							>
								<MdOutlineClear size={20} className="opacity-50" />
							</button>
							<div
								className={
									'absolute inset-0 transition-all duration-300 border pointer-events-none rounded-4xl border-content'
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
