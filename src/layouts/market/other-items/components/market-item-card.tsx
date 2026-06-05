import { FiCheck, FiShoppingCart, FiEye } from 'react-icons/fi'
import { Button } from '@/components/button/button'
import { ItemPrice } from '@/components/item-price/item-price'
import { getItemTypeEmoji } from '@/components/market/getItemTypeEmoji'
import { type MarketItem, MarketItemType } from '@/services/hooks/market/market.interface'
import { showToast } from '@/common/toast'
import { RenderPreview } from './renderPreview'

interface MarketItemCardProps {
	item: MarketItem
	onPurchase: () => void
	isAuthenticated: boolean
	onClickPreview: () => void
}

const SUPPORTED_TYPES: MarketItemType[] = Object.values(MarketItemType)

const TYPE_LABELS: Record<string, string> = {
	BROWSER_TITLE: 'عنوان مرورگر',
	FONT: 'فونت',
	THEME: 'تم',
}

export function MarketItemCard({
	item,
	onPurchase,
	onClickPreview,
}: MarketItemCardProps) {
	const isOwned = item.isOwned
	const canPreview = !!(item as any).canPreview

	const handlePreview = (e: React.MouseEvent) => {
		e.stopPropagation()
		onClickPreview()
	}

	const handleBuy = () => {
		if (!SUPPORTED_TYPES.includes(item.type)) {
			showToast('نیاز به به‌روزرسانی افزونه دارد!', 'error')
			return
		}
		onPurchase()
	}

	return (
		<div className="flex flex-col overflow-hidden transition-all duration-200 border bg-base-100/80 rounded-2xl border-base-content/8 hover:border-primary/30 hover:shadow-sm group">
			{/* Preview area */}
			<div className="relative overflow-hidden bg-base-200/40 flex-shrink-0 min-h-[80px]">
				<RenderPreview
					item={item}
					handlePreviewClick={() => {
						if (item.previewUrl) window.open(item.previewUrl, '_blank')
					}}
				/>

				{/* Type badge */}
				<div className="absolute top-2 right-2">
					<span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-base-100/75 backdrop-blur-sm border border-base-content/8 text-[9px] text-base-content/50 font-medium">
						{getItemTypeEmoji(item.type)}{' '}
						{TYPE_LABELS[item.type] || item.type}
					</span>
				</div>

				{isOwned && (
					<div className="absolute top-2 left-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-success/15 border border-success/20 text-success">
						<FiCheck size={9} />
						<span className="text-[9px] font-semibold">دارید</span>
					</div>
				)}

				{!canPreview && (
					<button
						onClick={handlePreview}
						className="absolute bottom-1.5 left-1.5 flex items-center gap-1 px-2 py-1 rounded-lg bg-base-100/85 border border-base-content/10 text-base-content/60 hover:text-primary transition-colors text-[10px] font-medium backdrop-blur-sm cursor-pointer opacity-0 group-hover:opacity-100"
					>
						<FiEye size={10} />
						<span>پیش‌نمایش</span>
					</button>
				)}
			</div>

			{/* Card body */}
			<div className="flex flex-col flex-1 px-3 py-2.5 gap-2">
				<p className="text-[12px] font-semibold text-base-content leading-snug truncate">
					{item.name}
				</p>

				<div className="flex items-center justify-between pt-2 mt-auto border-t border-base-content/5">
					<ItemPrice price={item.price} />

					{isOwned ? (
						<span className="text-[10px] text-success font-medium flex items-center gap-1">
							<FiCheck size={10} />
							خریداری‌شده
						</span>
					) : (
						<Button
							size="xs"
							onClick={handleBuy}
							className="h-6 px-2.5 rounded-lg text-[11px] font-medium bg-primary/90 text-white hover:bg-primary active:scale-95 transition-all"
						>
							<div className="flex items-center gap-1">
								<FiShoppingCart size={10} />
								<span>خرید</span>
							</div>
						</Button>
					)}
				</div>
			</div>
		</div>
	)
}
