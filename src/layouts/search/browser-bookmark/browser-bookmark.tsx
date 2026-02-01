import { useState, useRef, useEffect, useCallback } from 'react'
import { useGetTrends } from '@/services/hooks/trends/getTrends'
import { getFaviconFromUrl } from '@/common/utils/icon'
import Tooltip from '@/components/toolTip'
import { HiRectangleGroup } from 'react-icons/hi2'
import { MdFolderSpecial } from 'react-icons/md'
import { BookmarkPopover } from './bookmark-popover'
import { usePage } from '@/context/page.context'
import Analytics from '@/analytics'

export function BrowserBookmark() {
	const { data } = useGetTrends({ enabled: true })
	const { setPage } = usePage()

	const [isOpen, setIsOpen] = useState(false)
	const [popoverCoords, setPopoverCoords] = useState({ top: 0, left: 0 })
	const iconRef = useRef<HTMLDivElement>(null)

	const updateCoords = useCallback(() => {
		if (iconRef.current) {
			const rect = iconRef.current.getBoundingClientRect()
			const popoverWidth = 280
			const padding = 10

			let left = rect.left
			if (left + popoverWidth > window.innerWidth) {
				left = window.innerWidth - popoverWidth - padding
			}

			left = Math.max(padding, left)

			setPopoverCoords({
				top: rect.bottom + window.scrollY + 8,
				left: left,
			})
		}
	}, [])

	useEffect(() => {
		if (isOpen) {
			updateCoords()
			const handleUpdate = () => requestAnimationFrame(updateCoords)
			window.addEventListener('resize', handleUpdate)
			window.addEventListener('scroll', handleUpdate)
			return () => {
				window.removeEventListener('resize', handleUpdate)
				window.removeEventListener('scroll', handleUpdate)
			}
		}
	}, [isOpen, updateCoords])

	const handleTogglePopover = () => {
		updateCoords()
		setIsOpen((prev) => !prev)
		Analytics.event('browser_bookmark_popover_toggled')
	}

	const onClickToExplorer = () => {
		setPage('explorer')
		Analytics.event('searchbox_explorer_page_opened')
	}

	return (
		<div className="relative flex flex-row items-center justify-start w-full gap-2 px-2 py-1">
			<div className="flex flex-row items-center w-full gap-1 py-1 overflow-x-auto no-scrollbar scroll-smooth">
				<div className="flex items-center shrink-0">
					<Tooltip content="کاووش">
						<div
							className="flex items-center cursor-pointer group"
							onClick={() => onClickToExplorer()}
						>
							<div className="flex items-center justify-center w-6 h-6 p-0.5 rounded-lg bg-primary/10 group-hover:scale-110 transition-transform">
								<HiRectangleGroup
									size={20}
									className="text-base-content/60"
								/>
							</div>
						</div>
					</Tooltip>
				</div>

				<div ref={iconRef} className="flex items-center justify-center shrink-0">
					<Tooltip content="بوکمارک‌های مرورگر">
						<div
							className="flex items-center cursor-pointer group"
							onClick={handleTogglePopover}
						>
							<div
								className={`flex items-center justify-center w-6 h-6 p-0.5 transition-all duration-200 rounded-lg group-hover:scale-110 ${
									isOpen
										? 'bg-primary text-white shadow-lg'
										: 'bg-primary/10 text-base-content/60'
								}`}
							>
								<MdFolderSpecial size={24} />
							</div>
						</div>
					</Tooltip>
				</div>

				<div className="self-center w-px h-4 mx-1 bg-base-content/10 shrink-0" />

				<div className="flex flex-row items-center gap-1 flex-nowrap">
					{data?.recommendedSites?.map((item) => (
						<div
							key={item.url}
							className="flex items-center justify-center shrink-0"
						>
							<Tooltip content={item.name || item.title || ''}>
								<div
									className="flex items-center cursor-pointer group"
									onClick={() => window.open(item.url || '', '_blank')}
								>
									<img
										src={
											item.icon || getFaviconFromUrl(item.url || '')
										}
										className="object-cover w-6 h-6 p-1 transition-transform duration-200 rounded-lg group-hover:scale-110 bg-primary/10"
										alt={item.name}
									/>
								</div>
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
