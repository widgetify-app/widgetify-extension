import { useGetContents } from '@/services/hooks/content/get-content.hook'
import { useRef, useState, useEffect } from 'react'
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
		<div className="flex flex-row w-full h-screen overflow-hidden">
			<aside className="flex-col items-center hidden w-24 gap-3 py-2 md:flex border-base-300 bg-content bg-glass lg:mt-3 rounded-t-2xl rounded-b-2xl h-[calc(100vh-10rem)]">
				<div className="flex flex-col items-center w-full gap-3 px-2 overflow-x-hidden overflow-y-auto scrollbar-none">
					{catalogData?.contents?.map((cat: CategoryItem) => (
						<button
							key={cat.id}
							onClick={() => scrollToCategory(cat.id)}
							className={`relative group flex flex-col items-center justify-center w-full py-3 px-2 rounded-2xl transition-all duration-300 cursor-pointer ${
								activeCategory === cat.id
									? 'bg-primary/80 text-white shadow-sm shadow-primary/20'
									: 'bg-base-200/60 hover:bg-base-300 text-base-content/70 hover:scale-102'
							}`}
						>
							{activeCategory === cat.id && (
								<div className="absolute w-1 h-10 rounded-r-full -left-2 bg-primary" />
							)}

							{cat.icon ? (
								<img
									src={cat.icon}
									className={`w-8 h-8 mb-2 object-contain transition-transform ${
										activeCategory === cat.id
											? 'scale-110'
											: 'opacity-70 group-hover:opacity-100'
									}`}
									alt=""
								/>
							) : (
								<div
									className={`w-8 h-8 mb-2 rounded-xl flex items-center justify-center text-lg font-bold transition-all ${
										activeCategory === cat.id
											? 'bg-white/20'
											: 'bg-base-content/10 group-hover:bg-base-content/20'
									}`}
								>
									{cat.category.substring(0, 1)}
								</div>
							)}

							<span
								className={`text-[9px] font-bold text-center leading-tight transition-all line-clamp-2 ${
									activeCategory === cat.id
										? 'opacity-100'
										: 'opacity-60 group-hover:opacity-90'
								}`}
							>
								{cat.category}
							</span>

							<div className="absolute z-50 px-3 py-2 ml-4 text-xs font-semibold transition-opacity rounded-lg shadow-xl opacity-0 pointer-events-none left-full bg-neutral text-neutral-content group-hover:opacity-100 whitespace-nowrap">
								{cat.category}
								<div className="absolute -translate-y-1/2 border-4 border-transparent right-full top-1/2 border-r-neutral" />
							</div>
						</button>
					))}
				</div>
			</aside>

			<div className="flex flex-col flex-1 w-full h-full gap-3 px-2 py-3 overflow-hidden md:px-6">
				<div className="md:hidden sticky top-0 z-50 flex items-center w-full gap-2 p-1.5 overflow-x-auto bg-base-100/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg no-scrollbar flex-nowrap">
					{catalogData?.contents?.map((cat: CategoryItem) => (
						<button
							key={cat.id}
							onClick={() => scrollToCategory(cat.id)}
							className={`flex items-center gap-2 px-4 py-2 text-[10px] font-bold whitespace-nowrap rounded-xl transition-all shrink-0 ${
								activeCategory === cat.id
									? 'bg-primary text-white shadow-md'
									: 'bg-base-200/50'
							}`}
						>
							{cat.icon && (
								<img src={cat.icon} className="w-4 h-4" alt="" />
							)}
							{cat.category}
						</button>
					))}
				</div>

				<div className="grid w-full h-full grid-cols-1 gap-6 overflow-hidden lg:grid-cols-12">
					<div className="flex flex-col h-full gap-4 overflow-hidden lg:col-span-8">
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
											className={`relative overflow-hidden border scroll-mt-2 bg-content bg-glass border-base-300 rounded-3xl transition-all duration-300 ${
												index % 3 === 0
													? 'md:col-span-2'
													: 'md:col-span-1'
											}`}
										>
											{category.banner && (
												<div className="w-full overflow-hidden h-28">
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

											<div className="p-5">
												<div className="flex items-center gap-4 mb-6">
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
														<h3 className="text-[10px] font-black tracking-widest uppercase opacity-40">
															{category.category}
														</h3>
													</div>
													<div className="flex-1 h-px bg-linear-to-r from-base-content/10 to-transparent" />
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
															className="flex flex-col items-center gap-3 group/item active:scale-95"
														>
															<div className="relative flex items-center justify-center w-12 h-12 transition-all duration-300 bg-base-200/40 rounded-2xl group-hover/item:bg-primary/10">
																{link.badge && (
																	<span
																		className="absolute -top-1 -right-1 z-20 px-1.5 py-0.5 rounded-lg text-[8px] font-black border border-white/10"
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
																	className="object-contain w-6 h-6 transition-transform rounded group-hover/item:scale-110 group-hover/item:brightness-125"
																	alt={link.name}
																/>
															</div>
															<span className="text-[10px] font-medium tracking-tighter text-center truncate w-full opacity-50 group-hover/item:opacity-100 transition-opacity">
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
				</div>
			</div>
		</div>
	)
}

function getUrl(url: string) {
	return url.startsWith('http') ? url : `https://${url}`
}
