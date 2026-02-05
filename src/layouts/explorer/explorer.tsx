import { useGetContents } from '@/services/hooks/content/get-content.hook'
import { useRef, useState, useEffect } from 'react'
import Analytics from '@/analytics'
import { useTheme } from '@/context/theme.context'
import { useAppearanceSetting } from '@/context/appearance.context'
import { RenderContentIframe } from './components/content-iframe'
import { RenderContentSite } from './components/content-site'
import type { CategoryItem } from './interfaces/category.interface'
import { RenderContentBanner } from './components/content-banner'
import { TabNavigation } from '@/components/tab-navigation'

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
	const { theme } = useTheme()
	const { fontFamily } = useAppearanceSetting()
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
											<div
												key={category.id}
												id={category.id}
												ref={(el) => {
													categoryRefs.current[category.id] = el
												}}
												style={{
													gridColumn: category.span?.col
														? `span ${category.span.col} / span ${category.span.col}`
														: undefined,
													gridRow: category.span?.row
														? `span ${category.span.row} / span ${category.span.row}`
														: undefined,
												}}
												className={`relative overflow-hidden border scroll-mt-4 bg-content bg-glass border-base-300 rounded-2xl transition-all duration-300 ${
													index === 0
														? 'md:col-span-2'
														: index === contents.length - 1 &&
																contents.length % 2 === 0
															? 'md:col-span-2'
															: 'md:col-span-1'
												}
												${category.id === activeCategory && 'outline-2 outline-offset-1 outline-primary/80'}
												`}
											>
												{category.banner && (
													<div className="w-full overflow-hidden h-14">
														<img
															src={category.banner}
															className="object-cover w-full h-full filter brightness-75 contrast-110"
															style={{
																maskImage:
																	'linear-gradient(to bottom, black 0%, transparent 100%)',
																WebkitMaskImage:
																	'linear-gradient(to bottom, black 0%, transparent 100%)',
															}}
															alt=""
														/>
													</div>
												)}
												<div className="p-4">
													{!category.hideName && (
														<div className="flex items-center gap-4 mb-4">
															<div className="flex items-center gap-2.5">
																{category.icon ? (
																	<img
																		src={
																			category.icon
																		}
																		className="w-4 h-4 opacity-70"
																		alt=""
																	/>
																) : (
																	<div className="w-1 h-3.5 rounded-full bg-primary" />
																)}
																<h3 className="text-xs font-black tracking-widest uppercase opacity-70">
																	{category.category}
																</h3>
															</div>
															<div className="flex-1 h-px bg-linear-to-r from-base-content/5 to-transparent" />
														</div>
													)}

													<HandleCatalogs
														category={category}
														theme={theme}
														fontFamily={fontFamily}
														colSpan={category.span?.col}
													/>
												</div>
											</div>
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

interface Prop {
	category: CategoryItem
	theme: string
	fontFamily: string
	colSpan?: number | null
}

function HandleCatalogs({ category, theme, fontFamily, colSpan }: Prop) {
	const colSpanValue = !colSpan || colSpan < 2 ? 4 : 7
	return (
		<div
			className="grid grid-cols-3 gap-y-6 gap-x-2"
			style={{
				gridTemplateColumns: `repeat(${colSpanValue}, minmax(0, 1fr))`,
			}}
		>
			{category.links?.map((link) =>
				link.type === 'REMOTE_IFRAME' ? (
					<RenderContentIframe
						key={link.url}
						link={link}
						theme={theme}
						fontFamily={fontFamily}
					/>
				) : link.type === 'SITE' ? (
					<RenderContentSite key={link.url} link={link} />
				) : link.type === 'BANNER' ? (
					<RenderContentBanner key={link.url} link={link} />
				) : null
			)}
		</div>
	)
}
