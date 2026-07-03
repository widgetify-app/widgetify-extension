import { useState } from 'react'
import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { Pagination } from '@/components/pagination'
import { useAuth } from '@/context/auth.context'
import { useTheme } from '@/context/theme.context'
import { useGetMarketItems } from '@/services/hooks/market/getMarketItems.hook'
import { MarketItemType, type MarketItem } from '@/services/hooks/market/market.interface'
import { MarketItemCard } from './components/market-item-card'
import { MarketItemPurchaseModal } from './components/market-item-purchase-modal'
import { showToast } from '@/common/toast'
import { Chip } from '@/components/chip.component'
import { useAppearanceSetting } from '@/context/appearance.context'
import { usePreviewHandler } from '@/hooks/usePreviewHandler'
import { Icon } from '@/src/icons'

const FILTER_OPTIONS = [
	{ id: 'all', label: 'همه' },
	{ id: MarketItemType.THEME, label: 'تم' },
	{ id: MarketItemType.FONT, label: 'فونت' },
	{ id: MarketItemType.BROWSER_TITLE, label: 'عنوان مرورگر' },
]

export function MarketOtherItems() {
	const { fontFamily } = useAppearanceSetting()
	const { theme } = useTheme()
	const { user, isAuthenticated, refetchUser } = useAuth()
	const [currentPage, setCurrentPage] = useState(1)
	const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null)
	const [showPurchaseModal, setShowPurchaseModal] = useState(false)
	const [activeFilter, setActiveFilter] = useState('all')

	const { previewHandler } = usePreviewHandler()

	const {
		data: marketData,
		isLoading,
		error,
		refetch,
	} = useGetMarketItems(true, {
		limit: 12,
		page: currentPage,
	})

	const filteredItems = (marketData?.items || [])
		.filter((item) => activeFilter === 'all' || item.type === activeFilter)
		.sort((a, b) => {
			if (a.isOwned === b.isOwned) return 0
			return a.isOwned ? 1 : -1
		})

	const handleFilterChange = (filter: string) => {
		setActiveFilter(filter)
		setCurrentPage(1)
	}

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

		if (item.type === MarketItemType.BROWSER_TITLE) {
			callEvent('browser_title_change', {
				id: item.id,
				name: item.name,
				template: item.itemValue as string,
				sync: true,
			})
		}
		if (item.type === MarketItemType.THEME) {
			callEvent('theme_change', {
				theme: item.itemValue as string,
				sync: true,
			})
		}
		if (item.type === MarketItemType.FONT) {
			callEvent('font_change', {
				font: item.itemValue as string,
				sync: true,
			})
		}
	}

	const handleOnClose = (switchToCoins?: boolean) => {
		if (switchToCoins) callEvent('market_change_tab', 'coins')
		setShowPurchaseModal(false)
	}

	const handlePreview = (item: MarketItem) => {
		previewHandler(item, {
			theme,
			font: fontFamily,
			browserTitle: document.title,
		})
	}

	return (
		<>
			{/* Filter chips */}
			<div className="flex items-center gap-1.5 flex-wrap mb-4">
				{FILTER_OPTIONS.map((opt) => (
					<Chip
						key={opt.id}
						selected={activeFilter === opt.id}
						onClick={() => handleFilterChange(opt.id)}
						dir="rtl"
					>
						{opt.label}
					</Chip>
				))}
			</div>

			{error ? (
				<div className="flex flex-col items-center justify-center h-48 gap-3">
					<div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-base-200/60">
						<Icon
							name="shoppingBag"
							size={20}
							className="text-base-content/20"
						/>
					</div>
					<p className="text-xs text-base-content/40">خطا در بارگذاری آیتم‌ها</p>
				</div>
			) : isLoading ? (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
					{Array.from({ length: 8 }).map((_, i) => (
						<div
							key={i}
							className="overflow-hidden border rounded-2xl border-base-300/40 bg-base-100/60"
						>
							<div className="w-full h-24 skeleton opacity-40" />
							<div className="p-3 space-y-2">
								<div className="w-3/5 h-3 rounded-lg skeleton opacity-30" />
								<div className="w-2/5 h-2.5 skeleton rounded-lg opacity-20" />
								<div className="flex items-center justify-between pt-2 mt-1 border-t border-base-content/5">
									<div className="w-10 h-2.5 skeleton rounded-lg opacity-20" />
									<div className="w-12 h-6 rounded-lg skeleton opacity-20" />
								</div>
							</div>
						</div>
					))}
				</div>
			) : filteredItems.length > 0 ? (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
					{filteredItems.map((item) => (
						<MarketItemCard
							key={item.id}
							item={item}
							onPurchase={() => handlePurchaseClick(item)}
							isAuthenticated={isAuthenticated}
							onClickPreview={() => handlePreview(item)}
						/>
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center h-48 gap-3">
					<div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-base-200/60">
						<Icon
							name="shoppingBag"
							size={20}
							className="text-base-content/20"
						/>
					</div>
					<p className="text-xs text-base-content/40">
						آیتمی در این دسته‌بندی وجود ندارد
					</p>
				</div>
			)}

			<Pagination
				currentPage={currentPage}
				totalPages={marketData?.totalPages || 1}
				onNextPage={() => {
					setCurrentPage((p) => p + 1)
					Analytics.event('market_other_items_next_page')
				}}
				onPrevPage={() => {
					setCurrentPage((p) => p - 1)
					Analytics.event('market_other_items_prev_page')
				}}
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
