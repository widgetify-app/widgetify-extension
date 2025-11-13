import toast from 'react-hot-toast'
import { FiEye, FiShoppingCart } from 'react-icons/fi'
import { Button } from '@/components/button/button'
import { ItemPrice } from '@/components/item-price/item-price'
import { renderBrowserTitlePreview } from '@/components/market/title/title-render-preview'
import Tooltip from '@/components/toolTip'
import { Theme } from '@/context/theme.context'
import type { MarketItem, MarketItemType } from '@/services/hooks/market/market.interface'

interface MarketItemCardProps {
	item: MarketItem
	onPurchase: () => void
	userCoins: number
}
const SUPPORTED_TYPES: MarketItemType[] = ['BROWSER_TITLE', 'THEME']
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

const getItemTypeEmoji = (type: string) => {
	switch (type) {
		case 'BROWSER_TITLE':
			return '🌐'
		case 'FONT':
			return '🔤'
		case 'THEME':
			return '🎨'
		default:
			return '📦'
	}
}

export function MarketItemCard({ item, onPurchase, userCoins }: MarketItemCardProps) {
	const canAfford = userCoins >= item.price

	const handlePreviewClick = () => {
		if (item.previewUrl) {
			window.open(item.previewUrl, '_blank')
		}
	}

	let needUpgrade = !SUPPORTED_TYPES.includes(item.type)
	if (!needUpgrade && item.type === 'THEME') {
		if (item.itemValue) {
			if (!(item.itemValue in Theme)) needUpgrade = true
		}
	}

	function onPurchaseButtonClick() {
		if (needUpgrade) {
			return toast.error(
				'این مورد نیاز به به‌روزرسانی افزونه دارد! لطفا افزونه خود را به‌روزرسانی کنید.',
				{
					className: 'font-bold',
				}
			)
		}

		onPurchase()
	}

	return (
		<div className="relative p-2 transition-all duration-200 border rounded-xl border-base-300 bg-content hover:border-primary/30 hover:shadow-md group">
			<div className="flex items-center justify-between">
				<div className="flex flex-row gap-0.5 items-center">
					<span className="text-lg">{getItemTypeEmoji(item.type)}</span>
					<h3 className="font-medium text-content">{item.name}</h3>
				</div>
				<div>
					<span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
						{getItemTypeLabel(item.type)}
					</span>
				</div>
			</div>

			<section className="mb-4 min-h-[7rem] flex flex-col gap-3">
				{item.type === 'BROWSER_TITLE' ? (
					<div className="relative flex items-center justify-center flex-1 p-2 border bg-base-100 rounded-xl border-base-200">
						{renderBrowserTitlePreview({
							template: item.meta?.template || item.name,
							className: '!w-96 !max-w-96',
						})}
					</div>
				) : item.previewUrl ? (
					<div className="relative flex items-center justify-center flex-1 p-2 border bg-base-100 rounded-xl border-base-200">
						<img
							src={item.previewUrl}
							alt={'تصویر پیش‌نمایش'}
							className="object-contain max-w-full rounded-lg max-h-20 min-h-20"
							loading="lazy"
						/>
						<Tooltip
							content="مشاهده تصویر کامل"
							position="bottom"
							offset={-20}
						>
							<button
								onClick={handlePreviewClick}
								className="absolute top-1 left-1 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm cursor-pointer"
							>
								<FiEye size={14} />
							</button>
						</Tooltip>
					</div>
				) : (
					<div className="flex items-center justify-center flex-1 border border-dashed bg-base-100 rounded-xl border-base-300">
						<span className="text-2xl opacity-50">
							{getItemTypeEmoji(item.type)}
						</span>
					</div>
				)}

				{item.description && (
					<p className="px-1 text-xs leading-relaxed text-muted line-clamp-2">
						{item.description}
					</p>
				)}
			</section>

			<div className="flex items-center justify-between">
				<ItemPrice price={item.price} />
				<Button
					size="sm"
					onClick={onPurchaseButtonClick}
					disabled={!canAfford}
					className={`${
						canAfford
							? 'bg-primary hover:bg-primary/90 text-white'
							: 'bg-base-300 text-muted cursor-not-allowed'
					} rounded-xl`}
				>
					<FiShoppingCart size={16} className="ml-1" />
					{canAfford ? 'خرید' : 'ناکافی'}
				</Button>
			</div>
		</div>
	)
}
