import Analytics from '@/analytics'
import { Button, Modal } from '@/components/ui'
import { translateError } from '@/common/utils/translate-error'
import { showToast } from '@/common/toast'
import { ConfigKey } from '@/common/constants/config.key'
import type { CoinPackage } from '@/services/hooks/market/market-coins.interface'
import { usePurchaseCoinPackage } from '@/services/hooks/market/market-coins.hook'
import { Icon } from '@/icons'

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
				<div className="overflow-hidden border rounded-2xl border-ds-surface-3 bg-ds-surface">
					<div className="flex items-center justify-center py-8 bg-ds-fill">
						<div className="flex flex-col items-center gap-2">
							<img
								src={ConfigKey.WIG_COIN_ICON}
								alt="ویج‌کوین"
								className="w-14 h-14"
							/>
							<div className="flex items-baseline gap-1.5">
								<span className="text-4xl font-bold text-ds-brand tabular-nums">
									{formatPrice(pkg.coin)}
								</span>
								<span className="text-sm text-ds-fg-muted">ویج‌کوین</span>
							</div>
						</div>
					</div>
					<div className="px-3 py-2.5">
						<h3 className="text-sm font-semibold text-ds-fg">
							{pkg.title}
						</h3>
						{pkg.description && (
							<p className="mt-0.5 text-xs text-ds-fg-muted">{pkg.description}</p>
						)}
					</div>
				</div>

				<div className="border divide-y rounded-2xl border-ds-surface-3 bg-ds-surface divide-content">
					<div className="flex items-center justify-between px-3 py-3">
						<span className="text-xs text-ds-fg-muted">مبلغ قابل پرداخت</span>
						<div className="flex items-baseline gap-1">
							<span className="text-lg font-bold text-ds-fg tabular-nums">
								{formatPrice(pkg.price)}
							</span>
							<span className="text-xs text-ds-fg-muted">تومان</span>
						</div>
					</div>
					<div className="px-3 py-2.5">
						<p className="text-[11px] text-center text-ds-fg-muted">
							پس از تایید، به درگاه پرداخت منتقل می‌شوید
						</p>
					</div>
				</div>

				<div className="px-3 py-2.5 rounded-2xl border border-info-muted bg-ds-info-fill">
					<p className="text-[11px] text-info-hover">
						💡 سکه‌های خریداری شده بلافاصله پس از پرداخت موفق به حساب شما اضافه
						می‌شوند.
					</p>
				</div>

				<div className="flex gap-2 pt-1">
					<Button
						onClick={onClose}
						size="md"
						disabled={isPending}
						className="flex-1"
						rounded={'2xl'}
					>
						لغو
					</Button>
					<Button
						onClick={handlePurchase}
						size="md"
						disabled={isPending}
						loading={isPending}
						loadingText="در حال انتقال..."
						className="flex-1"
						color={'primary'}
						rounded={'2xl'}
					>
						<Icon name="check" size={15} className="ml-1" />
						تایید و پرداخت
					</Button>
				</div>
			</div>
		</Modal>
	)
}
