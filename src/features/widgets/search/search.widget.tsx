import { useEffect, useRef, useState } from 'react'
import Analytics from '@/analytics'
import { cn } from '@/common/utils/cn'
import { useAuth } from '@/context/auth.context'
import type { EngineMeta } from '@/services/trends/get-trends.hook'
import type { WidgetSize } from '../utils/layout-engine/types'
import { BrowserBookmark } from './components/bookmark/browser-bookmark'
import { EngineSelector } from './components/engine-selector'
import { ImageSearchButton } from './components/image/image-search-button'
import { ImageSearchPortal } from './components/image/image-search-portal'
import { SearchHistoryPortal } from './components/search-history-portal'
import { VoiceSearchButton } from './components/voice/voice-search-button'
import { VoiceSearchPortal } from './components/voice/voice-search-portal'
import { DEFAULT_ENGINE } from './constants'
import { usePortalAnchor } from './hooks/use-portal-anchor'
import { useSearchHistory } from './hooks/use-search-history'
import { runSearch } from './utils/run-search'
import { WidgetContainer } from '../components/widget-container'
import { WidgetMenuButton } from '../components/widget-menu-button'
import {
	SEARCH_BOX_CLASS,
	SEARCH_INPUT_CLASS,
	SearchBoxButton,
} from './components/search-box-parts'
import { SearchCompactRow } from './variants/search-2x1'

interface SearchLayoutProps {
	size?: WidgetSize
}

function SearchFullContent() {
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedEngine, setSelectedEngine] = useState<EngineMeta>(DEFAULT_ENGINE)
	const [showHistoryPortal, setShowHistoryPortal] = useState(false)
	const [selectedIndex, setSelectedIndex] = useState(-1)
	const [currentSuggestions, setCurrentSuggestions] = useState<
		{ text: string; isRecent: boolean }[]
	>([])
	const [activePortal, setActivePortal] = useState<'voice' | 'image' | null>(null)
	const searchRef = useRef<HTMLDivElement>(null)
	const searchRowRef = useRef<HTMLDivElement>(null)
	const portalRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const { user } = useAuth()
	const { addSearch } = useSearchHistory()

	const isHistoryOpen = showHistoryPortal && !activePortal

	const { style: historyStyles, updatePosition: updateHistoryPosition } =
		usePortalAnchor(searchRowRef, isHistoryOpen, 4)
	const { style: toolStyles } = usePortalAnchor(searchRef, Boolean(activePortal), 8)

	const submitQuery = (rawQuery: string, event: string) => {
		const query = rawQuery.trim()
		if (!query) return

		if (user?.searchAutocompleteEnabled) addSearch(query)
		runSearch(query, selectedEngine)
		Analytics.event(event)
		setShowHistoryPortal(false)
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const targetQuery =
			selectedIndex >= 0 && currentSuggestions[selectedIndex]
				? currentSuggestions[selectedIndex].text
				: searchQuery
		submitQuery(targetQuery, 'search_query_submitted')
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Escape') {
			setShowHistoryPortal(false)
			setSelectedIndex(-1)
			return
		}

		if (!isHistoryOpen || currentSuggestions.length === 0) return

		if (e.key === 'ArrowDown') {
			e.preventDefault()
			setSelectedIndex((prev) =>
				prev < currentSuggestions.length - 1 ? prev + 1 : -1
			)
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			setSelectedIndex((prev) =>
				prev > -1 ? prev - 1 : currentSuggestions.length - 1
			)
		}
	}

	const handleClearSearch = () => {
		setSearchQuery('')
		setSelectedIndex(-1)
		inputRef.current?.focus()
	}

	const handleSearchButtonClick = () => {
		if (!searchQuery.trim()) {
			inputRef.current?.focus()
			return
		}

		submitQuery(searchQuery, 'search_button_submitted')
	}

	const handleVoiceSearch = (query: string) => {
		submitQuery(query, 'voice_search_submitted')
	}

	const handleHistorySearch = (query: string) => {
		setSearchQuery(query)
		submitQuery(query, 'history_search_submitted')
	}

	const onEngineSelected = (engine: EngineMeta) => {
		setSelectedEngine(engine)
	}

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement
			if (!target) return

			if (
				target.closest('[popover]') ||
				target.closest('.modal') ||
				target.closest('[role="dialog"]')
			) {
				return
			}

			if (portalRef?.current?.contains(target)) {
				return
			}

			if (
				(showHistoryPortal || activePortal) &&
				searchRef?.current &&
				!searchRef?.current?.contains(target)
			) {
				setShowHistoryPortal(false)
				setActivePortal(null)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [showHistoryPortal, activePortal])

	return (
		<div
			ref={searchRef}
			className="relative flex flex-col justify-center h-full gap-1.5"
		>
			<form onSubmit={handleSubmit}>
				<div ref={searchRowRef} className={cn(SEARCH_BOX_CLASS, 'bg-fill')}>
					<EngineSelector onSelected={onEngineSelected} />

					<input
						ref={inputRef}
						type="text"
						name="search"
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value)
							setSelectedIndex(-1)
						}}
						onKeyDown={handleKeyDown}
						onFocus={() => {
							setShowHistoryPortal(true)
							Analytics.event('search_input_focused')
							updateHistoryPosition()
						}}
						className={SEARCH_INPUT_CLASS}
						placeholder={`جستجو در ${selectedEngine.label}`}
						aria-label={`جستجو در ${selectedEngine.label}`}
						autoComplete="off"
					/>

					{searchQuery ? (
						<>
							<SearchBoxButton
								label="پاک کردن متن"
								icon="close"
								onClick={handleClearSearch}
							/>
							<SearchBoxButton
								label="جستجو"
								icon="search"
								onClick={handleSearchButtonClick}
								isActive
							/>
						</>
					) : (
						<>
							<ImageSearchButton onClick={() => setActivePortal('image')} />
							<VoiceSearchButton onClick={() => setActivePortal('voice')} />
						</>
					)}
				</div>
			</form>

			{activePortal === 'voice' && (
				<VoiceSearchPortal
					portalRef={portalRef}
					portalStyles={toolStyles}
					onClose={() => setActivePortal(null)}
					onSearch={handleVoiceSearch}
				/>
			)}

			{activePortal === 'image' && (
				<ImageSearchPortal
					portalRef={portalRef}
					portalStyles={toolStyles}
					onClose={() => setActivePortal(null)}
				/>
			)}

			<SearchHistoryPortal
				isOpen={isHistoryOpen}
				portalRef={portalRef}
				onSearch={handleHistorySearch}
				searchQuery={searchQuery}
				portalStyles={historyStyles}
				selectedIndex={selectedIndex}
				onSuggestionsChange={setCurrentSuggestions}
			/>

			<div className="flex items-center gap-1.5">
				<div className="flex-1 min-w-0">
					<BrowserBookmark />
				</div>
				<span className="widget-control shrink-0">
					<WidgetMenuButton placement="compact" />
				</span>
			</div>
		</div>
	)
}

export function SearchLayout({ size }: SearchLayoutProps = {}) {
	if (size && size.w <= 2) {
		return (
			<WidgetContainer background={false} contentClassName="justify-center">
				<SearchCompactRow />
				<WidgetMenuButton placement="corner" />
			</WidgetContainer>
		)
	}

	return (
		<WidgetContainer contentClassName="p-2">
			<SearchFullContent />
		</WidgetContainer>
	)
}
