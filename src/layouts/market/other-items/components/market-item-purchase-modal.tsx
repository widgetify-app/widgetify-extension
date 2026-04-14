import { FiCheck, FiX } from 'react-icons/fi'
import Analytics from '@/analytics'
import { Button } from '@/components/button/button'
import { ItemPrice } from '@/components/item-price/item-price'
import Modal from '@/components/modal'
import { UserCoin } from '@/layouts/setting/tabs/account/components/user-coin'
import type { MarketItem } from '@/services/hooks/market/market.interface'
import { usePurchaseMarketItem } from '@/services/hooks/market/purchaseMarketItem.hook'
import { translateError } from '@/utils/translate-error'
import { showToast } from '@/common/toast'
import { RenderPreview } from './renderPreview'

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
	const remainingCoins = userCoins - item.price

	const handlePurchase = () => {
		if (!canAfford) return

		purchaseItem(
			{ itemId: item.id },
			{
				onSuccess: (_response) => {
					showToast(`${item.name} با موفقیت خریداری شد! 🎉`, 'success', {
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
			onClose={onClose}
			title="تایید خرید"
			size="md"
			direction="rtl"
			closeOnBackdropClick={!isPending}
			showCloseButton={!isPending}
		>
			<div className="space-y-4">
				<div className="px-2 py-1 border rounded-xl border-base-300 bg-content">
					<h3 className="text-lg font-semibold text-content">{item.name}</h3>
					<p className="mt-1 mb-1 text-xs text-muted">{item.description}</p>

					<RenderPreview item={item} handlePreviewClick={() => {}} />
				</div>

				<div className="p-3 space-y-2 border rounded-xl border-base-300 bg-base-100">
					<div className="flex items-center justify-between">
						<span className="text-sm text-content">موجودی فعلی:</span>
						<ItemPrice price={userCoins} />
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm text-content">قیمت آیتم:</span>
						<ItemPrice price={item.price} />
					</div>
					<hr className="border-primary/20" />
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium text-content">
							موجودی باقی‌مانده:
						</span>
						<ItemPrice
							price={canAfford ? Math.max(0, remainingCoins) : userCoins}
						/>
					</div>
				</div>

				{!canAfford && (
					<div className="p-3 border rounded-xl border-error/20 bg-error/5">
						<div className="flex items-start gap-2">
							<FiX className="w-5 h-5 mt-0.5 text-error flex-shrink-0" />
							<div>
								<p className="text-sm font-medium text-error">
									موجودی ناکافی
								</p>
								<p className="text-xs text-error/80">
									برای خرید این آیتم به {item.price - userCoins} ویج‌کوین
									بیشتر نیاز دارید
								</p>
							</div>
						</div>
					</div>
				)}
			</div>

			<div className="flex flex-col gap-1 pt-4">
				{!canAfford && (
					<div
						className="w-full text-center cursor-pointer text-muted rounded-xl btn-link hover:scale-95"
						onClick={() => onClose(true)}
					>
						خرید ویج‌کوین
					</div>
				)}
				<Button
					onClick={handlePurchase}
					size="md"
					disabled={!canAfford || isPending}
					loading={isPending}
					loadingText="در حال خرید..."
					className={`rounded-2xl ${
						canAfford
							? 'bg-primary hover:bg-primary/90 text-white'
							: 'bg-base-300 text-muted cursor-not-allowed'
					}`}
				>
					<FiCheck size={16} className="ml-1" />
					تایید خرید
				</Button>
			</div>
		</Modal>
	)
}
