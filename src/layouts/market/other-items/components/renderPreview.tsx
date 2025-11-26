import { getItemTypeEmoji } from '@/components/market/getItemTypeEmoji'
import { renderBrowserTitlePreview } from '@/components/market/title/title-render-preview'
import Tooltip from '@/components/toolTip'
import type { MarketItem } from '@/services/hooks/market/market.interface'
import { FiEye, FiShoppingBag } from 'react-icons/fi'

interface RenderPreviewProps {
	item: MarketItem
	handlePreviewClick: () => void
}
function IsOwnedBadge() {
	return (
		<div className="absolute z-10 flex gap-0.5 px-1 rounded-full shadow-sm text-success bg-black/80 items-center top-2 right-2">
			<FiShoppingBag size={10} />
			<span className="!text-[10px] font-normal">باز شده</span>
		</div>
	)
}

export function RenderPreview({ item, handlePreviewClick }: RenderPreviewProps) {
	if (item.previewUrl) {
		return (
			<div className="relative flex items-center flex-1 p-2 border bg-base-300 rounded-xl border-base-200">
				<img
					src={item.previewUrl}
					alt={'تصویر پیش‌نمایش'}
					className="object-center w-full max-w-full rounded-lg max-h-20 min-h-20"
					loading="lazy"
				/>
				<Tooltip content="مشاهده تصویر کامل" position="bottom" offset={-20}>
					<button
						onClick={handlePreviewClick}
						className="absolute top-1 left-1 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm cursor-pointer"
					>
						<FiEye size={14} />
					</button>
				</Tooltip>
				{item.isOwned ? <IsOwnedBadge /> : null}
			</div>
		)
	}

	if (item.type === 'BROWSER_TITLE') {
		return (
			<div className="relative flex items-center justify-center flex-1 p-2 border bg-base-300 rounded-xl border-base-200">
				{item.isOwned ? <IsOwnedBadge /> : null}
				{renderBrowserTitlePreview({
					template: item.meta?.template || item.name,
					className: '!w-96 !max-w-96',
				})}
			</div>
		)
	}
	if (item.type === 'FONT') {
		return (
			<div className="relative flex items-center justify-center flex-1 p-2 border bg-base-300 rounded-xl border-base-200">
				{item.isOwned ? <IsOwnedBadge /> : null}
				<div className="text-center">
					<div
						className={`text-xl leading-relaxed`}
						style={{ fontFamily: item.itemValue }}
					>
						<span className="font-medium">نمونه فونت</span>
						<br />
						<span></span>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="relative flex items-center justify-center flex-1 border border-dashed bg-base-100 rounded-xl border-base-300">
			{item.isOwned ? <IsOwnedBadge /> : null}
			<span className="text-2xl opacity-50">{getItemTypeEmoji(item.type)}</span>
		</div>
	)
}
