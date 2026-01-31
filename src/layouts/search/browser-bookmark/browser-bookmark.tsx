import { useState, useRef, useEffect } from 'react'
import { useGetTrends } from '@/services/hooks/trends/getTrends'
import { setToStorage } from '@/common/storage'
import { getFaviconFromUrl } from '@/common/utils/icon'
import Tooltip from '@/components/toolTip'
import { HiRectangleGroup } from 'react-icons/hi2'
import { MdFolderSpecial } from 'react-icons/md'
import { BookmarkPopover } from './bookmark-popover'
import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { usePage } from '@/context/page.context'

export function BrowserBookmark() {
	const { data } = useGetTrends({ enabled: true })
	const { setPage } = usePage()

	const [isOpen, setIsOpen] = useState(false)
	const [popoverCoords, setPopoverCoords] = useState({ top: 0, left: 0 })
	const iconRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (data?.recommendedSites?.length) {
			setToStorage('recommended_sites', data.recommendedSites)
		}
	}, [data])

	const handleTogglePopover = () => {
		if (iconRef.current) {
			const rect = iconRef.current.getBoundingClientRect()
			setPopoverCoords({
				top: rect.bottom + 10,
				left: rect.left,
			})
		}

		Analytics.event('browser_bookmark_popover_toggled')

		setIsOpen((prev) => !prev)
	}

	const onClickToExplorer = () => {
		setPage('explorer')
		Analytics.event('searchbox_explorer_page_opened')
	}

	return (
		<div className="flex flex-row items-center justify-start w-full gap-2 px-2 py-1 overflow-hidden min-h-[40px]">
			<div className="flex flex-row items-center w-full gap-1 py-1 overflow-x-auto flex-nowrap no-scrollbar scroll-smooth">
				<div className="flex items-center justify-center shrink-0">
					<Tooltip content="کاووش">
						<div
							className="flex items-center cursor-pointer group"
							onClick={() => onClickToExplorer()}
						>
							<div className="flex items-center justify-center w-6 h-6 p-0.5 transition-transform duration-200 rounded-lg group-hover:scale-110 bg-primary/10">
								<HiRectangleGroup
									size={20}
									className="text-base-content/60 hover:text-primary/80"
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

				<div className="self-center w-[1px] h-4 bg-base-content/10 shrink-0 mx-1" />

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
