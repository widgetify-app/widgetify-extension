import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { useGetContents } from '@/services/content/get-content.hook'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ExplorerCategory } from './components/category'
import { ExplorerPromoModal } from './components/promo-modal'
import { ExplorerPopoverMenu } from './components/explorer-popover-menu'
import type { CatalogItem, CategoryItem } from './types'

function ExplorerSkeleton() {
	return (
		<div className="flex flex-col gap-8 w-full max-w-5xl mx-auto py-2">
			{[1, 2, 3].map((i) => (
				<div key={i} className="flex flex-col gap-3">
					<div className="flex items-center gap-2.5 pb-3 border-b border-surface-3">
						<div className="w-8 h-8 rounded-xl skeleton" />
						<div className="h-4 w-32 skeleton rounded-lg" />
					</div>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[68px]">
						<div className="col-span-2 row-span-2 skeleton rounded-2xl" />
						{[1, 2, 3, 4, 5, 6].map((j) => (
							<div
								key={j}
								className="col-span-1 row-span-1 skeleton rounded-2xl"
							/>
						))}
					</div>
				</div>
			))}
		</div>
	)
}

export function ExplorerContent() {
	const { data: catalogData, isLoading } = useGetContents()
	const [activeCategory, setActiveCategory] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedPromoItem, setSelectedPromoItem] = useState<CatalogItem | null>(null)
	const [activePopover, setActivePopover] = useState<{
		item: CatalogItem
		position: { x: number; y: number } | null
	} | null>(null)
	const popoverTriggerRef = useRef<HTMLElement | null>(null)

	const handleItemAction = useCallback((item: CatalogItem, triggerEl?: HTMLElement) => {
		const meta = item.meta
		const isPopover =
			meta?.type === 'POPOVER_MENU' ||
			meta?.action === 'OPEN_POPOVER' ||
			Boolean(meta?.menuItems && meta.menuItems.length > 0)

		if (isPopover) {
			popoverTriggerRef.current = triggerEl || null
			const rect = triggerEl?.getBoundingClientRect()
			setActivePopover({
				item,
				position: rect ? { x: rect.left, y: rect.bottom + 6 } : null,
			})
		} else {
			setSelectedPromoItem(item)
		}
	}, [])

	const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({})
	const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
	const scrollContainerRef = useRef<HTMLDivElement>(null)
	const isManualScrollRef = useRef(false)
	const rafIdRef = useRef<number | null>(null)

	const contents = useMemo(() => {
		return catalogData?.contents || []
	}, [catalogData?.contents])

	const categories = useMemo(() => {
		return contents.filter((f) => f.links?.length)
	}, [contents])

	const filteredContents = useMemo(() => {
		if (!searchQuery.trim()) return contents
		const q = searchQuery.trim().toLowerCase()

		return contents
			.map((cat) => ({
				...cat,
				links: cat.links.filter(
					(link) =>
						link.name?.toLowerCase().includes(q) ||
						cat.category?.toLowerCase().includes(q) ||
						link.badge?.toLowerCase().includes(q)
				),
			}))
			.filter((cat) => cat.links.length > 0)
	}, [contents, searchQuery])

	useEffect(() => {
		if (categories.length > 0 && !activeCategory) {
			setActiveCategory(categories[0].id)
		}
	}, [categories, activeCategory])

	const updateActiveCategoryOnScroll = useCallback(() => {
		if (isManualScrollRef.current) return
		const container = scrollContainerRef.current
		if (!container) return

		const visibleCategories = categories.filter((c) =>
			filteredContents.some((fc) => fc.id === c.id)
		)
		if (visibleCategories.length === 0) return

		if (container.scrollTop < 40) {
			const firstCat = visibleCategories[0]
			if (activeCategory !== firstCat.id) {
				setActiveCategory(firstCat.id)
				tabRefs.current[firstCat.id]?.scrollIntoView({
					behavior: 'smooth',
					inline: 'center',
					block: 'nearest',
				})
			}
			return
		}

		const isAtBottom =
			container.scrollHeight - container.scrollTop - container.clientHeight < 50

		if (isAtBottom && visibleCategories.length > 0) {
			const lastCat = visibleCategories[visibleCategories.length - 1]
			if (activeCategory !== lastCat.id) {
				setActiveCategory(lastCat.id)
				tabRefs.current[lastCat.id]?.scrollIntoView({
					behavior: 'smooth',
					inline: 'center',
					block: 'nearest',
				})
			}
			return
		}

		const containerTop = container.getBoundingClientRect().top

		for (const cat of visibleCategories) {
			const el = categoryRefs.current[cat.id]
			if (!el) continue

			const rect = el.getBoundingClientRect()
			const relativeTop = rect.top - containerTop
			const relativeBottom = rect.bottom - containerTop

			if (relativeTop <= 110 && relativeBottom > 40) {
				if (activeCategory !== cat.id) {
					setActiveCategory(cat.id)
					tabRefs.current[cat.id]?.scrollIntoView({
						behavior: 'smooth',
						inline: 'center',
						block: 'nearest',
					})
				}
				break
			}
		}
	}, [activeCategory, categories, filteredContents])

	const handleScroll = () => {
		if (rafIdRef.current) {
			cancelAnimationFrame(rafIdRef.current)
		}
		rafIdRef.current = requestAnimationFrame(updateActiveCategoryOnScroll)
	}

	useEffect(() => {
		return () => {
			if (rafIdRef.current) {
				cancelAnimationFrame(rafIdRef.current)
			}
		}
	}, [])

	const scrollToCategory = (id: string) => {
		isManualScrollRef.current = true
		setActiveCategory(id)

		tabRefs.current[id]?.scrollIntoView({
			behavior: 'smooth',
			inline: 'center',
			block: 'nearest',
		})

		const element = categoryRefs.current[id]
		const container = scrollContainerRef.current

		if (element && container) {
			const containerRect = container.getBoundingClientRect()
			const elementRect = element.getBoundingClientRect()
			const targetScrollTop =
				container.scrollTop + (elementRect.top - containerRect.top) - 12

			container.scrollTo({
				top: targetScrollTop,
				behavior: 'smooth',
			})
		}

		setTimeout(() => {
			isManualScrollRef.current = false
		}, 600)

		Analytics.event('explorer_click_category')
	}

	return (
		<div className="relative z-10 w-full h-[calc(100vh-4.75rem)] max-w-270 mx-auto pt-2 px-3 sm:px-4 flex flex-col overflow-hidden">
			<div className="w-full h-full rounded-widget bg-glass-surface-2 border border-surface-3 overflow-hidden flex flex-col">
				<header className="shrink-0 w-full px-4 py-3 border-b border-surface-3 bg-surface backdrop-blur-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 z-30">
					<div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 flex-1">
						{categories.map((cat: CategoryItem) => {
							const active = activeCategory === cat.id

							return (
								<button
									type="button"
									key={cat.id}
									ref={(el) => {
										tabRefs.current[cat.id] = el
									}}
									onClick={() => scrollToCategory(cat.id)}
									className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold whitespace-nowrap rounded-xl transition-ui duration-200 shrink-0 cursor-pointer ${
										active
											? 'bg-brand-fill text-brand border border-brand-fill-2 shadow-sm font-bold'
											: 'text-fg-muted hover:text-fg-strong hover:bg-fill-2 border border-transparent'
									}`}
								>
									{cat.icon && (
										<img
											src={cat.icon}
											className="object-contain w-3.5 h-3.5 shrink-0"
											alt=""
										/>
									)}
									<span>{cat.category}</span>
								</button>
							)
						})}
					</div>

					<div className="relative w-full sm:w-64 shrink-0">
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder={t('explorer.search.placeholder')}
							className="w-full bg-surface-2 text-xs text-fg-strong placeholder-fg-faint px-3 py-2 rounded-xl border border-line focus:outline-none focus:border-brand-muted transition-ui pr-8 focus:placeholder:text-fg-ghost"
						/>
						<svg
							aria-hidden="true"
							className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-fg-faint pointer-events-none"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>

						{searchQuery && (
							<button
								type="button"
								onClick={() => setSearchQuery('')}
								className="absolute left-2.5 top-1/2 -translate-y-1/2 text-fg-faint hover:text-fg-strong text-xs p-0.5"
							>
								✕
							</button>
						)}
					</div>
				</header>

				<main
					ref={scrollContainerRef}
					onScroll={handleScroll}
					className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth scrollbar-none"
				>
					{isLoading ? (
						<ExplorerSkeleton />
					) : filteredContents.length === 0 ? (
						<div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
							<div className="text-4xl opacity-40">🔍</div>
							<p className="text-sm font-bold text-fg-strong">
								{t('explorer.search.noResults', { query: searchQuery })}
							</p>
							<p className="text-xs text-fg-faint">
								{t('explorer.search.tryAgain')}
							</p>
							<button
								type="button"
								onClick={() => setSearchQuery('')}
								className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-surface-2 hover:bg-surface-3 text-fg-strong transition-colors mt-2"
							>
								{t('explorer.search.clear')}
							</button>
						</div>
					) : (
						<div className="flex flex-col gap-6 max-w-5xl mx-auto">
							{filteredContents.map((category: CategoryItem) => (
								<ExplorerCategory
									category={category}
									categoryRefs={categoryRefs}
									key={category.id}
									onOpenPromoModal={handleItemAction}
								/>
							))}
						</div>
					)}
				</main>

				<ExplorerPromoModal
					item={selectedPromoItem}
					isOpen={!!selectedPromoItem}
					onClose={() => setSelectedPromoItem(null)}
				/>

				<ExplorerPopoverMenu
					item={activePopover?.item || null}
					isOpen={!!activePopover}
					onClose={() => {
						setActivePopover(null)
						popoverTriggerRef.current = null
					}}
					triggerRef={popoverTriggerRef}
					position={activePopover?.position}
				/>
			</div>
		</div>
	)
}
