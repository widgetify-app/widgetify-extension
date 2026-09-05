import { useState } from 'react'
import { Modal, Chip } from '@/components/ui'
import { Icon } from '@/src/icons'
import { playNativeToastSound, showToast } from '@/common/toast'
import { useAuth } from '@/context/auth.context'
import { callEvent } from '@/common/utils/call-event'
import {
	useGetGalleryAssets,
	useGetGalleryCategories,
	type GalleryAsset,
	type GalleryAssetType,
} from '@/services/hooks/gallery/get-gallery-assets.hook'
import { GalleryAssetPurchaseModal } from './gallery-asset-purchase-modal'
import { GalleryPinterestItem } from './gallery-pinterest-item'
import { GalleryBookmarkIconItem } from './gallery-bookmark-icon-item'

interface GalleryPickerModalProps {
	isOpen: boolean
	onClose: () => void
	type: GalleryAssetType
	title?: string
	onSelect: (asset: GalleryAsset) => void
	selectedAssetId?: string
}

export function GalleryPickerModal({
	isOpen,
	onClose,
	type,
	title = 'گالری تصاویر',
	onSelect,
	selectedAssetId,
}: GalleryPickerModalProps) {
	const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
	const [purchasingAsset, setPurchasingAsset] = useState<GalleryAsset | null>(null)

	const { user, isVip } = useAuth()
	const { data: categories = [] } = useGetGalleryCategories(type, isOpen)

	const { data, isLoading } = useGetGalleryAssets(
		{
			type,
			limit: 100,
			category: selectedCategory === 'ALL' ? undefined : selectedCategory,
		},
		isOpen
	)

	const assets = data?.data?.assets ?? []

	const handleItemClick = (asset: GalleryAsset) => {
		if (asset.isOwned || asset.price === 0) {
			onSelect(asset)
			onClose()
			playNativeToastSound('success')
			return
		}

		if (!user) {
			callEvent('openProfile')
			showToast('برای استفاده از این مورد اول وارد حسابت شو', 'error')
			return
		}

		if (asset.accessVip && !isVip && asset.price === 0) {
			callEvent('openSettings', 'vip')
			return
		}

		setPurchasingAsset(asset)
	}

	const handlePurchaseSuccess = (asset: GalleryAsset) => {
		setPurchasingAsset(null)
		onSelect({ ...asset, isOwned: true, isUnlocked: true })
		onClose()
	}

	const handleSelectDirectly = (asset: GalleryAsset) => {
		setPurchasingAsset(null)
		onSelect(asset)
		onClose()
	}

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title={title}
				size="xl"
				className=""
				direction="rtl"
				closeOnBackdropClick={true}
			>
				<div className="flex flex-col w-full gap-4 p-1">
					{categories.length > 0 && (
						<div className="flex items-center gap-1.5 overflow-y-hidden h-12 overflow-x-auto no-scrollbar">
							<Chip
								selected={selectedCategory === 'ALL'}
								onClick={() => setSelectedCategory('ALL')}
								className="text-xs"
							>
								همه
							</Chip>
							{categories.map((cat) => (
								<Chip
									key={cat}
									selected={selectedCategory === cat}
									onClick={() => setSelectedCategory(cat)}
									className="text-xs"
								>
									{cat}
								</Chip>
							))}
						</div>
					)}

					<div className="flex-1 pr-1 overflow-y-auto">
						{isLoading ? (
							type === 'BOOKMARK_ICON' ? (
								<div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
									{[...Array(10)].map((_, idx) => (
										<div
											key={idx}
											className="w-full aspect-square rounded-2xl bg-base-300 animate-pulse"
										/>
									))}
								</div>
							) : (
								<div className="gap-3 space-y-3 columns-2 sm:columns-3 md:columns-4">
									{[...Array(8)].map((_, idx) => (
										<div
											key={idx}
											className="w-full rounded-2xl bg-base-300 animate-pulse break-inside-avoid"
											style={{
												height: `${(idx % 3) * 60 + 160}px`,
											}}
										/>
									))}
								</div>
							)
						) : assets.length === 0 ? (
							<div className="flex flex-col items-center justify-center h-full py-20 text-muted">
								<Icon
									name="image"
									size={40}
									className="mb-2 opacity-30"
								/>
								<p className="text-sm font-medium">هیچ تصویری پیدا نشد</p>
							</div>
						) : type === 'BOOKMARK_ICON' ? (
							<div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
								{assets.map((asset) => (
									<GalleryBookmarkIconItem
										key={asset.id}
										asset={asset}
										isSelected={selectedAssetId === asset.id}
										onClick={() => handleItemClick(asset)}
									/>
								))}
							</div>
						) : (
							<div className="gap-3 space-y-3 columns-2 sm:columns-3 md:columns-4">
								{assets.map((asset) => (
									<GalleryPinterestItem
										key={asset.id}
										asset={asset}
										isSelected={selectedAssetId === asset.id}
										onClick={() => handleItemClick(asset)}
									/>
								))}
							</div>
						)}
					</div>
				</div>
			</Modal>

			<GalleryAssetPurchaseModal
				isOpen={Boolean(purchasingAsset)}
				onClose={() => setPurchasingAsset(null)}
				asset={purchasingAsset}
				userCoins={user?.coins ?? 0}
				isVip={Boolean(isVip)}
				onPurchaseSuccess={handlePurchaseSuccess}
				onSelectDirectly={handleSelectDirectly}
			/>
		</>
	)
}
