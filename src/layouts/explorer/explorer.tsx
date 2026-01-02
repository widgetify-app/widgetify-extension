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
			<aside className="flex-col items-center hidden w-20 gap-3 py-4 md:flex bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-[2.5rem] lg:mt-4  h-fit max-h-[calc(100vh-160px)] sticky top-4">
				<div className="flex flex-col items-center w-full gap-2 px-2 py-2 overflow-x-hidden overflow-y-auto scrollbar-none">
					{catalogData?.contents?.map((cat: CategoryItem) => (
						<button
							key={cat.id}
							onClick={() => scrollToCategory(cat.id)}
							className={`relative group flex flex-col items-center justify-center w-14 min-h-14 max-h-14 rounded-[1.5rem] transition-all duration-500 cursor-pointer border ${
								activeCategory === cat.id
									? 'bg-primary text-white shadow-md shadow-primary/40 scale-110 border-primary/50'
									: 'bg-white/[0.03] border-white/5 text-base-content/60 hover:bg-primary/10 hover:text-primary hover:scale-105 hover:border-primary/30'
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
							<div className="absolute z-50 px-3 py-2 ml-4 text-xs font-semibold transition-opacity rounded-lg shadow-xl opacity-0 pointer-events-none left-full bg-neutral text-neutral-content group-hover:opacity-100 whitespace-nowrap">
								{cat.category}
								<div className="absolute -translate-y-1/2 border-4 border-transparent right-full top-1/2 border-r-neutral" />
							</div>
						</button>
					))}
				</div>
			</aside>

			<div className="flex flex-col w-full h-full gap-3 px-2 py-3 overflow-hidden md:px-24">
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
							<div className="grid max-w-5xl grid-cols-1 gap-4 pb-[50vh] mx-auto md:grid-cols-2">
								{catalogData?.contents?.map(
									(category: CategoryItem, index: number) => (
										<div
											key={category.id}
											id={category.id}
											ref={(el) => {
												categoryRefs.current[category.id] = el
											}}
											className={`relative overflow-hidden border scroll-mt-4 bg-content bg-glass border-base-300 rounded-3xl transition-all duration-300 ${
												index === 0
													? 'md:col-span-2' // آیتم اول همیشه تمام عرض
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
														? 'md:col-span-2' // اگر تعداد کل زوج بود (مثل ۶ تا)، آخری تمام عرض شود تا جای خالی پر شود
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
													className={`grid gap-y-6 gap-x-2 grid-cols-3 sm:grid-cols-5`}
												>
													{category.links?.map((link, idx) => (
														<a
															key={idx}
															href={getUrl(link.url)}
															target="_blank"
															rel="noopener noreferrer"
															className="flex flex-col items-center gap-3 group/item active:scale-95"
														>
															<div className="relative flex items-center justify-center w-12 h-12 transition-all duration-500 bg-base-200/40 rounded-2xl group-hover/item:bg-primary/20 group-hover/item:shadow-lg group-hover/item:shadow-primary/20 group-hover/item:-translate-y-1.5 border border-transparent group-hover/item:border-primary/20">
																{link.badge && (
																	<span
																		className="absolute -top-1 -right-1 z-20 px-1.5 py-0.5 rounded-lg text-[8px] font-black border border-white/10 shadow-sm"
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
																	className="object-contain w-6 h-6 transition-all duration-500 rounded group-hover/item:scale-110 group-hover/item:brightness-110"
																	alt={link.name}
																/>
															</div>
															<span className="text-[10px] font-semibold tracking-tighter text-center truncate w-full opacity-40 group-hover/item:opacity-100 group-hover/item:text-primary transition-all duration-300">
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
