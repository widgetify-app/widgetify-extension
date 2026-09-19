import { ItemPrice } from './item-price'
import { getItemTypeEmoji } from './get-item-type-emoji'
import { type MarketItem, MarketItemType } from '@/services/hooks/market/market.interface'
import { showToast } from '@/common/toast'
import { RenderPreview } from './render-preview'
import { Icon } from '@/icons'
import { Button } from '@/components/ui'

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
		<div className="flex flex-col overflow-hidden transition-all duration-200 border bg-widget-strong rounded-2xl border-subtle hover:border-brand-muted hover:shadow-sm group">
			{/* Preview area */}
			<div className="relative overflow-hidden bg-content-subtle flex-shrink-0 min-h-[80px]">
				<RenderPreview
					item={item}
					handlePreviewClick={() => {
						if (item.previewUrl) window.open(item.previewUrl, '_blank')
					}}
				/>

				{/* Type badge */}
				<div className="absolute top-2 right-2">
					<span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-widget-strong backdrop-blur-sm border border-subtle text-[9px] text-subtle font-medium">
						{getItemTypeEmoji(item.type)}{' '}
						{TYPE_LABELS[item.type] || item.type}
					</span>
				</div>

				{!canPreview && (
					<button
						onClick={handlePreview}
						className="absolute bottom-1.5 left-1.5 flex items-center gap-1 px-2 py-1 rounded-lg bg-widget-strong border border-subtle text-muted hover:text-primary transition-colors text-[10px] font-medium backdrop-blur-sm cursor-pointer opacity-0 group-hover:opacity-100"
					>
						<Icon name="outlineEye" size={10} />
						<span>پیش‌نمایش</span>
					</button>
				)}
			</div>

			{/* Card body */}
			<div className="flex flex-col flex-1 px-3 py-2.5 gap-2">
				<p className="text-[12px] font-semibold text-strong leading-snug truncate">
					{item.name}
				</p>

				<div className="flex items-center justify-between pt-2 mt-auto border-t border-faint">
					<ItemPrice price={item.price} />

					{isOwned ? (
						<span className="text-[10px] text-success font-medium flex items-center gap-1">
							<Icon name="check" size={10} />
							خریداری‌شده
						</span>
					) : (
						<Button
							size="xs"
							onClick={handleBuy}
							rounded={'lg'}
							color={'primary'}
							className="h-6 px-2.5 rounded-lg text-[11px] active:scale-95 transition-all"
						>
							<div className="flex items-center gap-1">
								<Icon name="shoppingCart" size={10} />
								<span>خرید</span>
							</div>
						</Button>
					)}
				</div>
			</div>
		</div>
	)
}
