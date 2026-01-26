import { useGetContents } from '@/services/hooks/content/get-content.hook'
import { useRef, useState, useEffect } from 'react'
import Analytics from '@/analytics'
import { useTheme } from '@/context/theme.context'
import { useAppearanceSetting } from '@/context/appearance.context'
import { RenderContentIframe } from './components/content-iframe'
import { RenderContentSite } from './components/content-site'
import type { CategoryItem } from './interfaces/category.interface'
import { RenderContentBanner } from './components/content-banner'

export function ExplorerContent() {
	const { theme } = useTheme()
	const { fontFamily } = useAppearanceSetting()
	const { data: catalogData } = useGetContents()
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

	return (
		<div className="flex flex-row w-full h-screen overflow-hidden">
			<aside className="flex-col items-center hidden w-20 gap-3 py-4 md:flex bg-white/2 backdrop-blur-sm border border-white/8 rounded-3xl lg:mt-4  h-fit max-h-[calc(100vh-200px)] sticky top-4">
				<div className="flex flex-col items-center w-full gap-2 px-2 py-2 overflow-x-hidden overflow-y-auto scrollbar-none">
					{catalogData?.contents?.map((cat: CategoryItem) => (
						<div
							key={cat.id}
							onClick={() => scrollToCategory(cat.id)}
							className={`relative group flex flex-col items-center justify-center w-14 min-h-14 max-h-14 rounded-3xl transition-all duration-500 cursor-pointer border ${
								activeCategory === cat.id
									? 'bg-primary text-white shadow-md shadow-primary/40 scale-110 border-primary/50'
									: 'bg-white/3 border-white/5 text-base-content/60 hover:bg-primary/10 hover:text-primary hover:scale-105 hover:border-primary/30'
							}`}
						>
							<div
								className={`absolute w-1 h-8 rounded-r-full -left-2 bg-primary transition-all duration-500 ${activeCategory === cat.id ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}`}
							/>
							{cat.icon ? (
								<img
									src={cat.icon}
									className={`w-7 h-7 object-contain transition-transform ${
										activeCategory === cat.id
											? 'scale-110'
											: 'opacity-70 group-hover:opacity-100'
									}`}
									alt=""
								/>
							) : (
								<div
									className={`w-7 h-7 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
										activeCategory === cat.id
											? 'bg-white/20'
											: 'bg-base-content/10 group-hover:bg-base-content/20'
									}`}
								>
									{cat.category.substring(0, 1)}
								</div>
							)}
						</div>
					))}
				</div>
			</aside>

			<div className="flex flex-col w-full h-full gap-3 px-2 py-3 overflow-hidden md:px-10">
				<div className="md:hidden sticky top-0 z-50 flex items-center w-full gap-2 p-1.5 overflow-x-auto bg-base-100/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg no-scrollbar flex-nowrap">
					{catalogData?.contents?.map((cat: CategoryItem) => (
						<button
							key={cat.id}
							onClick={() => scrollToCategory(cat.id)}
							className={`flex items-center gap-2 px-4 py-2 text-[10px] font-bold whitespace-nowrap rounded-xl transition-all shrink-0 ${
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

				<div className="grid w-full h-full grid-cols-1 gap-6 overflow-hidden lg:grid-cols-1">
					<div className="flex flex-col h-full gap-4 overflow-hidden lg:col-span-1">
						<div
							ref={scrollContainerRef}
							className="flex-1 pb-10 pr-1 overflow-y-auto scrollbar-none scroll-smooth"
						>
							<div className="grid max-w-5xl grid-cols-1 gap-2 pb-[50vh] mx-auto md:grid-cols-3">
								{catalogData?.contents?.map(
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
													: (
																index ===
																	catalogData.contents
																		.length -
																		1 &&
																	catalogData.contents
																		.length %
																		2 ===
																		0
															)
														? 'md:col-span-2'
														: 'md:col-span-1'
											}`}
										>
											{category.banner && (
												<div className="w-full h-16 overflow-hidden">
													<img
														src={category.banner}
														className="object-cover w-full h-full"
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
																	src={category.icon}
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
