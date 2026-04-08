import { useEffect, useRef, useState } from 'react'
import { MdOutlineClear } from 'react-icons/md'
import Analytics from '@/analytics'
import { BrowserBookmark } from './browser-bookmark/browser-bookmark'
import { VoiceSearchButton } from './voice/voice-search.button'
import { ImageSearchPortal } from './image/image-search.portal'
import { VoiceSearchPortal } from './voice/voice-search.portal'
import { ImageSearchButton } from './image/image-search.button'
import { EngineSelector } from './enginge-selector'
import { SearchHistoryPortal } from './history.portal'
import { EngineMeta } from '@/services/hooks/trends/getTrends'
import { getFromStorage, setToStorage } from '@/common/storage'

export function SearchLayout() {
	const [searchQuery, setSearchQuery] = useState('')
	const [isInputFocused, setIsInputFocused] = useState(false)
	const [selectedEngine, setSelectedEngine] = useState<EngineMeta | null>(null)

	const [showHistoryPortal, setShowHistoryPortal] = useState(false)
	const searchRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const trendingRef = useRef<HTMLDivElement>(null)
	const [activePortal, setActivePortal] = useState<'voice' | 'image' | null>(null)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const query = searchQuery.trim()
		if (query) {
			SearchHandler({
				content: query,
				engine: selectedEngine,
			})

			Analytics.event('search_query_submitted', { engine: selectedEngine })
			setShowHistoryPortal(false)
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
			SearchHandler({ content: query.trim(), engine: selectedEngine })
			Analytics.event('voice_search_submitted')
		}
	}

	const handleHistorySearch = (query: string) => {
		setSearchQuery(query)
		SearchHandler({
			content: query.trim(),
			engine: selectedEngine,
		})
		Analytics.event('history_search_submitted')
	}

	const onEngineChange = (engine: EngineMeta) => {
		setSelectedEngine(engine)
		setToStorage('selected_engine', engine)
	}

	useEffect(() => {
		const fetchDataFromStorage = async () => {
			const savedEngine = await getFromStorage('selected_engine')
			if (savedEngine) {
				setSelectedEngine(savedEngine)
			}
		}

		fetchDataFromStorage()
	}, [])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				(isInputFocused || showHistoryPortal) &&
				searchRef.current &&
				trendingRef.current &&
				!searchRef.current.contains(event.target as Node) &&
				!trendingRef.current.contains(event.target as Node)
			) {
				setIsInputFocused(false)
				setShowHistoryPortal(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [isInputFocused, showHistoryPortal])

	function onFocusInput() {
		setIsInputFocused(true)
		setShowHistoryPortal(true)
		Analytics.event('search_input_focused')
	}

	return (
		<div className="relative z-50 flex flex-col items-center justify-start h-24 max-h-24">
			<div ref={searchRef} className="w-full p-0.5 bg-content bg-glass rounded-2xl">
				{activePortal === 'voice' && (
					<VoiceSearchPortal
						onClose={() => setActivePortal(null)}
						onSearch={handleVoiceSearch}
					/>
				)}
				{activePortal === 'image' && (
					<ImageSearchPortal onClose={() => setActivePortal(null)} />
				)}
				<form onSubmit={handleSubmit}>
					<div
						className={
							'relative flex items-center  py-2 px-3 overflow-hidden shadow-xs transition-all duration-300  bg-content group  rounded-2xl search-box'
						}
					>
						<EngineSelector
							onSelected={onEngineChange}
							selected={selectedEngine}
						/>

						<input
							ref={inputRef}
							type="text"
							name="search"
							value={searchQuery}
							onChange={handleSearchInputChange}
							onFocus={() => onFocusInput()}
							className={
								'w-full  py-1.5 text-base  font-light text-right focus:outline-none text-content placeholder:text-base-content/60 placeholder:font-medium focus:placeholder:opacity-50 bg-transparent'
							}
							placeholder={`جستجو در ${selectedEngine?.label || 'گوگل'}`}
							autoComplete="off"
						/>
						<button
							type="button"
							onClick={handleClearSearch}
							className={`h-9 w-9 shrink-0 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 ${searchQuery ? 'opacity-70 hover:opacity-100 hover:bg-base-300' : 'opacity-0 pointer-events-none'}`}
						>
							<MdOutlineClear size={20} className="opacity-50" />
						</button>
						<div className="flex items-center gap-0.5 ml-1">
							<ImageSearchButton onClick={() => setActivePortal('image')} />
							<VoiceSearchButton onClick={() => setActivePortal('voice')} />
						</div>
						<div
							className={
								'absolute inset-0 transition-all duration-300 border pointer-events-none rounded-2xl border-base-content/5'
							}
						/>
					</div>
				</form>

				{showHistoryPortal && !activePortal && (
					<SearchHistoryPortal
						onClose={() => setShowHistoryPortal(false)}
						onSearch={handleHistorySearch}
						onEngineChange={onEngineChange}
					/>
				)}

				<BrowserBookmark />
			</div>
		</div>
	)
}

function SearchHandler({
	content,
	engine,
}: {
	content: string
	engine: EngineMeta | null
}) {
	if (!engine || engine?.id === 'google') {
		browser.search.query({ text: content })
	} else {
		window.open(engine?.prefix + encodeURIComponent(content), '_self')
	}
}
