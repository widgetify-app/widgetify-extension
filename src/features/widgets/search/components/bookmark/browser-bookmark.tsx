import { useCallback, useEffect, useRef, useState } from 'react'
import Analytics from '@/analytics'
import { getFaviconFromUrl } from '@/features/widgets/utils/icon'
import { NewBadge, Tooltip } from '@/components/ui'
import { Page, usePage } from '@/context/page.context'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import { useGetSearchboxData } from '@/services/trends/get-trends.hook'
import { BookmarkPopover } from './bookmark-popover'

const POPOVER_WIDTH = 288

const SEARCH_CHIP_CLASS =
	'inline-flex items-center gap-1.25 h-6.5 px-2.5 rounded-lg text-2xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-ui focus-visible:focus-ring'

export function BrowserBookmark() {
	const { data: searchboxData } = useGetSearchboxData({ enabled: true })
	const { setPage } = usePage()

	const [isOpen, setIsOpen] = useState(false)
	const [popoverCoords, setPopoverCoords] = useState({ top: 0, left: 0 })
	const iconRef = useRef<HTMLDivElement>(null)

	const updateCoords = useCallback(() => {
		if (!iconRef.current) return

		const rect = iconRef.current.getBoundingClientRect()
		const padding = 10
		const left = Math.max(
			padding,
			Math.min(rect.left, window.innerWidth - POPOVER_WIDTH - padding)
		)

		setPopoverCoords({ top: rect.bottom + 8, left })
	}, [])

	useEffect(() => {
		if (!isOpen) return

		updateCoords()
		const handleUpdate = () => requestAnimationFrame(updateCoords)
		window.addEventListener('resize', handleUpdate)
		window.addEventListener('scroll', handleUpdate, true)
		return () => {
			window.removeEventListener('resize', handleUpdate)
			window.removeEventListener('scroll', handleUpdate, true)
		}
	}, [isOpen, updateCoords])

	const handleTogglePopover = () => {
		updateCoords()
		setIsOpen((prev) => !prev)
		Analytics.event('browser_bookmark_popover_toggled')
	}

	const onClickToExplorer = () => {
		setPage(Page.Explorer)
		Analytics.event('searchbox_explorer_page_opened')
	}

	return (
		<div className="relative flex items-center w-full gap-1.5 overflow-x-auto h-6.5 shrink-0 scrollbar-none">
			<button
				type="button"
				onClick={onClickToExplorer}
				className={cn(
					SEARCH_CHIP_CLASS,
					'relative bg-fill text-fg-muted hover:bg-fill-2'
				)}
			>
				<Icon name="explorerOutline" size={14} aria-hidden="true" />
				کاوش
				{searchboxData?.explorer?.newBadge && (
					<NewBadge className="top-0 left-0" />
				)}
			</button>

			<div ref={iconRef} className="shrink-0">
				<button
					type="button"
					onClick={handleTogglePopover}
					aria-expanded={isOpen}
					className={cn(
						SEARCH_CHIP_CLASS,
						isOpen
							? 'bg-brand-fill text-brand'
							: 'bg-fill text-fg-muted hover:bg-fill-2'
					)}
				>
					<Icon name="folderSpecial" size={14} aria-hidden="true" />
					بوکمارک‌های مرورگر
					<Icon name="chevronDown" size={12} aria-hidden="true" />
				</button>
			</div>

			{!!searchboxData?.recommendedSites?.length && (
				<span aria-hidden="true" className="w-px h-3.5 mx-0.5 bg-line shrink-0" />
			)}

			<ul className="flex items-center gap-1.5 shrink-0">
				{searchboxData?.recommendedSites?.map((item) => (
					<li key={item.url}>
						<Tooltip content={item.name || item.title || ''}>
							<a
								href={item.url || '#'}
								target="_blank"
								rel="noreferrer"
								aria-label={item.name || item.title || item.url || ''}
								className="grid overflow-hidden rounded-lg size-6 place-items-center bg-fill transition-ui hover:bg-fill-2 focus-visible:focus-ring"
							>
								<img
									src={item.icon || getFaviconFromUrl(item.url || '')}
									className="object-cover size-4"
									alt=""
									loading="lazy"
								/>
							</a>
						</Tooltip>
					</li>
				))}
			</ul>

			<BookmarkPopover
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				coords={popoverCoords}
			/>
		</div>
	)
}
