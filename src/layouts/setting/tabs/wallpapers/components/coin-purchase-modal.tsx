import type { Wallpaper } from '@/common/wallpaper.interface'
import { Button } from '@/components/button/button'
import Modal from '@/components/modal'

interface CoinPurchaseModalProps {
	isOpen: boolean
	onClose: () => void
	wallpaper: Wallpaper | null
	onBuy: () => void
	onPreview: () => void
	isBuying?: boolean
}

export function CoinPurchaseModal({
	isOpen,
	onClose,
	wallpaper,
	onBuy,
	onPreview,
	isBuying = false,
}: CoinPurchaseModalProps) {
	if (!wallpaper) return null

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="md"
			direction="rtl"
			closeOnBackdropClick={!isBuying}
			showCloseButton={!isBuying}
			title=" "
		>
			<div className="space-y-4">
				<div className="relative overflow-hidden rounded-lg aspect-video">
					{wallpaper.type === 'IMAGE' ? (
						<img
							src={wallpaper.previewSrc}
							alt={wallpaper.name || 'Wallpaper'}
							className="object-cover w-full h-full rounded"
						/>
					) : (
						<video
							src={wallpaper.src}
							className="object-cover w-full h-full"
							loop
							muted
							playsInline
							autoPlay
						/>
					)}
				</div>

				<div className="space-y-2">
					<h3 className="text-lg font-semibold text-content">
						{wallpaper.name || 'تصویر پس‌زمینه'}
					</h3>
					<p className="text-sm text-muted">
						این پس‌زمینه را با پرداخت {wallpaper.coin} سکه برای همیشه فعال
						کنید! ✨
					</p>
				</div>

				<div className="flex gap-3 pt-2">
					<Button
						onClick={onPreview}
						size="md"
						disabled={isBuying}
						className="flex-1 border border-content/20 text-content hover:bg-base-300/50 rounded-2xl"
					>
						پیش‌نمایش
					</Button>
					<Button
						onClick={onBuy}
						size="md"
						disabled={isBuying}
						loading={isBuying}
						loadingText="در حال خرید..."
						className="flex-1 text-gray-100 border-none bg-primary hover:bg-primary/90 rounded-2xl"
					>
						پرداخت سکه
					</Button>
				</div>
			</div>
		</Modal>
	)
}
