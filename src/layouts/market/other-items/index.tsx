import { useState } from 'react'
import { FiShoppingBag } from 'react-icons/fi'
import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { Pagination } from '@/components/pagination'
import { useAuth } from '@/context/auth.context'
import type { Theme } from '@/context/theme.context'
import { useGetMarketItems } from '@/services/hooks/market/getMarketItems.hook'
import type { MarketItem } from '@/services/hooks/market/market.interface'
import { MarketItemCard } from './components/market-item-card'
import { MarketItemPurchaseModal } from './components/market-item-purchase-modal'

export function MarketOtherItems() {
	const { user, isAuthenticated, refetchUser } = useAuth()
	const [currentPage, setCurrentPage] = useState(1)
	const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null)
	const [showPurchaseModal, setShowPurchaseModal] = useState(false)

	const {
		data: marketData,
		isLoading,
		error,
		refetch,
	} = useGetMarketItems(true, {
		limit: 12,
		page: currentPage,
	})

	const filteredItems = marketData?.items || []

	const handlePurchaseClick = (item: MarketItem) => {
		setSelectedItem(item)
		setShowPurchaseModal(true)
	}

	const handlePurchaseSuccess = (item: MarketItem) => {
		setShowPurchaseModal(false)
		setSelectedItem(null)
		refetchUser()
		refetch()

		if (item.type === 'BROWSER_TITLE') {
			callEvent('browser_title_change', {
				id: item.id,
				name: item.name,
				template: item.itemValue as string,
			})
		}
		if (item.type === 'THEME') {
			callEvent('theme_change', item.itemValue as Theme)
		}
	}

	const onNextPage = () => {
		setCurrentPage(currentPage + 1)
		Analytics.event('market_other_items_next_page')
	}

	const onPrevPage = () => {
		setCurrentPage(currentPage - 1)
		Analytics.event('market_other_items_prev_page')
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

	return (
		<>
			{isLoading ? (
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
			) : filteredItems.length > 0 ? (
				<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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

			<Pagination
				currentPage={currentPage}
				totalPages={marketData?.totalPages || 1}
				onNextPage={onNextPage}
				onPrevPage={onPrevPage}
				isLoading={isLoading}
			/>
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
