import Analytics from '@/analytics'
import { Button, Modal } from '@/components/ui'
import { UserCoin } from '@/layouts/setting/tabs/account/components/user-coin'
import type { MarketItem } from '@/services/hooks/market/market.interface'
import { usePurchaseMarketItem } from '@/services/hooks/market/purchase-market-item.hook'
import { translateError } from '@/common/utils/translate-error'
import { showToast } from '@/common/toast'
import { RenderPreview } from './render-preview'

interface MarketItemPurchaseModalProps {
	isOpen: boolean
	onClose: (switchToCoins?: boolean) => void
	item: MarketItem | null
	onPurchaseSuccess: (item: MarketItem) => void
	userCoins: number
}

export function MarketItemPurchaseModal({
	isOpen,
	onClose,
	item,
	onPurchaseSuccess,
	userCoins,
}: MarketItemPurchaseModalProps) {
	const { mutate: purchaseItem, isPending } = usePurchaseMarketItem()

	if (!item) return null

	const canAfford = userCoins >= item.price

	const handlePurchase = () => {
		if (!canAfford) return

		purchaseItem(
			{ itemId: item.id },
			{
				onSuccess: (_response) => {
					showToast(`${item.name} برای همیشه خریداری شد`, 'success', {
						alarmSound: true,
					})
					Analytics.event('market_item_purchased')
					onPurchaseSuccess(item)
				},
				onError: (error) => {
					showToast(
						(translateError(error) as string) || 'خطا در خرید آیتم',
						'error'
					)
					Analytics.event('market_item_purchase_failed')
				},
			}
		)
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => onClose(false)}
			title=" "
			size="md"
			direction="rtl"
			closeOnBackdropClick={!isPending}
			showCloseButton={!isPending}
		>
			<div className="space-y-4">
				<div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-base-200/50 max-h-85">
					<RenderPreview item={item} handlePreviewClick={() => {}} />
				</div>

				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<h3 className="text-base font-semibold text-content">
							{item.name}
						</h3>
						{item.price > 0 && (
							<UserCoin coins={item.price} title="قیمت خرید دائمی" />
						)}
					</div>
					<p className="text-xs text-muted">
						{item.description ||
							'این آیتم را با ویج‌کوین باز کنید و برای همیشه از آن استفاده کنید'}
					</p>
				</div>

				{!canAfford && (
					<div className="flex items-center justify-between px-3 py-2 text-xs rounded-xl bg-error/10 text-error">
						<span>
							موجودی ویج‌کوین ناکافیه ({item.price - userCoins} ویج‌کوین کسری
							داری)
						</span>
						<button
							type="button"
							onClick={() => onClose(true)}
							className="font-medium underline cursor-pointer"
						>
							خرید ویج‌کوین
						</button>
					</div>
				)}

				<div className="flex gap-2.5 pt-2">
					<Button
						onClick={handlePurchase}
						size="md"
						disabled={!canAfford || isPending}
						loading={isPending}
						loadingText="در حال خرید..."
						className="flex-1"
						rounded="2xl"
						variant={canAfford ? 'primary' : 'default'}
					>
						خرید دائمی
					</Button>
					<Button
						onClick={() => onClose(false)}
						size="md"
						variant="default"
						rounded="2xl"
						disabled={isPending}
					>
						انصراف
					</Button>
				</div>
			</div>
		</Modal>
	)
}
