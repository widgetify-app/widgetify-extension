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
					className="flex flex-col gap-4 p-5 rounded-2xl bg-base-200/20"
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
	const categories = contents.filter((f) => !f.hideName)

	return (
		<div className="flex flex-row w-full h-screen overflow-hidden">
			<div className="flex flex-col w-full h-full gap-1 px-1 py-2 overflow-hidden">
				{isLoading ? (
					<div className="sticky top-0 z-50 flex items-center w-full gap-2 p-1 overflow-x-auto border bg-base-100/80 backdrop-blur-xl rounded-2xl border-white/10">
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className="w-24 skeleton h-9 shrink-0 rounded-xl opacity-30"
							></div>
						))}
					</div>
				) : (
					<div className="sticky top-0 z-50 px-2">
						<div className="sticky top-0 z-50 flex items-center w-full gap-2 p-1.5 overflow-x-auto bg-base-100/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg no-scrollbar flex-nowrap overflow-y-hidden">
							{categories.map((cat: CategoryItem) => (
								<button
									key={cat.id}
									onClick={() => scrollToCategory(cat.id)}
									className={`flex items-center gap-2 px-4 py-2 cursor-pointer text-[10px] font-bold whitespace-nowrap rounded-xl transition-all shrink-0 ${
										activeCategory === cat.id
											? 'bg-primary text-white shadow-md scale-105'
											: 'bg-base-200/50 hover:bg-primary/10 hover:text-primary'
									}`}
								>
									{cat.icon && (
										<img src={cat.icon} className="w-4 h-4" alt="" />
									)}
									{cat.category}
								</button>
							))}
						</div>
					</div>
				)}
				<div className="grid w-full h-full grid-cols-1 gap-6 overflow-hidden lg:grid-cols-1">
					<div className="flex flex-col h-full gap-4 overflow-hidden lg:col-span-1">
						<div
							ref={scrollContainerRef}
							className="flex-1 pb-10 pr-1 overflow-y-auto scrollbar-none scroll-smooth"
						>
							{isLoading ? (
								<ExplorerSkeleton />
							) : (
								<div className="grid  grid-cols-1 gap-2 pb-[50vh]  md:grid-cols-3 py-2  px-2">
									{contents.map(
										(category: CategoryItem, index: number) => (
											<ExplorerCategory
												activeCategory={activeCategory || ''}
												category={category}
												categoryRefs={categoryRefs}
												contentLength={contents.length}
												index={index}
												key={category.category || index}
											/>
										)
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
