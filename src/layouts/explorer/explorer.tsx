import { useGetContents } from '@/services/hooks/content/get-content.hook'
import { useRef, useState, useEffect } from 'react'
import Analytics from '@/analytics'
import type { CategoryItem } from './interfaces/category.interface'
import { ExplorerCategory } from './components/category'

function ExplorerSkeleton() {
	return (
		<div className="grid w-full max-w-5xl grid-cols-1 gap-4 mx-auto md:grid-cols-3">
			{[1, 2, 3, 4, 5, 6].map((i) => (
				<div
					key={i}
					className="flex flex-col gap-4 p-5 rounded-2xl bg-base-200/20 bg-content bg-glass"
				>
					<div className="flex items-center gap-3">
						<div className="w-5 h-5 rounded-md skeleton opacity-40"></div>
						<div className="h-3 skeleton w-28 opacity-40"></div>
					</div>
					<div className="grid grid-cols-4 gap-4 mt-2">
						{[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
							<div key={j} className="flex flex-col items-center gap-2">
								<div className="w-10 h-10 skeleton rounded-xl opacity-30"></div>
								<div className="skeleton h-1.5 w-full opacity-20"></div>
							</div>
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
	const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
	const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
	const scrollContainerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!catalogData?.contents || !scrollContainerRef.current) return

		const observerOptions = {
			root: scrollContainerRef.current,
			rootMargin: '0px 0px -40% 0px',
			threshold: 0.1,
		}

		const observerCallback = (entries: IntersectionObserverEntry[]) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setActiveCategory(entry.target.id)
					tabRefs.current[entry.target.id]?.scrollIntoView({
						behavior: 'smooth',
						inline: 'center',
						block: 'nearest',
					})
				}
			})
		}

		const observer = new IntersectionObserver(observerCallback, observerOptions)

		const currentRefs = categoryRefs.current
		Object.values(currentRefs).forEach((div) => {
			if (div) observer.observe(div)
		})

		return () => observer.disconnect()
	}, [catalogData?.contents])

	const scrollToCategory = (id: string) => {
		setActiveCategory(id)
		const tabBtn = tabRefs.current[id]
		if (tabBtn) {
			tabBtn.scrollIntoView({
				behavior: 'smooth',
				inline: 'center',
				block: 'nearest',
			})
		}
		const element = categoryRefs.current[id]
		if (element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		}
		Analytics.event('explorer_click_category')
	}

	const contents = catalogData?.contents || []
	const categories = contents.filter((f) => !f.hideName && f.links.length)

	return (
		<div className="flex flex-row w-full h-screen overflow-hidden ">
			<div className="flex flex-col w-full h-full gap-2 px-2 py-3 overflow-hidden">
				{isLoading ? (
					<div className="sticky top-0 z-50 flex items-center w-full max-w-6xl mx-auto gap-2 p-1.5 overflow-x-auto bg-base-100/70 backdrop-blur-xl rounded-2xl border border-base-200/80 shadow-sm scrollbar-none flex-nowrap">
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<div
								key={i}
								className="w-24 h-8 skeleton shrink-0 rounded-xl opacity-30"
							></div>
						))}
					</div>
				) : (
					<div className="sticky top-0 z-50 w-full max-w-6xl px-1 mx-auto">
						<div className="relative flex items-center">
							<div className="flex items-center w-full gap-1 p-1 overflow-x-auto border shadow-md bg-base-100/80 backdrop-blur-2xl rounded-2xl border-base-300/60 scrollbar-none flex-nowrap">
								{categories.map((cat: CategoryItem) => {
									const active = activeCategory === cat.id

									return (
										<button
											key={cat.id}
											ref={(el) => {
												tabRefs.current[cat.id] = el
											}}
											onClick={() => scrollToCategory(cat.id)}
											className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium whitespace-nowrap rounded-xl transition-all duration-200 shrink-0 cursor-pointer ${
												active
													? 'bg-base-200 text-content shadow-xs font-semibold'
													: 'text-muted hover:text-content hover:bg-base-200/50'
											}`}
										>
											{cat.icon && (
												<img
													src={cat.icon}
													className="object-contain w-4 h-4 shrink-0"
													alt=""
												/>
											)}

											<span>{cat.category}</span>
										</button>
									)
								})}
							</div>
						</div>
					</div>
				)}
				<div className="flex-1 w-full h-full overflow-hidden">
					<div
						ref={scrollContainerRef}
						className="h-full px-2 pb-16 overflow-y-auto scrollbar-none scroll-smooth"
					>
						{isLoading ? (
							<ExplorerSkeleton />
						) : (
							<div className="gap-3.5 columns-1 md:columns-2 lg:columns-3 max-w-6xl mx-auto py-2">
								{contents.map((category: CategoryItem) => (
									<ExplorerCategory
										activeCategory={activeCategory || ''}
										category={category}
										categoryRefs={categoryRefs}
										key={category.id}
									/>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
