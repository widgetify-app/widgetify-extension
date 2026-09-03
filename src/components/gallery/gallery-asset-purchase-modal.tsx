import { Button, Modal } from '@/components/ui'
import { UserCoin } from '@/layouts/setting/tabs/account/components/user-coin'
import { callEvent } from '@/common/utils/call-event'
import { showToast } from '@/common/toast'
import type { GalleryAsset } from '@/services/hooks/gallery/get-gallery-assets.hook'
import { usePurchaseGalleryAsset } from '@/services/hooks/gallery/get-gallery-assets.hook'

interface GalleryAssetPurchaseModalProps {
	isOpen: boolean
	onClose: () => void
	asset: GalleryAsset | null
	userCoins: number
	isVip: boolean
	onPurchaseSuccess: (asset: GalleryAsset) => void
	onSelectDirectly?: (asset: GalleryAsset) => void
}

export function GalleryAssetPurchaseModal({
	isOpen,
	onClose,
	asset,
	userCoins,
	isVip,
	onPurchaseSuccess,
	onSelectDirectly,
}: GalleryAssetPurchaseModalProps) {
	const { mutate: purchase, isPending } = usePurchaseGalleryAsset()

	if (!asset) return null

	const isVipUnlocked = isVip && asset.accessVip
	const canAfford = userCoins >= asset.price

	const handlePurchase = () => {
		if (!canAfford) return

		purchase(asset.id, {
			onSuccess: (response) => {
				showToast(`${asset.title || 'آیتم'} برای همیشه خریداری شد`, 'success', {
					alarmSound: true,
				})
				const updatedAsset = response?.data?.asset || {
					...asset,
					isOwned: true,
					isUnlocked: true,
				}
				onPurchaseSuccess(updatedAsset)
			},
			onError: () => {
				showToast('خطا در دریافت آیتم', 'error')
			},
		})
	}

	const handleUseWithVip = () => {
		if (onSelectDirectly) {
			onSelectDirectly(asset)
		}
		onClose()
	}

	const handleOpenCoins = () => {
		onClose()
		callEvent('openMarketModal')
		setTimeout(() => {
			callEvent('market_change_tab', 'coins')
		}, 100)
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title=" "
			size="md"
			direction="rtl"
			closeOnBackdropClick={!isPending}
			showCloseButton={!isPending}
		>
			<div className="space-y-4">
				<div className="relative overflow-hidden rounded-2xl bg-base-200/50 max-h-[340px] flex items-center justify-center">
					<img
						src={asset.previewUrl || asset.url}
						alt={asset.title || 'Asset'}
						className="object-contain w-full max-h-[340px] rounded-2xl"
					/>
				</div>

				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<h3 className="text-base font-semibold text-content">
							{asset.title || 'تصویر گالری'}
						</h3>
						{asset.price > 0 && (
							<UserCoin
								coins={asset.price}
								title="قیمت خرید دائمی"
							/>
						)}
					</div>
					<p className="text-xs text-muted">
						{isVipUnlocked
							? 'چون اشتراک پرو داری می‌تونی این تصویر رو رایگان فعال کنی یا با ویج‌کوین دائمی بخریش'
							: 'این تصویر رو با ویج‌کوین باز کن و همیشه ازش استفاده کن'}
					</p>
				</div>

				{!isVipUnlocked && !canAfford && (
					<div className="flex items-center justify-between px-3 py-2 rounded-xl bg-error/10 text-error text-xs">
						<span>موجودی ویج‌کوین ناکافیه ({asset.price - userCoins} ویج‌کوین کسری داری)</span>
						<button
							type="button"
							onClick={handleOpenCoins}
							className="underline font-medium cursor-pointer"
						>
							خرید ویج‌کوین
						</button>
					</div>
				)}

				<div className="flex flex-col gap-2 pt-2">
					{isVipUnlocked ? (
						<div className="flex gap-2.5">
							<Button
								onClick={handleUseWithVip}
								size="md"
								className="flex-1"
								rounded="2xl"
								variant="primary"
							>
								استفاده رایگان با پرو
							</Button>
							{asset.price > 0 && (
								<Button
									onClick={handlePurchase}
									size="md"
									disabled={!canAfford || isPending}
									loading={isPending}
									loadingText="در حال خرید..."
									className="flex-1"
									rounded="2xl"
									variant="default"
								>
									خرید دائمی
								</Button>
							)}
						</div>
					) : (
						<div className="flex gap-2.5">
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
								onClick={onClose}
								size="md"
								variant="default"
								rounded="2xl"
								disabled={isPending}
							>
								انصراف
							</Button>
						</div>
					)}
				</div>
			</div>
		</Modal>
	)
}
