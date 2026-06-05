import { getItemTypeEmoji } from '@/components/market/getItemTypeEmoji'
import { renderBrowserTitlePreview } from '@/components/market/title/title-render-preview'
import type { MarketItem } from '@/services/hooks/market/market.interface'

interface RenderPreviewProps {
	item: MarketItem
	handlePreviewClick: () => void
}

export function RenderPreview({ item }: RenderPreviewProps) {
	const base = 'relative flex items-center justify-center w-full h-24 overflow-hidden'

	if (item.previewUrl) {
		return (
			<div className={base}>
				<img
					src={item.previewUrl}
					alt={item.name}
					className="object-cover w-full h-full"
					loading="lazy"
				/>
			</div>
		)
	}

	if (item.type === 'BROWSER_TITLE') {
		return (
			<div className={`${base} bg-base-200/40 px-2`}>
				{renderBrowserTitlePreview({
					template: item.meta?.template || item.name,
					className: '!w-96 !max-w-96',
				})}
			</div>
		)
	}

	if (item.type === 'FONT') {
		return (
			<div className={`${base} bg-base-200/40`}>
				<div className="text-center px-2">
					<p
						className="text-base font-medium text-content"
						style={{ fontFamily: item.itemValue }}
					>
						نمونه متن
					</p>
					<p
						className="text-[10px] text-muted mt-0.5"
						style={{ fontFamily: item.itemValue }}
					>
						{item.itemValue}
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className={`${base} bg-base-200/30`}>
			<span className="text-3xl opacity-20">{getItemTypeEmoji(item.type)}</span>
		</div>
	)
}
