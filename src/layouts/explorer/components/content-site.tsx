import { getContrastingTextColor } from '@/common/color'
import { NewBadge } from '@/components/ui'
import { Icon } from '@/icons'
import type { CatalogItem } from '../interfaces/catalog-item.interface'

interface SiteProp {
	link: CatalogItem
	onOpenPromoModal?: (item: CatalogItem, triggerEl?: HTMLElement) => void
}

function getUrl(url: string) {
	return url.startsWith('http') ? url : `https://${url}`
}

export function RenderContentSite({ link, onOpenPromoModal }: SiteProp) {
	const badge = link.badge?.trim()
	const isModalAction =
		link.meta?.action === 'OPEN_MODAL' ||
		link.meta?.action === 'OPEN_POPOVER' ||
		link.meta?.type === 'POPOVER_MENU' ||
		Boolean(link.meta?.promo)

	const handleClick = (e: React.MouseEvent) => {
		if (isModalAction && onOpenPromoModal) {
			e.preventDefault()
			onOpenPromoModal(link, e.currentTarget as HTMLElement)
		}
	}

	return (
		<a
			href={getUrl(link.url)}
			target="_blank"
			rel="noopener noreferrer"
			onClick={handleClick}
			className="col-span-1 row-span-1 h-full group relative p-3 rounded-2xl border border-base-content/5 bg-base-200/40 hover:bg-base-200/80 hover:border-base-content/15 transition-all duration-200 active:scale-[0.98] select-none shadow-xs hover:shadow-sm flex items-center justify-between gap-3 cursor-pointer"
		>
			{link.isNew && <NewBadge className="top-2 left-2" />}

			{badge && (
				<span
					className="absolute -top-2.5 left-3 z-10 inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide shadow-xs border border-white/20 select-none pointer-events-none transition-transform duration-200 group-hover:scale-105"
					style={{
						backgroundColor: link.badgeColor || 'var(--color-primary)',
						color: link.badgeColor
							? getContrastingTextColor(link.badgeColor)
							: '#ffffff',
					}}
				>
					{badge}
				</span>
			)}

			<div className="w-10 h-10 rounded-xl bg-base-200 border border-base-content/10 p-2 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-primary/30 transition-all shadow-inner">
				{link.icon ? (
					<img
						src={link.icon}
						alt={link.name || link.url}
						className="object-contain w-full h-full rounded-md"
					/>
				) : (
					<Icon name="outlineGlobe" size={16} className="text-muted" />
				)}
			</div>

			<div className="flex-1 min-w-0 pr-1 flex flex-col justify-center">
				<span className="text-xs font-bold text-base-content/90 group-hover:text-primary transition-colors truncate tracking-wide">
					{link.name || 'بدون نام'}
				</span>
				{link.description && (
					<span className="text-[10px] text-base-content/50 truncate mt-0.5">
						{link.description}
					</span>
				)}
			</div>

			<div className="flex items-center justify-center text-base-content/20 group-hover:text-base-content group-hover:-translate-x-1 transition-all duration-200 shrink-0">
				{isModalAction ? (
					<Icon name="chevronDown" size={13} />
				) : (
					<Icon name="chevronLeft" size={13} />
				)}
			</div>
		</a>
	)
}
