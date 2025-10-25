import { BiSolidCoin } from 'react-icons/bi'
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
				{/* Wallpaper Preview */}
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

				{/* Description */}
				<div className="space-y-2">
					<h3 className="text-lg font-semibold text-content">
						{wallpaper.name || 'تصویر پس‌زمینه'}
					</h3>
					<p className="text-sm text-muted">
						با خرج چند تا سکه، این پس‌زمینه برات فعال می‌شه ✨
					</p>
					{wallpaper.coin && (
						<div className="flex items-center gap-2 text-warning">
							<BiSolidCoin />
							<span className="font-medium">{wallpaper.coin} سکه</span>
						</div>
					)}
				</div>

				{/* Action Buttons */}
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
						className="flex-1 text-white border-none bg-primary hover:bg-primary/90 rounded-2xl"
					>
						خرید ({wallpaper.coin} سکه)
					</Button>
				</div>
			</div>
		</Modal>
	)
}
