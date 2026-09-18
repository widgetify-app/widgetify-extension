import { useCallback, useEffect, useRef, useState } from 'react'
import Analytics from '@/analytics'
import { getFaviconFromUrl } from '@/common/utils/icon'
import { NewBadge, Tooltip } from '@/components/ui'
import { Page, usePage } from '@/context/page.context'
import { Icon } from '@/icons'
import { useGetSearchboxData } from '@/services/hooks/trends/get-trends.hook'
import { BookmarkPopover } from './bookmark-popover'

const POPOVER_WIDTH = 288

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
		<div className="relative flex flex-row items-center justify-start w-full gap-2 px-2 py-0.5">
			<div className="flex flex-row items-center w-full gap-1 py-0.5 overflow-x-auto scrollbar-none scroll-smooth">
				<div className="flex items-center shrink-0">
					<button
						type="button"
						className="flex items-center p-0 bg-transparent border-none cursor-pointer group"
						onClick={onClickToExplorer}
					>
						<div className="relative flex items-center justify-center w-fit px-1.5 gap-1 h-6 p-0.5 rounded-xl bg-raised group-hover:scale-95 transition-transform">
							<Icon
								name="globe"
								size={14}
								className="text-muted"
								aria-hidden="true"
							/>
							<p className="font-medium text-muted">کاوش</p>
							{searchboxData?.explorer?.newBadge && (
								<NewBadge className="top-0 left-0" />
							)}
						</div>
					</button>
				</div>

				<div ref={iconRef} className="flex items-center justify-center shrink-0">
					<button
						type="button"
						className="flex items-center p-0 bg-transparent border-none cursor-pointer group"
						onClick={handleTogglePopover}
						aria-expanded={isOpen}
					>
						<div
							className={`relative flex items-center justify-center w-fit px-1.5 gap-1 h-6 p-0.5 rounded-xl group-hover:scale-95 transition-transform ${
								isOpen
									? 'bg-primary text-primary-content shadow-lg'
									: 'bg-raised text-muted'
							}`}
						>
							<Icon name="folderSpecial" size={14} aria-hidden="true" />
							<p className="font-medium">بوکمارک مرورگر</p>
						</div>
					</button>
				</div>

				<div
					aria-hidden="true"
					className="self-center w-px h-4 mx-1 bg-raised shrink-0"
				/>

				<div className="flex flex-row items-center gap-1 flex-nowrap">
					{searchboxData?.recommendedSites?.map((item) => (
						<div
							key={item.url}
							className="flex items-center justify-center shrink-0"
						>
							<Tooltip content={item.name || item.title || ''}>
								<a
									href={item.url || '#'}
									target="_blank"
									rel="noreferrer"
									className="flex items-center cursor-pointer group"
								>
									<img
										src={
											item.icon || getFaviconFromUrl(item.url || '')
										}
										className="object-cover w-6 h-6 p-1 transition-transform rounded-full group-hover:scale-95 bg-raised"
										alt={item.name || item.title || ''}
										loading="lazy"
									/>
								</a>
							</Tooltip>
						</div>
					))}
				</div>
			</div>

			<BookmarkPopover
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				coords={popoverCoords}
			/>
		</div>
	)
}
