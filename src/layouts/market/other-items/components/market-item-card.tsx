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
		<div className="group relative flex flex-col h-full bg-base-100 rounded-2xl border border-base-300/60 hover:border-primary/30 hover:shadow-lg transition-all duration-200 overflow-hidden">
			<div className="relative flex-shrink-0 bg-base-200/40 overflow-hidden">
				<RenderPreview item={item} handlePreviewClick={handlePreviewClick} />
				{isOwned && (
					<div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/15 border border-success/25 text-success">
						<FiCheck size={10} />
						<span className="text-[9px] font-semibold">خریداری‌شده</span>
					</div>
				)}
			</div>

			<div className="flex flex-col flex-1 p-3 gap-2">
				<div className="flex items-start justify-between gap-2">
					<div className="flex flex-col min-w-0">
						<h3 className="text-sm font-semibold truncate text-content group-hover:text-primary transition-colors">
							{item.name}
						</h3>
						<span className="text-[10px] text-muted mt-0.5 flex items-center gap-1">
							<span>{getItemTypeEmoji(item.type)}</span>
							<span>{getItemTypeLabel(item.type)}</span>
						</span>
					</div>
				</div>

				{item.description && (
					<p className="text-[11px] leading-relaxed text-muted line-clamp-2 flex-1">
						{item.description}
					</p>
				)}

				<div className="flex items-center justify-between pt-2 border-t border-base-200/50 mt-auto">
					<ItemPrice price={item.price} />

					{isOwned ? (
						<div className="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-success/10 text-success border border-success/20 text-[11px] font-medium">
							<FiCheck size={12} />
							<span>دارید</span>
						</div>
					) : (
						<Button
							size="sm"
							onClick={onPurchaseButtonClick}
							disabled={isOwned}
							className="h-7 px-3 rounded-lg text-[11px] font-semibold bg-primary/85 text-white hover:bg-primary active:scale-95 transition-all"
						>
							<div className="flex items-center gap-1">
								<FiShoppingCart size={12} />
								<span>{canAfford ? 'خرید' : 'موجودی'}</span>
							</div>
						</Button>
					)}
				</div>
			</div>
		</div>
	)
}
