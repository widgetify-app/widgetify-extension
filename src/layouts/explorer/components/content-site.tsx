import { NewBadge } from '@/components/ui'
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
			className={`relative flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200 group active:scale-95 ${pos} hover:bg-base-200/60 border border-transparent hover:border-base-300/40`}
			style={{
				gridColumn: col ? `span ${col} / span ${col}` : undefined,
				gridRow: row ? `span ${row} / span ${row}` : undefined,
			}}
		>
			{link.isNew && <NewBadge className="top-1.5 right-1.5" />}

			{badge && (
				<span
					className="absolute top-1 -left-1 rounded-r-md text-center z-20 truncate px-1.5 py-0.2 text-[9px] font-medium max-w-20 border border-white/20 shadow-sm"
					style={{
						backgroundColor: link.badgeColor || 'var(--color-primary)',
						color: '#fff',
						animation: animate ? ANIMATES[animate] : 'none',
					}}
				>
					{badge}
				</span>
			)}
			<div className="flex items-center justify-center w-10 h-10 transition-transform duration-200 rounded-xl bg-base-200/40 group-hover:scale-105 group-hover:bg-base-200/80">
				<img
					src={link.icon}
					className="object-contain transition-transform duration-200 rounded-lg w-6 h-6 max-w-6 max-h-6"
					alt={link.name || link.url}
				/>
			</div>

			<span className="text-[11px] font-medium text-center truncate max-w-full text-base-content/75 transition-colors duration-200 group-hover:text-base-content">
				{link.name}
			</span>
		</a>
	)
}
