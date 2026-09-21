import type { CatalogItem } from '../interfaces/catalog-item.interface'
import type { CategoryItem } from '../interfaces/category.interface'
import { RenderContentBanner } from './content-banner'
import { RenderContentIframe } from './content-iframe'
import { RenderContentSite } from './content-site'

interface Prop {
	category: CategoryItem
	categoryRefs: any
	onOpenPromoModal?: (item: CatalogItem, triggerEl?: HTMLElement) => void
}

export function ExplorerCategory({ category, categoryRefs, onOpenPromoModal }: Prop) {
	if (!category.links?.length) return null
	const id = category.id.replaceAll(' ', '_')

	return (
		<section
			key={id}
			id={id}
			ref={(el) => {
				categoryRefs.current[category.id] = el
			}}
			className="w-full scroll-mt-20 mb-8"
		>
			<div className="flex items-center justify-between pb-3 mb-3 border-b border-base-200/80">
				<div className="flex items-center gap-2.5">
					<div className="w-8 h-8 rounded-xl bg-base-200/80 border border-base-content/10 p-1.5 flex items-center justify-center shrink-0 shadow-inner">
						{category.icon ? (
							<img
								src={category.icon}
								className="object-contain w-full h-full"
								alt=""
							/>
						) : (
							<div className="w-2 h-2 rounded-full bg-primary" />
						)}
					</div>
					<div>
						<h2 className="text-sm font-bold text-base-content tracking-wide">
							{category.category}
						</h2>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-3 grid-flow-dense auto-rows-[68px]">
				{category.links.map((link) =>
					link.type === 'REMOTE_IFRAME' ? (
						<RenderContentIframe key={link.url} link={link} />
					) : link.type === 'BANNER' ? (
						<RenderContentBanner
							key={link.url}
							link={link}
							onOpenPromoModal={onOpenPromoModal}
						/>
					) : link.type === 'SITE' ? (
						<RenderContentSite
							key={link.url}
							link={link}
							onOpenPromoModal={onOpenPromoModal}
						/>
					) : (
						<div
							className="flex items-center justify-center w-full h-full text-[10px] border border-dashed border-base-content/20 rounded-2xl text-base-content/40"
							key={link.url}
						>
							نیازمند بروزرسانی
						</div>
					)
				)}
			</div>
		</section>
	)
}
