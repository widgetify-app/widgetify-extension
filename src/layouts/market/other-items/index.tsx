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
import { showToast } from '@/common/toast'

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

	const filteredItems = (marketData?.items || []).sort((a, b) => {
		return a.isOwned === b.isOwned ? 1 : -1
	})

	const handlePurchaseClick = (item: MarketItem) => {
		if (!isAuthenticated) {
			Analytics.event('market_item_purchase_unauthenticated')
			showToast('برای خرید آیتم باید وارد حساب کاربری خود شوید.', 'error')
			return
		}

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

		if (item.type === 'FONT') {
			callEvent('font_change', item.itemValue as string)
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
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{Array.from({ length: 8 }).map((_, index) => (
						<div
							key={index}
							className="p-3 border rounded-2xl border-base-300 bg-base-200/20"
						>
							<div className="w-full h-24 mb-4 rounded-xl bg-base-300 animate-pulse" />
							<div className="w-2/3 h-4 mb-2 rounded bg-base-300 animate-pulse" />
							<div className="w-full h-3 mb-4 rounded bg-base-300/50 animate-pulse" />
							<div className="h-10 rounded-xl bg-base-300 animate-pulse" />
						</div>
					))}
				</div>
			) : filteredItems.length > 0 ? (
				<div className="grid grid-cols-1 gap-2 pb-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
					{filteredItems.map((item) => (
						<div key={item.id} className="transition-transform duration-300 ">
							<MarketItemCard
								item={item}
								onPurchase={() => handlePurchaseClick(item)}
								isAuthenticated={isAuthenticated}
							/>
						</div>
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
