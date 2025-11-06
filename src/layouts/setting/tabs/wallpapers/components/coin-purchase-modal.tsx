import { callEvent } from '@/common/utils/call-event'
import type { Wallpaper } from '@/common/wallpaper.interface'
import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import { useAuth } from '@/context/auth.context'
import { UserCoin } from '@/layouts/setting/tabs/account/components/user-coin'

interface CoinPurchaseModalProps {
	isOpen: boolean
	onClose: () => void
	wallpaper: Wallpaper | null
	onBuy: () => void
	isBuying?: boolean
}

export function CoinPurchaseModal({
	isOpen,
	onClose,
	wallpaper,
	onBuy,
	isBuying = false,
}: CoinPurchaseModalProps) {
	const { isAuthenticated } = useAuth()
	if (!wallpaper) return null

	const onLogin = () => {
		onClose()
		callEvent('openProfile')
	}

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

				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold text-content">
							{wallpaper.name || 'تصویر تصویر زمینه'}
						</h3>
						<UserCoin
							coins={wallpaper.coin || 0}
							title="قیمت این تصویر زمینه"
						/>
					</div>
					<p className="text-sm text-muted">
						این تصویر زمینه زیبا را با ویج‌کوین باز کنید و برای همیشه استفاده
						کنید! 🎨
					</p>
					<div className="flex items-center gap-2 p-3 border rounded-xl bg-primary/5 border-primary/20 backdrop-blur-sm">
						<span className="text-sm">💡</span>
						<p className="text-xs text-primary/80">
							ویج‌کوین با انجام فعالیت‌ها و دعوت دوستان کسب می‌شود
						</p>
					</div>
				</div>

				<div className="flex gap-3 pt-4">
					{isAuthenticated ? (
						<>
							<Button
								onClick={onClose}
								size="md"
								className="flex-1 text-content border-muted hover:bg-muted/50 rounded-2xl"
							>
								لغو
							</Button>
							<Button
								onClick={onBuy}
								size="md"
								disabled={isBuying}
								loading={isBuying}
								loadingText="در حال باز کردن..."
								className="flex-1 text-white transition-all duration-200 border-none shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-2xl"
							>
								🔓 باز کردن
							</Button>
						</>
					) : (
						<Button
							size="md"
							onClick={onLogin}
							className="flex-1 text-white transition-all duration-200 border-none shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-2xl"
						>
							ورود به حساب کاربری
						</Button>
					)}
				</div>
			</div>
		</Modal>
	)
}
