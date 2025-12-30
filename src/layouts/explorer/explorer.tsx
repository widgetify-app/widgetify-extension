import { DateProvider } from '@/context/date.context'
import { useGetContents } from '@/services/hooks/content/get-content.hook'
import { useRef, useState, useEffect } from 'react'
import { NetworkLayout } from '../widgets/network/network.layout'
import { ToolsLayout } from '../widgets/tools/tools.layout'
import Analytics from '@/analytics'
import { getFaviconFromUrl } from '@/common/utils/icon'

interface LinkItem {
	name: string
	url: string
	icon?: string
	badge?: string
	badgeColor?: string
}

interface CategoryItem {
	id: string
	category: string
	banner?: string
	links: LinkItem[]
	icon?: string
}

export function ExplorerContent() {
	const { data: catalogData } = useGetContents()
	const [activeCategory, setActiveCategory] = useState<string | null>(null)
	const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
	const scrollContainerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const observerOptions = {
			root: scrollContainerRef.current,
			rootMargin: '-10% 0px -80% 0px',
			threshold: 0,
		}

		const observerCallback = (entries: IntersectionObserverEntry[]) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setActiveCategory(entry.target.id)
				}
			})
		}

		const observer = new IntersectionObserver(observerCallback, observerOptions)

		Object.values(categoryRefs.current).forEach((div) => {
			if (div) observer.observe(div)
		})

		return () => observer.disconnect()
	}, [catalogData])

	const scrollToCategory = (id: string) => {
		setActiveCategory(id)
		categoryRefs.current[id]?.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		})
		Analytics.event('explorer_click_category')
	}

	return (
		<div className="flex flex-col items-center flex-1 w-full h-screen gap-3 px-2 py-3 overflow-hidden md:px-6">
			<div className="grid w-full h-full grid-cols-1 gap-6 overflow-hidden lg:grid-cols-12">
				<div className="flex flex-col h-full gap-4 overflow-hidden lg:col-span-8">
					<div className="sticky top-0 z-10 flex items-center w-full gap-2 p-2 overflow-x-auto overflow-y-hidden shadow-sm bg-content bg-glass backdrop-blur-md h-14 rounded-2xl flex-nowrap scroll-smooth">
						{catalogData?.contents?.map((cat: CategoryItem) => (
							<button
								key={cat.id}
								onClick={() => scrollToCategory(cat.id)}
								className={`px-4 py-1.5 text-xs font-bold whitespace-nowrap rounded-xl transition-all duration-300 shrink-0 cursor-pointer ${
									activeCategory === cat.id
										? 'bg-primary text-white shadow-lg scale-105'
										: 'bg-base-200 hover:bg-base-300'
								}`}
							>
								{cat.category}
							</button>
						))}
					</div>

					<div
						ref={scrollContainerRef}
						className="flex-1 pb-10 pr-1 overflow-y-auto scrollbar-none scroll-smooth"
					>
						<div className="grid grid-cols-1 gap-4 pb-10 md:grid-cols-2">
							{catalogData?.contents?.map(
								(category: CategoryItem, index: number) => (
									<div
										key={category.id}
										id={category.id}
										ref={(el) => {
											categoryRefs.current[category.id] = el
										}}
										className={`relative overflow-hidden border scroll-mt-4 bg-content bg-glass border-base-300 rounded-2xl transition-all duration-300 ${
											index % 3 === 0
												? 'md:col-span-2'
												: 'md:col-span-1'
										}`}
									>
										{category.banner && (
											<div className="w-full overflow-hidden h-28">
												<img
													src={category.banner}
													className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105"
													style={{
														maskImage:
															'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.5) 70%, rgba(0, 0, 0, 0) 100%)',
														WebkitMaskImage:
															'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.5) 70%, rgba(0, 0, 0, 0) 100%)',
													}}
													alt=""
												/>
											</div>
										)}

										<div className="p-4">
											<div className="flex items-center gap-4 mb-6">
												<div className="flex items-center gap-2.5">
													{category.icon ? (
														<img
															src={category.icon}
															className="object-contain w-4 h-4 opacity-80"
															alt=""
														/>
													) : (
														<div className="w-1 h-3.5 rounded-full bg-primary/60 shrink-0" />
													)}
													<h3 className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40">
														{category.category}
													</h3>
												</div>
												<div className="flex-1 h-px bg-base-content/10" />
											</div>

											<div
												className={`grid gap-y-6 gap-x-2 ${
													index % 3 === 0
														? 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-8'
														: 'grid-cols-3 sm:grid-cols-4'
												}`}
											>
												{category.links?.map((link, idx) => (
													<a
														key={idx}
														href={getUrl(link.url)}
														target="_blank"
														rel="noopener noreferrer"
														className="flex flex-col items-center gap-3 transition-all duration-300 cursor-pointer group/item active:scale-95 hover:scale-105"
													>
														<div className="relative flex items-center justify-center w-12 h-12 transition-all duration-300 border border-content rounded-2xl group-hover/item:border-primary!">
															{link.badge && (
																<span
																	className="absolute -top-1.5 -right-1.5 z-20 px-1.5 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-tighter shadow-sm border border-white/10"
																	style={{
																		backgroundColor:
																			link.badgeColor ||
																			'var(--p)',
																		color: '#fff',
																	}}
																>
																	{link.badge}
																</span>
															)}
															<img
																src={
																	link.icon ||
																	getFaviconFromUrl(
																		link.url
																	)
																}
																className="object-contain w-6 h-6 transition-transform rounded-md group-hover/item:scale-110"
																alt={link.name}
																onError={(e) => {
																	e.currentTarget.src =
																		'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><text y="18" font-size="16">🌐</text></svg>'
																}}
															/>
														</div>
														<span className="text-[10px] font-bold tracking-tighter text-center truncate w-full opacity-50 group-hover/item:opacity-100 transition-opacity">
															{link.name}
														</span>
													</a>
												))}
											</div>
										</div>
									</div>
								)
							)}
						</div>
					</div>
				</div>

				<div className="h-full pb-4 space-y-4 lg:block lg:col-span-4">
					<div className="sticky space-y-4">
						<DateProvider>
							<ToolsLayout />
						</DateProvider>
						<NetworkLayout />
					</div>
				</div>
			</div>
		</div>
	)
}

function getUrl(url: string) {
	if (url.startsWith('http')) {
		return url
	} else {
		return `https://${url}`
	}
}
