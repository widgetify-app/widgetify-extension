import { useEffect, useRef, useState, useCallback } from 'react'
import Analytics from '@/analytics'
import { EngineSelector } from '../select-engine/engine-selector'
import { SearchHistoryPortal } from '../history.portal'
import { useDelayedUnmount } from '@/hooks/use-delayed-unmount'
import { MODAL_EXIT_MS } from '@/components/ui'
import type { EngineMeta } from '@/services/hooks/trends/get-trends'
import { useSearchHistory } from '../hooks/use-search-history'
import { useAuth } from '@/context/auth.context'
import { Icon } from '@/src/icons'

const DEFAULT_ENGINE: EngineMeta = {
	id: 'google',
	prefix: '',
	label: 'گوگل',
	icon: '',
}

export function SearchCompactRow() {
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedEngine, setSelectedEngine] = useState<EngineMeta>(DEFAULT_ENGINE)
	const [showHistoryPortal, setShowHistoryPortal] = useState(false)
	const shouldMountHistory = useDelayedUnmount(showHistoryPortal, MODAL_EXIT_MS)
	const searchRef = useRef<HTMLDivElement>(null)
	const portalRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const [portalStyles, setPortalStyles] = useState<React.CSSProperties>({})
	const { user } = useAuth()
	const { addSearch } = useSearchHistory()

	const updatePortalPosition = useCallback(() => {
		if (searchRef.current) {
			const rect = searchRef.current.getBoundingClientRect()
			const width = Math.min(Math.max(rect.width, 180), window.innerWidth - 32)
			const left = Math.min(
				Math.max(16, rect.right - width),
				window.innerWidth - width - 16
			)

			setPortalStyles({
				position: 'fixed',
				top: `${rect.bottom + 2}px`,
				left: `${left}px`,
				width: `${width}px`,
				zIndex: 100,
				marginTop: '0px',
				borderRadius: '1.5rem',
			})
		}
	}, [])

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const query = searchQuery.trim()
		if (query) {
			if (user?.searchAutocompleteEnabled) addSearch(query)

			SearchHandler({
				content: query,
				engine: selectedEngine,
			})

			Analytics.event('search_query_submitted_2x1')
			setShowHistoryPortal(false)
		}
	}

	const handleClearSearch = () => {
		setSearchQuery('')
		if (inputRef.current) {
			inputRef.current.value = ''
			inputRef.current.focus()
		}
	}

	const handleHistorySearch = (query: string) => {
		if (query.trim()) {
			if (user?.searchAutocompleteEnabled) addSearch(query.trim())
			SearchHandler({ content: query.trim(), engine: selectedEngine })
			Analytics.event('history_search_submitted')
			setShowHistoryPortal(false)
		}
	}

	const onEngineChange = (engine: EngineMeta) => {
		setSelectedEngine(engine)
	}

	useEffect(() => {
		if (showHistoryPortal) {
			updatePortalPosition()
			window.addEventListener('resize', updatePortalPosition)
			window.addEventListener('scroll', updatePortalPosition, true)
		}
		return () => {
			window.removeEventListener('resize', updatePortalPosition)
			window.removeEventListener('scroll', updatePortalPosition, true)
		}
	}, [showHistoryPortal, updatePortalPosition])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement
			if (!target) return

			if (
				document.documentElement.classList.contains('modal-isActive') ||
				document.querySelector('dialog[open]') ||
				target.closest('dialog') ||
				target.closest('.modal') ||
				target.closest('[role="dialog"]') ||
				target.closest('.modal-backdrop') ||
				target.closest('.searchbox-item') ||
				target.classList.contains('searchbox-item')
			) {
				return
			}

			if (portalRef?.current?.contains(target)) {
				return
			}

			if (
				showHistoryPortal &&
				searchRef?.current &&
				!searchRef?.current?.contains(target)
			) {
				setShowHistoryPortal(false)
			}
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setShowHistoryPortal(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [showHistoryPortal])

	return (
		<div className="flex items-center justify-center w-full h-full p-1 select-none">
			<div
				ref={searchRef}
				className="relative w-full p-0.5 bg-content bg-glass rounded-widget"
			>
				<form onSubmit={handleSubmit}>
					<div className="relative flex items-center py-1.5 px-2 overflow-hidden shadow-xs transition-all duration-300 bg-content rounded-2xl">
						<EngineSelector onSelected={onEngineChange} />

						<input
							ref={inputRef}
							type="text"
							name="search"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onFocus={() => {
								setShowHistoryPortal(true)
								updatePortalPosition()
								Analytics.event('search_input_focused_2x1')
							}}
							className="w-full py-1 px-1.5 text-xs font-light text-right focus:outline-none text-content placeholder:text-base-content/60 placeholder:font-medium bg-transparent"
							placeholder="جستجو..."
							autoComplete="off"
						/>

						{searchQuery ? (
							<button
								type="button"
								onClick={handleClearSearch}
								className="flex items-center justify-center w-6 h-6 transition-colors rounded-full cursor-pointer shrink-0 hover:bg-base-300"
							>
								<Icon name="close" size={14} className="opacity-50" />
							</button>
						) : (
							<button
								type="submit"
								className="flex items-center justify-center w-6 h-6 transition-colors rounded-full cursor-pointer shrink-0 hover:bg-base-300"
							>
								<Icon name="search" size={14} className="opacity-50" />
							</button>
						)}
					</div>
				</form>

				{shouldMountHistory && (
					<SearchHistoryPortal
						isOpen={showHistoryPortal}
						portalRef={portalRef}
						onClose={() => setShowHistoryPortal(false)}
						onSearch={handleHistorySearch}
						onEngineChange={onEngineChange}
						searchQuery={searchQuery}
						portalStyles={portalStyles}
					/>
				)}
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
