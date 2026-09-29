import { getContrastingTextColor } from '@/common/color'
import { NewBadge } from '@/components/ui'
import { Icon } from '@/icons'
import type { CatalogItem } from '../types'

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
			className="col-span-1 row-span-1 h-full group relative p-3 rounded-2xl border border-surface-3 bg-fill hover:bg-fill-2 hover:border-line transition-ui duration-200 active:scale-[0.98] select-none shadow-sm hover:shadow-md flex items-center justify-between gap-3 cursor-pointer"
		>
			{link.isNew && <NewBadge className="top-2 left-2" />}

			{badge && (
				<span
					className="absolute -top-2.5 left-3 z-10 inline-flex items-center px-2 py-0.5 rounded-full text-4xs font-bold tracking-wide shadow-sm border border-image-fill select-none pointer-events-none transition-transform duration-200 group-hover:scale-105"
					style={{
						backgroundColor: link.badgeColor || 'var(--color-primary)',
						color: link.badgeColor
							? getContrastingTextColor(link.badgeColor)
							: 'var(--color-primary-content)',
					}}
				>
					{badge}
				</span>
			)}

			<div className="w-10 h-10 rounded-xl bg-surface-2 border border-line p-2 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-brand-fill-2 transition-ui">
				{link.icon ? (
					<img
						src={link.icon}
						alt={link.name || link.url}
						className="object-contain w-full h-full rounded-lg"
					/>
				) : (
					<Icon name="globe" size={16} className="text-fg-muted" />
				)}
			</div>

			<div className="flex-1 min-w-0 pr-1 flex flex-col justify-center">
				<span className="text-xs font-bold text-fg group-hover:text-brand transition-colors truncate tracking-wide">
					{link.name || 'بدون نام'}
				</span>
				{link.description && (
					<span className="text-3xs text-fg-faint truncate mt-0.5">
						{link.description}
					</span>
				)}
			</div>

			<div className="flex items-center justify-center text-fg-ghost group-hover:text-fg-strong group-hover:-translate-x-1 transition-ui duration-200 shrink-0">
				{isModalAction ? (
					<Icon name="chevronDown" size={13} />
				) : (
					<Icon name="chevronLeft" size={13} />
				)}
			</div>
		</a>
	)
}
