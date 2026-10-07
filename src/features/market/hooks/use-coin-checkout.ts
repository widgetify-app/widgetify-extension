import Analytics from '@/analytics'
import { showToast } from '@/common/toast'
import { translateError } from '@/common/utils/translate-error'
import type { CoinPackage } from '@/services/market/market-coins.interface'
import { usePurchaseCoinPackage } from '@/services/market/market-coins.hook'

export function useCoinCheckout() {
	const { mutate, isPending, variables } = usePurchaseCoinPackage()

	const checkout = (pkg: CoinPackage) => {
		mutate(
			{ packageId: pkg.id },
			{
				onSuccess: () => {
					showToast('داریم می‌ریم درگاه پرداخت...', 'success')
					Analytics.event('coin_package_purchased')
				},
				onError: (error) => {
					showToast(
						(translateError(error) as string) ||
							'درگاه پرداخت باز نشد، دوباره امتحان کن',
						'error'
					)
					Analytics.event('coin_package_purchase_failed')
				},
			}
		)
	}

	return { checkout, payingPackageId: isPending ? variables?.packageId : undefined }
}
