import { useState } from 'react'
import Analytics from '@/analytics'
import { Pagination } from '@/components/pagination'
import { useAuth } from '@/context/auth.context'
import { CoinPackageCard } from './components/coin-package-card'
import { CoinPackagePurchaseModal } from './components/coin-package-purchase-modal'
import { showToast } from '@/common/toast'
import { FaCoins } from 'react-icons/fa'
import type { CoinPackage } from '@/services/hooks/market/market-coins.interface'
import { useGetCoinPackages } from '@/services/hooks/market/market-coints.hook'

export function MarketCoins() {
	const { isAuthenticated, refetchUser } = useAuth()
	const [currentPage, setCurrentPage] = useState(1)
	const [selectedPackage, setSelectedPackage] = useState<CoinPackage | null>(null)
	const [showPurchaseModal, setShowPurchaseModal] = useState(false)

	const {
		data: packagesData,
		isLoading,
		refetch,
	} = useGetCoinPackages({
		limit: 12,
		page: currentPage,
	})

	const handlePurchaseClick = (pkg: CoinPackage) => {
		if (!isAuthenticated) {
			Analytics.event('coin_package_purchase_unauthenticated')
			showToast('برای خرید پکیج باید وارد حساب کاربری خود شوید.', 'error')
			return
		}
		setSelectedPackage(pkg)
		setShowPurchaseModal(true)
	}

	const handlePurchaseSuccess = () => {
		setShowPurchaseModal(false)
		setSelectedPackage(null)
		refetchUser()
		refetch()
	}

	return (
		<>
			{isLoading ? (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
					{Array.from({ length: 8 }).map((_, i) => (
						<div
							key={i}
							className="overflow-hidden border rounded-2xl border-base-content/8 bg-base-100/60"
						>
							<div className="h-28 skeleton opacity-40" />
							<div className="p-3 space-y-2">
								<div className="w-3/5 h-3 rounded-lg skeleton opacity-30" />
								<div className="flex items-center justify-between pt-2 border-t border-base-content/5">
									<div className="w-12 h-3 rounded-lg skeleton opacity-20" />
									<div className="w-12 h-6 rounded-lg skeleton opacity-20" />
								</div>
							</div>
						</div>
					))}
				</div>
			) : packagesData?.packages?.length ? (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
					{packagesData.packages.map((pkg) => (
						<CoinPackageCard
							key={pkg.id}
							package={pkg}
							onPurchase={() => handlePurchaseClick(pkg)}
							isAuthenticated={isAuthenticated}
						/>
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center h-48 gap-3">
					<div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-base-200/60">
						<FaCoins size={20} className="text-base-content/20" />
					</div>
					<p className="text-xs text-base-content/40">
						فعلا چیزی برای خرید نیست
					</p>
				</div>
			)}

			<Pagination
				currentPage={currentPage}
				totalPages={packagesData?.totalPages || 1}
				onNextPage={() => {
					setCurrentPage((p) => p + 1)
					Analytics.event('market_coins_next_page')
				}}
				onPrevPage={() => {
					setCurrentPage((p) => p - 1)
					Analytics.event('market_coins_prev_page')
				}}
				isLoading={isLoading}
			/>

			<CoinPackagePurchaseModal
				isOpen={showPurchaseModal}
				onClose={() => setShowPurchaseModal(false)}
				package={selectedPackage}
				onPurchaseSuccess={handlePurchaseSuccess}
			/>
		</>
	)
}
