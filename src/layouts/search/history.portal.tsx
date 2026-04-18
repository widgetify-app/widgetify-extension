import { useEffect } from 'react'
import { EngineSelector } from './enginge-selector'
import { Button } from '@/components/button/button'
import { FaSearch } from 'react-icons/fa'

interface SearchHistoryPortalProps {
	onClose: () => void
	onSearch: (query: string) => void
	onEngineChange: any
}

export function SearchHistoryPortal({
	onClose,
	onEngineChange,
}: SearchHistoryPortalProps) {
	const portalRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement

			if (target.closest('.engine-selector')) {
				return
			}

			if (portalRef.current && !portalRef.current.contains(event.target as Node)) {
				onClose()
			}
		}

		const timer = setTimeout(() => {
			document.addEventListener('mousedown', handleClickOutside)
		}, 100)

		return () => {
			clearTimeout(timer)
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [onClose])

	return (
		<div
			ref={portalRef}
			className="absolute left-0 w-full mt-1 overflow-hidden duration-300 shadow-2xl top-full z-60 bg-content bg-glass rounded-2xl animate-in fade-in"
		>
			{/* <div className="flex items-center justify-between px-2 pt-2 pb-3">
				<div className="flex items-center gap-3">
					<div className="flex gap-1 p-1 rounded-lg bg-base-content/5">
						<button
							onClick={() => setActiveTab('history')}
							className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
								activeTab === 'history'
									? 'bg-content text-base-content shadow-sm'
									: 'text-base-content/60 hover:text-base-content'
							}`}
						>
							<div className="flex items-center gap-1.5">
								<MdHistory size={14} />
								<span>تاریخچه</span>
							</div>
						</button>
						<button
							onClick={() => setActiveTab('trending')}
							className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
								activeTab === 'trending'
									? 'bg-content text-base-content shadow-sm'
									: 'text-base-content/60 hover:text-base-content'
							}`}
						>
							<div className="flex items-center gap-1.5">
								<MdTrendingUp size={14} />
								<span>پرطرفدار</span>
							</div>
						</button>
					</div>
				</div>
				<button
					onClick={onClose}
					className="p-2 transition-colors rounded-full cursor-pointer hover:bg-base-content/5 text-base-content/60"
				>
					<MdClose size={20} />
				</button>
			</div>

			<div className="px-5 pb-4 overflow-y-auto max-h-75 scrollbar-thin">
				{activeTab === 'history' ? (
					<div className="space-y-1">
						{searchHistory.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-8 text-center">
								<MdHistory
									size={40}
									className="mb-3 text-base-content/20"
								/>
								<p className="text-sm font-medium text-base-content/40">
									هنوز جستجویی انجام نداده‌اید
								</p>
							</div>
						) : (
							<>
								{searchHistory.slice(0, 10).map((item) => (
									<div
										key={item.id}
										className="group flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-base-content/5 transition-colors"
									>
										<button
											onClick={() => handleSearchClick(item.query)}
											className="flex items-center flex-1 gap-2 text-right cursor-pointer"
										>
											<MdHistory
												size={16}
												className="text-base-content/40"
											/>
											<span className="text-sm font-medium text-base-content/80">
												{item.query}
											</span>
										</button>
										<button
											onClick={() =>
												handleDeleteHistoryItem(item.id)
											}
											className="opacity-0 cursor-pointer group-hover:opacity-100 p-1.5 hover:bg-base-content/10 rounded-md transition-all"
										>
											<MdDelete
												size={16}
												className="text-base-content/50"
											/>
										</button>
									</div>
								))}
								{searchHistory.length > 0 && (
									<button
										onClick={handleClearHistory}
										className="w-full px-3 py-2 mt-2 text-xs font-medium transition-colors rounded-lg cursor-pointer text-error/80 hover:bg-error/5"
									>
										پاک کردن تاریخچه
									</button>
								)}
							</>
						)}
					</div>
				) : (
					<div className="space-y-1">
						{trendingSearches.map((query, index) => (
							<button
								key={index}
								onClick={() => handleSearchClick(query)}
								className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-base-content/5 transition-colors text-right cursor-pointer"
							>
								<MdTrendingUp size={16} className="text-primary/60" />
								<span className="text-sm font-medium text-base-content/80">
									{query}
								</span>
							</button>
						))}
					</div>
				)}
			</div> */}

			<div className="px-5 py-3 border-t border-base-content/5 bg-base-content/2">
				<div className="flex items-center justify-between">
					<EngineSelector
						trigger={
							<Button
								size="xs"
								className="flex items-center btn btn-ghost rounded-xl text-muted"
							>
								<FaSearch size={12} />
								انتخاب موتور جستجو
							</Button>
						}
						onSelected={onEngineChange}
					/>
				</div>
			</div>
		</div>
	)
}
