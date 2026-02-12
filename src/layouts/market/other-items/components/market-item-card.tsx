import { FiShoppingCart, FiCheck } from 'react-icons/fi'
import { Button } from '@/components/button/button'
import { ItemPrice } from '@/components/item-price/item-price'
import { getItemTypeEmoji } from '@/components/market/getItemTypeEmoji'
import { Theme } from '@/context/theme.context'
import type { MarketItem, MarketItemType } from '@/services/hooks/market/market.interface'
import { showToast } from '@/common/toast'
import { RenderPreview } from './renderPreview'

interface MarketItemCardProps {
	item: MarketItem
	onPurchase: () => void
	isAuthenticated: boolean
	isOwned?: boolean
}

const SUPPORTED_TYPES: MarketItemType[] = ['BROWSER_TITLE', 'THEME', 'FONT']

const getItemTypeLabel = (type: string) => {
	switch (type) {
		case 'BROWSER_TITLE':
			return 'عنوان مرورگر'
		case 'FONT':
			return 'فونت'
		case 'THEME':
			return 'تم'
		default:
			return type
	}
}

export function MarketItemCard({
	item,
	onPurchase,
	isAuthenticated,
}: MarketItemCardProps) {
	const canAfford = isAuthenticated
	const isOwned = item.isOwned

	const handlePreviewClick = () => {
		if (item.previewUrl) window.open(item.previewUrl, '_blank')
	}

	let needUpgrade = !SUPPORTED_TYPES.includes(item.type)
	if (
		!needUpgrade &&
		item.itemValue &&
		item.type === 'THEME' &&
		!(item.itemValue in Theme)
	) {
		needUpgrade = true
	}

	function onPurchaseButtonClick() {
		if (needUpgrade) {
			showToast('نیاز به به‌روزرسانی افزونه دارد!', 'error')
			return
		}
		onPurchase()
	}

	return (
		<div className="group relative flex flex-col h-full bg-base-100 rounded-2xl p-3 border border-base-300/70 hover:border-primary/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
			<div className="flex items-start justify-between px-1 mb-3">
				<div className="flex flex-col overflow-hidden">
					<h3 className="text-sm font-bold truncate transition-colors text-content group-hover:text-primary">
						{item.name}
					</h3>
					<span className="text-[10px] text-muted/60 mt-0.5">
						{getItemTypeLabel(item.type)}
					</span>
				</div>
				<span className="text-lg transition-transform opacity-80 group-hover:scale-110">
					{getItemTypeEmoji(item.type)}
				</span>
			</div>

			<div className="flex-1 mb-3 overflow-hidden rounded-xl">
				<RenderPreview item={item} handlePreviewClick={handlePreviewClick} />
			</div>

			{item.description && (
				<p className="px-1 mb-4 text-[11px] leading-relaxed text-muted/80 line-clamp-2 h-8">
					{item.description}
				</p>
			)}

			<div className="flex items-center justify-between pt-2 mt-auto border-t border-base-200/40">
				<div className="origin-right scale-90">
					<ItemPrice price={item.price} />
				</div>

				{isOwned ? (
					<div className="flex items-center h-8 gap-1 px-1 border bg-success/10 text-success rounded-xl border-success/20">
						<FiCheck size={14} />
						<span>خریداری‌شده</span>
					</div>
				) : (
					<Button
						size="sm"
						onClick={onPurchaseButtonClick}
						disabled={isOwned}
						className={`
						h-8 px-4 rounded-xl text-xs font-bold transition-all bg-primary/80 text-white hover:bg-primary active:scale-95
					`}
					>
						<div className="flex items-center gap-1">
							<FiShoppingCart size={14} />
							<span>{canAfford ? 'خرید' : 'موجودی'}</span>
						</div>
					</Button>
				)}
			</div>
		</div>
	)
}
