import { useState } from 'react'
import { FiShoppingBag } from 'react-icons/fi'
import { useAuth } from '@/context/auth.context'
import type { MarketItem } from '@/services/hooks/market/getMarketItems.hook'
import {
	type MarketItemType,
	useGetMarketItems,
} from '@/services/hooks/market/getMarketItems.hook'
import { MarketItemCard } from './components/market-item-card'
import { MarketItemPurchaseModal } from './components/market-item-purchase-modal'

export function MarketContainer() {
	const { user } = useAuth()
	const [selectedType, _setSelectedType] = useState<MarketItemType | ''>('')
	const [searchQuery, _setSearchQuery] = useState('')
	const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null)
	const [showPurchaseModal, setShowPurchaseModal] = useState(false)

	const {
		data: marketData,
		isLoading,
		error,
	} = useGetMarketItems({
		type: selectedType || undefined,
		limit: 20,
	})

	const filteredItems =
		marketData?.items?.filter(
			(item) =>
				item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.description.toLowerCase().includes(searchQuery.toLowerCase())
		) || []

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
				<p className="text-lg font-medium text-content">خطا در بارگذاری مارکت</p>
				<p className="text-sm text-muted">لطفاً دوباره تلاش کنید</p>
			</div>
		)
	}

	return (
		<div className="p-4 space-y-4 h-[70vh]">
			{/* Filters */}
			{/* <div className="flex gap-3">
				<div className="flex-1">
					<TextInput
						type="text"
						value={searchQuery}
						onChange={(value) => setSearchQuery(value)}
						placeholder="جستجو در آیتم‌ها..."
					/>
				</div>
				<div className="w-32">
					<SelectBox
						options={MARKET_ITEM_TYPES}
						value={selectedType}
						className="h-full"
						onChange={(value) => setSelectedType(value as MarketItemType)}
					/>
				</div>
			</div> */}

			{/* Items Grid */}
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
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{filteredItems.map((item) => (
						<MarketItemCard
							key={item.id}
							item={item}
							onPurchase={() => handlePurchaseClick(item)}
							userCoins={user?.coins || 0}
						/>
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center h-32 text-center">
					<p className="text-lg font-medium text-content">آیتمی یافت نشد</p>
					<p className="text-sm text-muted">فیلترهای جستجو را تغییر دهید</p>
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
		</div>
	)
}
