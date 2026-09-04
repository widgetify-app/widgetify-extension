import { callEvent } from '@/common/utils/call-event'
import type { Wallpaper } from '@/common/wallpaper.interface'
import { Button, Modal } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { UserCoin } from '@/layouts/setting/tabs/account/components/user-coin'
import { HoverPlayVideo } from '../tab/gallery/components/hover-play-video'

interface CoinPurchaseModalProps {
	isOpen: boolean
	onClose: () => void
	wallpaper: Wallpaper | null
	onPurchase: () => void
	isPurchasing?: boolean
}

export function CoinPurchaseModal({
	isOpen,
	onClose,
	wallpaper,
	onPurchase,
	isPurchasing = false,
}: CoinPurchaseModalProps) {
	const { isAuthenticated, user } = useAuth()
	if (!wallpaper) return null

	const userCoins = user?.coins || 0
	const wallpaperPrice = wallpaper.coin || 0
	const canAfford = userCoins >= wallpaperPrice

	const onLogin = () => {
		onClose()
		callEvent('openProfile')
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
			direction="rtl"
			closeOnBackdropClick={!isPurchasing}
			showCloseButton={!isPurchasing}
			title=" "
		>
			<div className="space-y-4">
				<div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-base-200/50 aspect-video">
					{wallpaper.type === 'IMAGE' ? (
						<img
							src={wallpaper.previewSrc}
							alt={wallpaper.name || 'Wallpaper'}
							className="object-cover w-full h-full rounded-2xl"
						/>
					) : (
						<HoverPlayVideo
							videoSrc={
								wallpaper.previewVideoSrc ||
								wallpaper.src ||
								wallpaper.previewSrc
							}
							posterSrc={wallpaper.previewSrc}
							className="object-cover w-full h-full rounded-2xl"
							onClick={(e) => {
								e.stopPropagation()
							}}
						/>
					)}
				</div>

				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<h3 className="text-base font-semibold text-content">
							{wallpaper.name || 'تصویر زمینه'}
						</h3>
						{wallpaperPrice > 0 && (
							<UserCoin coins={wallpaperPrice} title="قیمت خرید دائمی" />
						)}
					</div>
					<p className="text-xs text-muted">
						این تصویر زمینه را با ویج‌کوین باز کنید و برای همیشه از آن استفاده
						کنید
					</p>
				</div>

				{isAuthenticated && !canAfford && wallpaperPrice > 0 && (
					<div className="flex items-center justify-between px-3 py-2 text-xs rounded-xl bg-error/10 text-error">
						<span>
							موجودی ویج‌کوین ناکافیه ({wallpaperPrice - userCoins} ویج‌کوین
							کسری داری)
						</span>
						<button
							type="button"
							onClick={handleOpenCoins}
							className="font-medium underline cursor-pointer"
						>
							خرید ویج‌کوین
						</button>
					</div>
				)}

				<div className="flex gap-2.5 pt-2">
					{isAuthenticated ? (
						<>
							<Button
								onClick={onPurchase}
								size="md"
								disabled={
									isPurchasing || (!canAfford && wallpaperPrice > 0)
								}
								loading={isPurchasing}
								loadingText="در حال خرید..."
								className="flex-1"
								rounded="2xl"
								variant={
									canAfford || wallpaperPrice === 0
										? 'primary'
										: 'default'
								}
							>
								خرید دائمی
							</Button>
							<Button
								onClick={onClose}
								size="md"
								className="flex-1"
								variant="default"
								rounded="2xl"
								disabled={isPurchasing}
							>
								انصراف
							</Button>
						</>
					) : (
						<Button
							size="md"
							onClick={onLogin}
							className="w-full"
							variant="primary"
							rounded="2xl"
						>
							ورود به حساب کاربری
						</Button>
					)}
				</div>
			</div>
		</Modal>
	)
}
