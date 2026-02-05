import { NewBadge } from '@/components/badges/new.badge'
import type { CatalogItem } from '../interfaces/catalog-item.interface'

interface SiteProp {
	link: CatalogItem
}
const ANIMATES = {
	bounce: 'bounce 1.5s infinite',
	pulse: 'pulse 2s infinite',
	spin: 'spin 2s linear infinite',
}

function getUrl(url: string) {
	return url.startsWith('http') ? url : `https://${url}`
}

export function RenderContentSite({ link }: SiteProp) {
	const animate = link.badgeAnimate || null
	const badge = link.badge?.trim()
	const col = link?.span?.col
	const row = link?.span?.row
	const pos = row && row >= 2 ? 'justify-center' : ''

	return (
		<a
			href={getUrl(link.url)}
			target="_blank"
			rel="noopener noreferrer"
			className={`relative flex flex-col items-center gap-1 transition-all duration-500 group active:scale-95 ${pos} rounded-2xl hover:bg-base-300  group-hover:shadow-sm p-0.5 ${!link.hasBorder ? 'border-r border-l border-b border-base-300 hover:border-none' : ''}`}
			style={{
				gridColumn: col ? `span ${col} / span ${col}` : undefined,
				gridRow: row ? `span ${row} / span ${row}` : undefined,
			}}
		>
			{link.isNew && <NewBadge className="top-2 right-1" />}
			{link.icon && (
				<div className="relative flex items-center justify-center w-10 h-10 transition-all duration-500 rounded-xl group-hover:scale-105">
					{badge && (
						<span
							className="absolute -top-2 -left-2 text-center z-20 truncate px-1 rounded-xl text-[10px] font-light max-w-20 border border-white/10 shadow-sm"
							style={{
								backgroundColor: link.badgeColor,
								color: '#fff',
								animation: animate ? ANIMATES[animate] : 'none',
							}}
						>
							{badge}
						</span>
					)}
					<img
						src={link.icon}
						className="object-contain transition-all duration-500 rounded-md min-w-6 min-h-6 max-w-6 max-h-6"
						alt={link.name || link.url}
					/>
				</div>
			)}
			<span className="text-[10px] font-medium tracking-tighter text-center truncate opacity-80 transition-all duration-300 group-hover:opacity-100 group-hover:scale-105">
				{link.name}
			</span>
		</a>
	)
}
