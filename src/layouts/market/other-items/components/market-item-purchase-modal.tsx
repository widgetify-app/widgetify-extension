import { FiCheck, FiX, FiAlertCircle } from 'react-icons/fi'
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
			<div className="space-y-3">
				<div className="rounded-2xl border border-base-300/60 overflow-hidden bg-base-100">
					<RenderPreview item={item} handlePreviewClick={() => {}} />
					<div className="px-3 py-2.5">
						<h3 className="text-sm font-semibold text-content">{item.name}</h3>
						{item.description && (
							<p className="mt-0.5 text-xs text-muted">{item.description}</p>
						)}
					</div>
				</div>

				<div className="rounded-2xl border border-base-300/60 bg-base-100 divide-y divide-base-200/60">
					<div className="flex items-center justify-between px-3 py-2.5">
						<span className="text-xs text-muted">موجودی فعلی</span>
						<ItemPrice price={userCoins} />
					</div>
					<div className="flex items-center justify-between px-3 py-2.5">
						<span className="text-xs text-muted">قیمت آیتم</span>
						<ItemPrice price={item.price} />
					</div>
					<div className="flex items-center justify-between px-3 py-2.5">
						<span className="text-xs font-medium text-content">موجودی باقی‌مانده</span>
						<ItemPrice
							price={canAfford ? Math.max(0, remainingCoins) : userCoins}
						/>
					</div>
				</div>

				{!canAfford && (
					<div className="flex items-start gap-2.5 px-3 py-2.5 rounded-2xl border border-error/20 bg-error/5">
						<FiAlertCircle className="w-4 h-4 mt-0.5 text-error flex-shrink-0" />
						<div>
							<p className="text-xs font-medium text-error">موجودی ناکافی</p>
							<p className="text-[11px] text-error/75 mt-0.5">
								برای خرید این آیتم به {item.price - userCoins} ویج‌کوین بیشتر نیاز دارید
							</p>
						</div>
					</div>
				)}

				<div className="flex flex-col gap-2 pt-1">
					{!canAfford && (
						<button
							className="w-full text-center text-xs text-muted hover:text-primary transition-colors py-1 cursor-pointer"
							onClick={() => onClose(true)}
						>
							خرید ویج‌کوین
						</button>
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
						<FiCheck size={15} className="ml-1" />
						تایید خرید
					</Button>
				</div>
			</div>
		</Modal>
	)
}
