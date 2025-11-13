import { FiEye, FiShoppingCart } from 'react-icons/fi'
import { Button } from '@/components/button/button'
import { ItemPrice } from '@/components/item-price/item-price'
import Tooltip from '@/components/toolTip'
import type { MarketItem, MarketItemType } from '@/services/hooks/market/market.interface'

interface MarketItemCardProps {
	item: MarketItem
	onPurchase: () => void
	userCoins: number
}
const SUPPORTED_TYPES: MarketItemType[] = ['BROWSER_TITLE', 'FONT', 'THEME']
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

	return (
		<div className="relative p-2 transition-all duration-200 border rounded-xl border-base-300 bg-content hover:border-primary/30 hover:shadow-md group">
			{!SUPPORTED_TYPES.includes(item.type) && (
				<div className="absolute backdrop-blur-lg z-50 h-full w-full top-0 right-0 text-xs px-2 py-0.5 rounded-2xl text-warning flex justify-center items-center text-center font-bold">
					<span className="badge badge-warning badge-dash">
						لطفا افزونه خود رو به‌روزرسانی کنید.
					</span>
				</div>
			)}

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
				{item.previewUrl ? (
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
					onClick={onPurchase}
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
