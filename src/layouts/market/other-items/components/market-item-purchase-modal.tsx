import toast from 'react-hot-toast'
import { FiCheck, FiX } from 'react-icons/fi'
import Analytics from '@/analytics'
import { Button } from '@/components/button/button'
import { ItemPrice } from '@/components/item-price/item-price'
import { getItemTypeEmoji } from '@/components/market/getItemTypeEmoji'
import { renderBrowserTitlePreview } from '@/components/market/title/title-render-preview'
import Modal from '@/components/modal'
import { UserCoin } from '@/layouts/setting/tabs/account/components/user-coin'
import type { MarketItem } from '@/services/hooks/market/market.interface'
import { usePurchaseMarketItem } from '@/services/hooks/market/purchaseMarketItem.hook'
import { translateError } from '@/utils/translate-error'

interface MarketItemPurchaseModalProps {
	isOpen: boolean
	onClose: () => void
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
					toast.success(`${item.name} با موفقیت خریداری شد! 🎉`, {
						duration: 5000,
						style: { maxWidth: '400px', fontFamily: 'inherit' },
						className: '!bg-success !text-success-content !font-bold',
					})
					Analytics.event('market_item_purchased')
					onPurchaseSuccess(item)
				},
				onError: (error) => {
					toast.error((translateError(error) as string) || 'خطا در خرید آیتم', {
						duration: 8000,
						style: { maxWidth: '400px', fontFamily: 'inherit' },
						className: '!bg-error !text-error-content !font-bold',
					})
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
				<div className="px-2 py-1 border rounded-xl border-base-300 bg-content/50">
					<h3 className="text-lg font-semibold text-content">{item.name}</h3>
					<p className="mt-1 mb-1 text-xs text-muted">{item.description}</p>

					{/* Item preview */}
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
						</div>
					) : (
						<div className="flex items-center justify-center flex-1 border border-dashed bg-base-100 rounded-xl border-base-300">
							<span className="text-2xl opacity-50">
								{getItemTypeEmoji(item.type)}
							</span>
						</div>
					)}
				</div>

				<div className="p-3 space-y-2 border rounded-xl border-primary/20 bg-primary/5">
					<div className="flex items-center justify-between">
						<span className="text-sm text-content">موجودی فعلی:</span>
						<UserCoin coins={userCoins} />
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
						<UserCoin coins={Math.max(0, remainingCoins)} />
					</div>
				</div>

				{!canAfford && (
					<div className="p-3 border rounded-xl border-warning/20 bg-warning/5">
						<div className="flex items-start gap-2">
							<FiX className="w-5 h-5 mt-0.5 text-warning flex-shrink-0" />
							<div>
								<p className="text-sm font-medium text-warning">
									موجودی ناکافی
								</p>
								<p className="text-xs text-warning/80">
									برای خرید این آیتم به {item.price - userCoins} ویج‌کوین
									بیشتر نیاز دارید
								</p>
							</div>
						</div>
					</div>
				)}
			</div>

			<div className="flex gap-3 pt-4">
				<Button
					onClick={onClose}
					size="md"
					disabled={isPending}
					className="flex-1 rounded-2xl border-muted hover:bg-muted/50 text-content"
				>
					لغو
				</Button>
				<Button
					onClick={handlePurchase}
					size="md"
					disabled={!canAfford || isPending}
					loading={isPending}
					loadingText="در حال خرید..."
					className={`flex-1 rounded-2xl ${
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
