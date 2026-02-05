import type { ExplorerCategoryBadge } from '@/services/hooks/content/get-content.hook'
import type { CategoryItem } from '../interfaces/category.interface'
import { RenderContentBanner } from './content-banner'
import { RenderContentIframe } from './content-iframe'
import { RenderContentSite } from './content-site'

interface Prop {
	category: CategoryItem
	categoryRefs: any
	index: number
	contentLength: number
	activeCategory: string
}
export function ExplorerCategory({
	category,
	categoryRefs,
	index,
	contentLength,
	activeCategory,
}: Prop) {
	return (
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
				...(category.banner && {
					'--banner-url': `url(${category.banner})`,
				}),
			}}
			className={`relative overflow-hidden border scroll-mt-4 bg-content bg-glass border-base-300 rounded-2xl transition-all duration-300 ${
				index === 0
					? 'md:col-span-2'
					: index === contentLength - 1 && contentLength % 2 === 0
						? 'md:col-span-2'
						: 'md:col-span-1'
			}
			${category.id === activeCategory && 'outline-2 outline-offset-1 outline-primary/80'}
			${category.banner ? 'before:absolute before:inset-x-0 before:top-0 before:h-12 before:bg-cover before:bg-center before:bg-no-repeat before:brightness-75 before:contrast-110 before:pointer-events-none' : ''}
			`}
		>
			{category.banner && (
				<style>
					{`#${category.id}::before {
						content: "";
						background-image: var(--banner-url);
						mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
						-webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
					}`}
				</style>
			)}
			<div className="relative z-10 p-3">
				{!category.hideName && (
					<div className="flex items-center justify-between gap-4 mb-2">
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
							<h3
								className={`text-xs font-semibold tracking-widest  ${category.banner ? 'text-base-content/90' : 'text-base-content/70'}`}
							>
								{category.category}
							</h3>
						</div>

						{category.badges?.length ? (
							<div className="flex flex-row gap-1">
								{category.badges?.map((f, i) => (
									<CategoryBadge badge={f} key={`badge-${i}`} />
								))}
							</div>
						) : (
							<div className="flex-1 h-px bg-linear-to-r from-base-content/5 to-transparent" />
						)}
					</div>
				)}

				<HandleCatalogs category={category} colSpan={category.span?.col} />
			</div>
		</div>
	)
}

interface HandleCatalogsProp {
	category: CategoryItem
	colSpan?: number | null
}

function HandleCatalogs({ category, colSpan }: HandleCatalogsProp) {
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
					<RenderContentIframe key={link.url} link={link} />
				) : link.type === 'SITE' ? (
					<RenderContentSite key={link.url} link={link} />
				) : link.type === 'BANNER' ? (
					<RenderContentBanner key={link.url} link={link} />
				) : null
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
