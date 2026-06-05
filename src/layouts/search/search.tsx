import { useEffect, useRef, useState } from 'react'
import { MdOutlineClear, MdOutlineSearch } from 'react-icons/md'
import Analytics from '@/analytics'
import { BrowserBookmark } from './browser-bookmark/browser-bookmark'
import { VoiceSearchButton } from './voice/voice-search.button'
import { ImageSearchPortal } from './image/image-search.portal'
import { VoiceSearchPortal } from './voice/voice-search.portal'
import { ImageSearchButton } from './image/image-search.button'
import { EngineSelector } from './select-engine/engine-selector'
import { SearchHistoryPortal } from './history.portal'
import type { EngineMeta } from '@/services/hooks/trends/getTrends'

const DEFAULT_ENGINE: EngineMeta = {
	id: 'google',
	prefix: '',
	label: 'گوگل',
	icon: '',
}

export function SearchLayout() {
	const [searchQuery, setSearchQuery] = useState('')
	const [isInputFocused, setIsInputFocused] = useState(false)
	const [selectedEngine, setSelectedEngine] = useState<EngineMeta>(DEFAULT_ENGINE)
	const [showHistoryPortal, setShowHistoryPortal] = useState(false)
	const searchRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const [activePortal, setActivePortal] = useState<'voice' | 'image' | null>(null)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const query = searchQuery.trim()
		if (query) {
			SearchHandler({
				content: query,
				engine: selectedEngine,
			})

			Analytics.event('search_query_submitted')
			setShowHistoryPortal(false)
		}
	}

	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value)
	}

	const handleClearSearch = () => {
		setSearchQuery('')
		if (inputRef.current) {
			inputRef.current.value = ''
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
	}

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target: HTMLDivElement =
				(event.target as any).parentNode || (event.target as any)
			if (target.classList.contains('searchbox-item')) return

			if (
				(isInputFocused || showHistoryPortal) &&
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setIsInputFocused(false)
				setShowHistoryPortal(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [isInputFocused, showHistoryPortal])

	const onSearchButtonClick = () => {
		const query = searchQuery.trim()
		if (query.trim()) {
			SearchHandler({ content: query.trim(), engine: selectedEngine })
			Analytics.event('search_button_submitted')
		}
	}

	function onFocusInput() {
		setIsInputFocused(true)
		setShowHistoryPortal(true)
		Analytics.event('search_input_focused')
	}

	return (
		<div className="relative flex flex-col items-center justify-start h-24 max-h-24">
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
							'relative flex items-center py-2 px-3 overflow-hidden shadow-xs transition-all duration-300 bg-content group rounded-2xl'
						}
					>
						<EngineSelector onSelected={onEngineChange} />

						<input
							ref={inputRef}
							type="text"
							name="search"
							onChange={handleSearchInputChange}
							onFocus={() => onFocusInput()}
							className={
								'w-full py-1.5 text-base font-light text-right focus:outline-none text-content placeholder:text-base-content/60 placeholder:font-medium focus:placeholder:opacity-50 bg-transparent'
							}
							placeholder={`جستجو در ${selectedEngine.label}`}
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
							className={`${searchQuery ? 'opacity-0 hidden' : 'flex'} items-center gap-0.5 ml-1 transition-all duration-300 `}
						>
							<ImageSearchButton onClick={() => setActivePortal('image')} />
							<VoiceSearchButton onClick={() => setActivePortal('voice')} />
						</div>
						<div
							className={`${searchQuery ? 'flex' : 'opacity-0 hidden'} h-9 w-9 shrink-0 flex items-center justify-center rounded-full cursor-pointer  hover:bg-base-300`}
							onClick={() => onSearchButtonClick()}
						>
							<MdOutlineSearch size={20} className="opacity-50" />
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
						searchQuery={searchQuery}
					/>
				)}

				<BrowserBookmark />
			</div>
		</div>
	)
}

function SearchHandler({ content, engine }: { content: string; engine: EngineMeta }) {
	if (engine.id === 'google') {
		browser.search.query({
			text: content,
			disposition: browser.search.Disposition.CURRENT_TAB,
		})
	} else {
		window.open(engine.prefix + encodeURIComponent(content), '_self')
	}
}
