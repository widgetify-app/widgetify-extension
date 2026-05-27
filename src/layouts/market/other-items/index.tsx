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

	const handleOnClose = (switchToCoins?: boolean) => {
		if (switchToCoins) {
			callEvent('market_change_tab', 'coins')
		}
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-64 text-center gap-3">
				<div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center">
					<FiShoppingBag size={22} className="text-muted" />
				</div>
				<div>
					<p className="text-sm font-medium text-content">خطا در بارگذاری آیتم‌های مارکت</p>
					<p className="text-xs text-muted mt-1">لطفاً دوباره تلاش کنید</p>
				</div>
			</div>
		)
	}

	return (
		<>
			{isLoading ? (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
					{Array.from({ length: 8 }).map((_, index) => (
						<div
							key={index}
							className="rounded-2xl border border-base-300/60 overflow-hidden bg-base-100"
						>
							<div className="w-full h-24 bg-base-200 animate-pulse" />
							<div className="p-3 space-y-2">
								<div className="w-2/3 h-3.5 rounded-lg bg-base-200 animate-pulse" />
								<div className="w-1/3 h-2.5 rounded-lg bg-base-200/70 animate-pulse" />
								<div className="w-full h-7 rounded-lg bg-base-200 animate-pulse mt-3" />
							</div>
						</div>
					))}
				</div>
			) : filteredItems.length > 0 ? (
				<div className="grid grid-cols-2 gap-3 pb-10 sm:grid-cols-3 lg:grid-cols-4">
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
				<div className="flex flex-col items-center justify-center h-64 text-center gap-3">
					<div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center">
						<FiShoppingBag size={22} className="text-muted" />
					</div>
					<div>
						<p className="text-sm font-medium text-content">آیتمی برای نمایش وجود ندارد</p>
						<p className="text-xs text-muted mt-1">بعداً دوباره بررسی کنید</p>
					</div>
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
				onClose={(switchToCoins) => handleOnClose(switchToCoins)}
				item={selectedItem}
				onPurchaseSuccess={handlePurchaseSuccess}
				userCoins={user?.coins || 0}
			/>
		</>
	)
}
