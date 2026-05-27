import { getItemTypeEmoji } from '@/components/market/getItemTypeEmoji'
import { renderBrowserTitlePreview } from '@/components/market/title/title-render-preview'
import Tooltip from '@/components/toolTip'
import type { MarketItem } from '@/services/hooks/market/market.interface'
import { FiEye } from 'react-icons/fi'

interface RenderPreviewProps {
	item: MarketItem
	handlePreviewClick: () => void
}

export function RenderPreview({ item, handlePreviewClick }: RenderPreviewProps) {
	if (item.previewUrl) {
		return (
			<div className="relative flex items-center justify-center w-full bg-base-200/50 min-h-24 max-h-24 overflow-hidden">
				<img
					src={item.previewUrl}
					alt="تصویر پیش‌نمایش"
					className="object-cover w-full h-24"
					loading="lazy"
				/>
				<Tooltip content="مشاهده تصویر کامل" position="bottom" offset={-20}>
					<button
						onClick={handlePreviewClick}
						className="absolute top-1.5 left-1.5 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm cursor-pointer"
					>
						<FiEye size={12} />
					</button>
				</Tooltip>
			</div>
		)
	}

	if (item.type === 'BROWSER_TITLE') {
		return (
			<div className="relative flex items-center justify-center w-full bg-base-200/50 min-h-24 max-h-24 overflow-hidden px-2">
				{renderBrowserTitlePreview({
					template: item.meta?.template || item.name,
					className: '!w-96 !max-w-96',
				})}
			</div>
		)
	}

	if (item.type === 'FONT') {
		return (
			<div className="relative flex items-center justify-center w-full bg-base-200/50 min-h-24 max-h-24 overflow-hidden">
				<div className="text-center px-2">
					<div
						className="text-xl leading-relaxed text-content"
						style={{ fontFamily: item.itemValue }}
					>
						<span className="font-medium">نمونه فونت</span>
					</div>
					<span className="text-xs text-muted" style={{ fontFamily: item.itemValue }}>
						{item.itemValue}
					</span>
				</div>
			</div>
		)
	}

	return (
		<div className="relative flex items-center justify-center w-full bg-base-200/30 min-h-24 max-h-24">
			<span className="text-3xl opacity-30">{getItemTypeEmoji(item.type)}</span>
		</div>
	)
}
