import { FiShoppingCart } from 'react-icons/fi'
import { Button } from '@/components/button/button'
import { ItemPrice } from '@/components/item-price/item-price'
import { getItemTypeEmoji } from '@/components/market/getItemTypeEmoji'
import { Theme } from '@/context/theme.context'
import type { MarketItem, MarketItemType } from '@/services/hooks/market/market.interface'
import { showToast } from '@/common/toast'
import { FontFamily } from '@/context/appearance.context'
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

	const handlePreviewClick = () => {
		if (item.previewUrl) {
			window.open(item.previewUrl, '_blank')
		}
	}

	let needUpgrade = !SUPPORTED_TYPES.includes(item.type)
	if (!needUpgrade) {
		if (item.itemValue) {
			if (item.type === 'THEME' && !(item.itemValue in Theme)) needUpgrade = true
			if (item.type === 'FONT' && !(item.itemValue in FontFamily))
				needUpgrade = true
		}
	}

	function onPurchaseButtonClick() {
		if (needUpgrade) {
			showToast(
				'این مورد نیاز به به‌روزرسانی افزونه دارد! لطفا افزونه خود را به‌روزرسانی کنید.',
				'error'
			)
			return
		}

		onPurchase()
	}

	return (
		<div className="relative p-2 transition-all duration-200 border rounded-xl border-base-300 bg-content hover:border-primary/30 hover:shadow-md group min-h-[14rem] flex flex-col">
			<div className="flex items-center justify-between">
				<div className="flex flex-row gap-0.5 items-center">
					<span className="text-lg">{getItemTypeEmoji(item.type)}</span>
					<h3 className="font-medium text-content truncate max-w-[5rem]">
						{item.name}
					</h3>
				</div>
				<div>
					<span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
						{getItemTypeLabel(item.type)}
					</span>
				</div>
			</div>

			<section className="mb-4 min-h-[7rem] flex flex-col gap-3 flex-1">
				<RenderPreview item={item} handlePreviewClick={handlePreviewClick} />
				{item.description && (
					<p className="px-1 text-xs leading-relaxed text-muted line-clamp-2">
						{item.description}
					</p>
				)}
			</section>

			<div className="flex items-center justify-between mt-auto">
				<ItemPrice price={item.price} />
				<Button
					size="sm"
					onClick={onPurchaseButtonClick}
					disabled={item.isOwned}
					className={`disabled:bg-base-300 disabled:text-muted disabled:opacity-80 disabled:cursor-not-allowed bg-primary hover:bg-primary/90 text-white rounded-xl`}
				>
					<FiShoppingCart size={16} className="ml-1" />
					{canAfford ? 'خرید' : 'ناکافی'}
				</Button>
			</div>
		</div>
	)
}
