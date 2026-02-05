import type { CatalogItem } from '../interfaces/catalog-item.interface'

interface SiteProp {
	link: CatalogItem
}

function getUrl(url: string) {
	return url.startsWith('http') ? url : `https://${url}`
}

export function RenderContentBanner({ link }: SiteProp) {
	const col = link?.span?.col
	const row = link?.span?.row
	const badge = link.badge?.trim()

	const pos = row && row >= 2 ? 'justify-center' : ''

	const style = link.backgroundSrc
		? {
				backgroundImage: `url(${link.backgroundSrc})`,
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center',
			}
		: {}
	return (
		<a
			href={getUrl(link.url)}
			target="_blank"
			rel="noopener noreferrer"
			className={`relative flex flex-col items-center gap-1 transition-all duration-500  group active:scale-95 ${pos} rounded hover:shadow-sm hover:scale-98`}
			style={{
				gridColumn: col ? `span ${col} / span ${col}` : undefined,
				gridRow: row ? `span ${row} / span ${row}` : undefined,
				...style,
			}}
		>
			{badge && (
				<span
					className="absolute -top-3 left-2 text-center z-20 truncate px-1 rounded-t-xl text-[10px] font-light max-w-20 border border-white/10 shadow-sm"
					style={{
						backgroundColor: link.badgeColor,
						color: '#fff',
					}}
				>
					{badge}
				</span>
			)}{' '}
		</a>
	)
}
