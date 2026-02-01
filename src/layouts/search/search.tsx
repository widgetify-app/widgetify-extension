import { useEffect, useRef, useState } from 'react'
import { MdOutlineClear } from 'react-icons/md'
import Analytics from '@/analytics'
import { BrowserBookmark } from './browser-bookmark/browser-bookmark'
import { VoiceSearchButton } from './voice/VoiceSearchButton'
import { FcGoogle } from 'react-icons/fc'

export function SearchLayout() {
	const [searchQuery, setSearchQuery] = useState('')
	const [isInputFocused, setIsInputFocused] = useState(false)
	const searchRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const trendingRef = useRef<HTMLDivElement>(null)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const query = searchQuery.trim()
		if (query) {
			browser.search.query({ text: query })
			Analytics.event('search_query_submitted')
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

	const handleVoiceSearch = (query: string) => {
		if (query.trim()) {
			browser.search.query({ text: query.trim() })
			Analytics.event('voice_search_submitted')
		}
	}

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				isInputFocused &&
				searchRef.current &&
				trendingRef.current &&
				!searchRef.current.contains(event.target as Node) &&
				!trendingRef.current.contains(event.target as Node)
			) {
				setIsInputFocused(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [isInputFocused])

	function onFocusInput() {
		setIsInputFocused(true)
		Analytics.event('search_input_focused')
	}

	return (
		<div className="relative z-50 flex flex-col items-center justify-start h-24">
			<div ref={searchRef} className="w-full bg-content widget-wrapper rounded-2xl">
				<form onSubmit={handleSubmit}>
					<div
						className={
							'relative flex items-center  py-2 px-3 overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl bg-content group  rounded-2xl search-box'
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
							<FcGoogle size={22} opacity={0.8} />
						</button>
						<input
							ref={inputRef}
							type="text"
							name="search"
							value={searchQuery}
							onChange={handleSearchInputChange}
							onFocus={() => onFocusInput()}
							className={
								'w-full py-1.5 text-base font-light text-right focus:outline-none text-content placeholder:text-base-content/80 placeholder:font-medium focus:placeholder:opacity-50 bg-transparent '
							}
							placeholder="جستجو در گوگل"
							autoComplete="off"
						/>
						<button
							type="button"
							onClick={handleClearSearch}
							className={`h-9 w-9 shrink-0 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 ${searchQuery ? 'opacity-70 hover:opacity-100 hover:bg-base-300' : 'opacity-0 pointer-events-none'}`}
						>
							<MdOutlineClear size={20} className="opacity-50" />
						</button>
						<VoiceSearchButton onSearch={handleVoiceSearch} />
						<div
							className={
								'absolute inset-0 transition-all duration-300 border pointer-events-none rounded-2xl border-content'
							}
						/>
					</div>
				</form>
				<BrowserBookmark />
			</div>
		</div>
	)
}
