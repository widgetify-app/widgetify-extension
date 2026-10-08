import { Alert, Button, Modal } from '@/components/ui'
import { UserCoin } from '@/components/user-coin'
import { callEvent } from '@/common/utils/call-event'
import { showToast } from '@/common/toast'
import { t } from '@/common/i18n'
import type { GalleryAsset } from '@/services/gallery/get-gallery-assets.hook'
import { usePurchaseGalleryAsset } from '@/services/gallery/get-gallery-assets.hook'

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
				showToast(
					t('gallery.purchase.owned', {
						name: asset.title || t('gallery.purchase.itemFallback'),
					}),
					'success'
				)
				const updatedAsset = response?.data?.asset || {
					...asset,
					isOwned: true,
					isUnlocked: true,
				}
				onPurchaseSuccess(updatedAsset)
			},
			onError: () => {
				showToast(t('gallery.purchase.fetchFailed'), 'error')
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
			size="md"
			dismissible={!isPending}
			closeLabel={t('ui.common.close')}
		>
			<div className="space-y-4">
				<div className="relative overflow-hidden rounded-2xl bg-fill-2 max-h-[340px] flex items-center justify-center">
					<img
						src={asset.previewUrl || asset.url}
						alt={asset.title || 'Asset'}
						className="object-contain w-full max-h-[340px] rounded-2xl"
					/>
				</div>

				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<h3 className="text-base font-semibold text-fg">
							{asset.title || t('gallery.purchase.imageAlt')}
						</h3>
						{asset.price > 0 && (
							<UserCoin
								coins={asset.price}
								title={t('gallery.purchase.permanentPrice')}
							/>
						)}
					</div>
					<p className="text-xs text-fg-muted">
						{isVipUnlocked
							? t('gallery.purchase.vipHint')
							: t('gallery.purchase.buyHint')}
					</p>
				</div>

				{!isVipUnlocked && !canAfford && (
					<Alert
						tone="danger"
						action={
							<button
								type="button"
								onClick={handleOpenCoins}
								className="font-medium underline cursor-pointer"
							>
								{t('gallery.purchase.buyCoins')}
							</button>
						}
					>
						{t('gallery.purchase.coinsShort', {
							count: asset.price - userCoins,
						})}
					</Alert>
				)}

				<div className="flex flex-col gap-2 pt-2">
					{isVipUnlocked ? (
						<div className="flex gap-2.5">
							<Button
								onClick={handleUseWithVip}
								size="md"
								className="flex-1"
								rounded="2xl"
								color="brand"
							>
								{t('gallery.purchase.freeWithPro')}
							</Button>
							{asset.price > 0 && (
								<Button
									onClick={handlePurchase}
									size="md"
									disabled={!canAfford || isPending}
									loading={isPending}
									loadingText={t('gallery.purchase.buying')}
									className="flex-1"
									rounded="2xl"
								>
									{t('gallery.purchase.buyPermanent')}
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
								loadingText={t('gallery.purchase.buying')}
								className="flex-1"
								rounded="2xl"
								color={canAfford ? 'brand' : 'base'}
							>
								{t('gallery.purchase.buyPermanent')}
							</Button>
							<Button
								onClick={onClose}
								size="md"
								rounded="2xl"
								disabled={isPending}
							>
								{t('gallery.purchase.cancel')}
							</Button>
						</div>
					)}
				</div>
			</div>
		</Modal>
	)
}
