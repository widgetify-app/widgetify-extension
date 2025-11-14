import { useState } from 'react'
import { FiShoppingBag } from 'react-icons/fi'
import { useAuth } from '@/context/auth.context'
import { useGetMarketItems } from '@/services/hooks/market/getMarketItems.hook'
import type { MarketItem } from '@/services/hooks/market/market.interface'
import { MarketItemCard } from './components/market-item-card'
import { MarketItemPurchaseModal } from './components/market-item-purchase-modal'

export function MarketOtherItems() {
	const { user, isAuthenticated } = useAuth()
	const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null)
	const [showPurchaseModal, setShowPurchaseModal] = useState(false)

	const {
		data: marketData,
		isLoading,
		error,
	} = useGetMarketItems(true, {
		limit: 20,
	})

	const filteredItems = marketData?.items || []

	const handlePurchaseClick = (item: MarketItem) => {
		setSelectedItem(item)
		setShowPurchaseModal(true)
	}

	const handlePurchaseSuccess = () => {
		setShowPurchaseModal(false)
		setSelectedItem(null)
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-64 text-center">
				<FiShoppingBag size={48} className="mb-4 text-muted" />
				<p className="text-lg font-medium text-content">
					خطا در بارگذاری آیتم‌های مارکت
				</p>
				<p className="text-sm text-muted">لطفاً دوباره تلاش کنید</p>
			</div>
		)
	}

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, index) => (
					<div
						key={index}
						className="p-4 border rounded-xl border-base-300 animate-pulse"
					>
						<div className="h-4 mb-3 rounded bg-base-300"></div>
						<div className="h-3 mb-2 rounded bg-base-300"></div>
						<div className="h-8 rounded bg-base-300"></div>
					</div>
				))}
			</div>
		)
	}

	return (
		<>
			{filteredItems.length > 0 ? (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{filteredItems.map((item) => (
						<MarketItemCard
							key={item.id}
							item={item}
							onPurchase={() => handlePurchaseClick(item)}
							isAuthenticated={isAuthenticated}
						/>
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center h-64 text-center">
					<FiShoppingBag size={48} className="mb-4 text-muted" />
					<p className="text-lg font-medium text-content">
						آیتمی برای نمایش وجود ندارد
					</p>
					<p className="text-sm text-muted">بعداً دوباره بررسی کنید</p>
				</div>
			)}

			{/* Purchase Modal */}
			<MarketItemPurchaseModal
				isOpen={showPurchaseModal}
				onClose={() => setShowPurchaseModal(false)}
				item={selectedItem}
				onPurchaseSuccess={handlePurchaseSuccess}
				userCoins={user?.coins || 0}
			/>
		</>
	)
}
