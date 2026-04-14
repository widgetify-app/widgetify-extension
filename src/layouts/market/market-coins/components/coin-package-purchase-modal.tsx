import { FiCheck } from 'react-icons/fi'
import Analytics from '@/analytics'
import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import { translateError } from '@/utils/translate-error'
import { showToast } from '@/common/toast'
import { ConfigKey } from '@/common/constant/config.key'
import type { CoinPackage } from '@/services/hooks/market/market-coins.interface'
import { usePurchaseCoinPackage } from '@/services/hooks/market/market-coints.hook'

interface CoinPackagePurchaseModalProps {
	isOpen: boolean
	onClose: () => void
	package: CoinPackage | null
	onPurchaseSuccess: () => void
}

const formatPrice = (price: number) => {
	return new Intl.NumberFormat('fa-IR').format(price)
}

export function CoinPackagePurchaseModal({
	isOpen,
	onClose,
	package: pkg,
	onPurchaseSuccess,
}: CoinPackagePurchaseModalProps) {
	const { mutate: purchasePackage, isPending } = usePurchaseCoinPackage()

	if (!pkg) return null

	const handlePurchase = () => {
		purchasePackage(
			{ packageId: pkg.id },
			{
				onSuccess: (_response) => {
					showToast('در حال انتقال ...', 'success')
					Analytics.event('coin_package_purchased')
					onPurchaseSuccess()
				},
				onError: (error) => {
					showToast(
						(translateError(error) as string) || 'خطا در خرید پکیج',
						'error'
					)
					Analytics.event('coin_package_purchase_failed')
				},
			}
		)
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="تایید خرید پکیج"
			size="md"
			direction="rtl"
			closeOnBackdropClick={!isPending}
			showCloseButton={!isPending}
		>
			<div className="space-y-4">
				<div className="px-4 py-3 border rounded-xl border-base-300 bg-content/50">
					<div className="flex items-start justify-between mb-3">
						<div>
							<h3 className="text-xl font-bold text-content">
								{pkg.title}
							</h3>
							<p className="mt-1 text-sm font-light text-muted">
								{pkg.description}
							</p>
						</div>
						<div className="flex items-center justify-center w-10 h-10 rounded-full bg-base-200">
							<img
								src={ConfigKey.WIG_COIN_ICON}
								alt="ویج‌کوین"
								className="relative w-10 h-10"
							/>
						</div>
					</div>

					<div className="p-4 border rounded-xl border-primary/10">
						<div className="flex items-center justify-center gap-2">
							<span className="text-3xl font-bold text-primary">
								{formatPrice(pkg.coin)}
							</span>
							<span className="text-sm text-muted">ویج‌کوین</span>
						</div>
					</div>
				</div>

				<div className="p-3 space-y-3 border rounded-xl border-primary/20 bg-primary/5">
					<div className="flex items-center justify-between">
						<span className="text-sm text-content">مبلغ قابل پرداخت:</span>
						<div className="flex items-baseline gap-1">
							<span className="text-2xl font-bold text-primary">
								{formatPrice(pkg.price)}
							</span>
							<span className="text-sm text-muted">تومان</span>
						</div>
					</div>

					<div className="pt-2 border-t border-primary/20">
						<p className="text-xs text-center text-muted">
							پس از تایید، به درگاه پرداخت منتقل می‌شوید
						</p>
					</div>
				</div>

				<div className="p-3 border rounded-xl border-info/20 bg-info/5">
					<p className="text-xs text-info/90">
						💡 سکه‌های خریداری شده بلافاصله پس از پرداخت موفق به حساب شما اضافه
						می‌شوند.
					</p>
				</div>
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
					disabled={isPending}
					loading={isPending}
					loadingText="در حال انتقال..."
					className="flex-1 text-white rounded-2xl bg-primary hover:bg-primary/90"
				>
					<FiCheck size={16} className="ml-1" />
					تایید و پرداخت
				</Button>
			</div>
		</Modal>
	)
}
