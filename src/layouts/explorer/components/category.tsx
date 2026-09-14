import type { ExplorerCategoryBadge } from '@/services/hooks/content/get-content.hook'
import type { CategoryItem } from '../interfaces/category.interface'
import { RenderContentBanner } from './content-banner'
import { RenderContentIframe } from './content-iframe'
import { RenderContentSite } from './content-site'
import { twJoin } from 'tailwind-merge'

interface Prop {
	category: CategoryItem
	categoryRefs: any
	activeCategory: string
}
export function ExplorerCategory({ category, categoryRefs, activeCategory }: Prop) {
	if (!category.links?.length) return null
	const id = category.id.replaceAll(' ', '_')
	return (
		<div
			key={id}
			id={id}
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
				...(category.banner && {
					'--banner-url': `url(${category.banner})`,
				}),
			}}
			className={twJoin(
				'relative overflow-hidden border scroll-mt-20 bg-content bg-glass border-base-200/70 hover:border-base-300 rounded-widget transition-all duration-300 shadow-sm hover:shadow-md break-inside-avoid mb-3.5',
				category.id === activeCategory &&
					'ring-2 ring-primary/40 border-primary/50',
				category.banner
					? 'before:absolute before:inset-x-0 before:top-0 before:h-16 before:bg-cover before:bg-center before:bg-no-repeat before:brightness-75 before:contrast-110 before:pointer-events-none'
					: ''
			)}
		>
			{category.banner && (
				<style>
					{`#${id}::before {
						content: "";
						background-image: var(--banner-url);
						mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
						-webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
					}`}
				</style>
			)}
			<div className="relative z-10 p-3">
				<div className="flex items-center justify-between gap-4">
					<div className="flex items-center gap-2">
						{category.icon ? (
							<img
								src={category.icon}
								className="object-contain w-4 h-4 opacity-80"
								alt=""
							/>
						) : (
							<div className="w-1.5 h-3.5 rounded-full bg-primary" />
						)}
						<h3
							className={`text-xs font-semibold tracking-wide ${category.banner ? 'text-base-content/90' : 'text-base-content/80'}`}
						>
							{category.category}
						</h3>
					</div>

					{category.badges?.length ? (
						<div className="flex flex-row items-center gap-1">
							{category.badges?.map((f, i) => (
								<CategoryBadge badge={f} key={`badge-${i}`} />
							))}
						</div>
					) : (
						<div className="flex-1 h-px bg-linear-to-r from-base-content/10 to-transparent" />
					)}
				</div>
			</div>

			<HandleCatalogs category={category} />
		</div>
	)
}

interface HandleCatalogsProp {
	category: CategoryItem
}

function HandleCatalogs({ category }: HandleCatalogsProp) {
	const totalLinks = category.links?.length || 0
	const gridColsClass =
		category.span?.col && category.span.col >= 2
			? 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-8'
			: totalLinks > 8
				? 'grid-cols-4'
				: 'grid-cols-4'

	return (
		<div className={`grid gap-x-2 gap-y-3 px-2 py-0.5 ${gridColsClass}`}>
			{category.links?.map((link) =>
				link.type === 'REMOTE_IFRAME' ? (
					<RenderContentIframe key={link.url} link={link} />
				) : link.type === 'SITE' ? (
					<RenderContentSite key={link.url} link={link} />
				) : link.type === 'BANNER' ? (
					<RenderContentBanner key={link.url} link={link} />
				) : (
					<div
						className="flex items-center justify-center w-full h-full text-[10px] border blur-sm hover:blur-none transition-all duration-200  border-dashed border-content rounded-2xl text-muted"
						key=""
					>
						نیازمند بروزرسانی
					</div>
				)
			)}
		</div>
	)
}
interface BadgeProp {
	badge: ExplorerCategoryBadge
}
function CategoryBadge({ badge }: BadgeProp) {
	const render = (
		<div
			className="flex h-5 gap-1 px-1 py-0.5 items-center rounded-lg w-fit"
			key={badge.label}
			style={{
				background: badge.bgColor,
			}}
		>
			{badge.label}
			{badge.iconSrc && <img src={badge.iconSrc} className="w-4 h-4" />}
		</div>
	)

	if (badge.url) {
		return (
			<a
				className="hover:scale-95"
				target="_blank"
				rel="noopener noreferrer"
				href={badge.url}
			>
				{render}
			</a>
		)
	}

	return render
}
