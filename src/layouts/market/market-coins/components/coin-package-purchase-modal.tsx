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
			<div className="space-y-3">
				<div className="rounded-2xl border border-base-300/60 overflow-hidden bg-base-100">
					<div className="flex items-center justify-center py-8 bg-base-200/40">
						<div className="flex flex-col items-center gap-2">
							<img
								src={ConfigKey.WIG_COIN_ICON}
								alt="ویج‌کوین"
								className="w-14 h-14"
							/>
							<div className="flex items-baseline gap-1.5">
								<span className="text-4xl font-bold text-primary tabular-nums">
									{formatPrice(pkg.coin)}
								</span>
								<span className="text-sm text-muted">ویج‌کوین</span>
							</div>
						</div>
					</div>
					<div className="px-3 py-2.5">
						<h3 className="text-sm font-semibold text-content">{pkg.title}</h3>
						{pkg.description && (
							<p className="mt-0.5 text-xs text-muted">{pkg.description}</p>
						)}
					</div>
				</div>

				<div className="rounded-2xl border border-base-300/60 bg-base-100 divide-y divide-base-200/60">
					<div className="flex items-center justify-between px-3 py-3">
						<span className="text-xs text-muted">مبلغ قابل پرداخت</span>
						<div className="flex items-baseline gap-1">
							<span className="text-lg font-bold text-content tabular-nums">
								{formatPrice(pkg.price)}
							</span>
							<span className="text-xs text-muted">تومان</span>
						</div>
					</div>
					<div className="px-3 py-2.5">
						<p className="text-[11px] text-center text-muted">
							پس از تایید، به درگاه پرداخت منتقل می‌شوید
						</p>
					</div>
				</div>

				<div className="px-3 py-2.5 rounded-2xl border border-info/20 bg-info/5">
					<p className="text-[11px] text-info/85">
						💡 سکه‌های خریداری شده بلافاصله پس از پرداخت موفق به حساب شما اضافه می‌شوند.
					</p>
				</div>

				<div className="flex gap-2 pt-1">
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
						<FiCheck size={15} className="ml-1" />
						تایید و پرداخت
					</Button>
				</div>
			</div>
		</Modal>
	)
}
