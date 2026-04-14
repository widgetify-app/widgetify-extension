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
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
					{Array.from({ length: 8 }).map((_, index) => (
						<div
							key={index}
							className="p-4 border rounded-2xl border-base-300 bg-base-200/20"
						>
							<div className="w-full h-32 mb-4 rounded-xl skeleton" />
							<div className="w-2/3 h-5 mb-2 rounded skeleton" />
							<div className="w-full h-3 mb-4 rounded bg-base-300/50 skeleton" />
							<div className="h-10 rounded-xl skeleton" />
						</div>
					))}
				</div>
			) : packagesData?.packages && packagesData.packages.length > 0 ? (
				<div className="grid grid-cols-1 gap-4 pb-10 sm:grid-cols-2 lg:grid-cols-4">
					{packagesData.packages.map((pkg) => (
						<div key={pkg.id} className="transition-transform duration-300">
							<CoinPackageCard
								package={pkg}
								onPurchase={() => handlePurchaseClick(pkg)}
								isAuthenticated={isAuthenticated}
							/>
						</div>
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center h-64 text-center">
					<p className="text-lg font-medium text-content">
						فعلا چیزی واسه خرید نیست! 😢
					</p>
					<p className="text-sm text-muted">بعداً دوباره بررسی کنید</p>
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
