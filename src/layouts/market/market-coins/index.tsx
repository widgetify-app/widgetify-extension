import { useState } from 'react'
import Analytics from '@/analytics'
import { Pagination } from '@/components/pagination'
import { useAuth } from '@/context/auth.context'
import { CoinPackageCard } from './components/coin-package-card'
import { CoinPackagePurchaseModal } from './components/coin-package-purchase-modal'
import { showToast } from '@/common/toast'
import { FaCoins } from 'react-icons/fa'
import { CoinPackage } from '@/services/hooks/market/market-coins.interface'
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

	const onNextPage = () => {
		setCurrentPage(currentPage + 1)
		Analytics.event('market_coins_next_page')
	}

	const onPrevPage = () => {
		setCurrentPage(currentPage - 1)
		Analytics.event('market_coins_prev_page')
	}

	return (
		<>
			{isLoading ? (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
					{Array.from({ length: 8 }).map((_, index) => (
						<div
							key={index}
							className="h-64 rounded-2xl border border-base-300/60 bg-base-100 overflow-hidden"
						>
							<div className="h-44 bg-base-200 animate-pulse" />
							<div className="p-3 space-y-2">
								<div className="w-2/3 h-3.5 rounded-lg bg-base-200 animate-pulse" />
								<div className="w-full h-7 rounded-lg bg-base-200 animate-pulse" />
							</div>
						</div>
					))}
				</div>
			) : packagesData?.packages && packagesData.packages.length > 0 ? (
				<div className="grid grid-cols-2 gap-3 pb-10 sm:grid-cols-3 lg:grid-cols-4">
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
				<div className="flex flex-col items-center justify-center h-64 text-center gap-3">
					<div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center">
						<FaCoins size={20} className="text-muted" />
					</div>
					<div>
						<p className="text-sm font-medium text-content">فعلا چیزی واسه خرید نیست!</p>
						<p className="text-xs text-muted mt-1">بعداً دوباره بررسی کنید</p>
					</div>
				</div>
			)}

			<Pagination
				currentPage={currentPage}
				totalPages={packagesData?.totalPages || 1}
				onNextPage={onNextPage}
				onPrevPage={onPrevPage}
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
