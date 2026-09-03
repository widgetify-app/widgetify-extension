import { useState, useRef } from 'react'
import { Modal, Chip, VipBadge } from '@/components/ui'
import { Icon } from '@/src/icons'
import { showToast } from '@/common/toast'
import { useAuth } from '@/context/auth.context'
import { callEvent } from '@/common/utils/call-event'
import { UserCoin } from '@/layouts/setting/tabs/account/components/user-coin'
import { useLazyLoad } from '@/layouts/setting/tabs/wallpapers/hooks/use-lazy-load'
import {
	useGetGalleryAssets,
	useGetGalleryCategories,
	type GalleryAsset,
	type GalleryAssetType,
} from '@/services/hooks/gallery/get-gallery-assets.hook'
import { GalleryAssetPurchaseModal } from './gallery-asset-purchase-modal'

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
				direction="rtl"
				closeOnBackdropClick={true}
			>
				<div className="flex flex-col gap-4 w-full p-1 min-h-[480px] max-h-[75vh]">
					{categories.length > 0 && (
						<div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
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

					<div className="flex-1 overflow-y-auto pr-1">
						{isLoading ? (
							<div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
								{[...Array(8)].map((_, idx) => (
									<div
										key={idx}
										className="w-full rounded-2xl bg-base-300 animate-pulse break-inside-avoid"
										style={{ height: `${(idx % 3) * 60 + 160}px` }}
									/>
								))}
							</div>
						) : assets.length === 0 ? (
							<div className="flex flex-col items-center justify-center h-full py-20 text-muted">
								<Icon name="image" size={40} className="mb-2 opacity-30" />
								<p className="text-sm font-medium">هیچ تصویری پیدا نشد</p>
							</div>
						) : (
							<div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
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

function GalleryPinterestItem({
	asset,
	isSelected,
	onClick,
}: {
	asset: GalleryAsset
	isSelected: boolean
	onClick: () => void
}) {
	const [loaded, setLoaded] = useState(false)
	const [error, setError] = useState(false)
	const imgRef = useRef<HTMLImageElement>(null)

	const loadContent = () => {
		if (imgRef.current) {
			imgRef.current.src = asset.previewUrl || asset.url
		}
	}

	const elementRef = useLazyLoad(loadContent)

	const itemOutlineStyle = isSelected
		? 'ring-2 ring-primary ring-offset-2 ring-offset-base-100'
		: 'ring-1 ring-base-content/10 hover:ring-primary/70'

	return (
		<div
			ref={elementRef}
			onClick={onClick}
			className={`break-inside-avoid relative rounded-2xl cursor-pointer group overflow-hidden bg-base-200/50 ${itemOutlineStyle} transition-all duration-200 active:scale-98`}
		>
			{!loaded && (
				<div className="flex items-center justify-center w-full min-h-[160px] bg-base-300">
					<div className="w-5 h-5 border-2 rounded-full border-primary/30 border-t-primary animate-spin" />
				</div>
			)}

			{error && (
				<div className="flex flex-col items-center justify-center w-full min-h-[140px] bg-error/10">
					<Icon name="alert" className="text-error" />
					<p className="mt-1 text-[10px] text-muted">خطا در بارگذاری</p>
				</div>
			)}

			<img
				ref={imgRef}
				alt={asset.title || 'asset'}
				onLoad={() => {
					setLoaded(true)
					setError(false)
				}}
				onError={() => {
					setLoaded(true)
					setError(true)
				}}
				className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-103"
				style={{ opacity: loaded && !error ? 1 : 0 }}
			/>

			{loaded && !error && (
				<>
					<div className="absolute inset-x-0 bottom-0 p-2.5 rounded-b-2xl bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
						<span className="text-[11px] font-medium text-white truncate max-w-[60%]">
							{asset.title || ''}
						</span>

						{asset.price > 0 && !asset.isOwned ? (
							<div className="origin-bottom-left scale-75">
								<UserCoin coins={asset.price} title="قیمت خرید" />
							</div>
						) : null}
					</div>

					{isSelected && (
						<div className="absolute p-1 text-white rounded-full shadow-sm top-2 left-2 bg-primary">
							<Icon name="check" size={12} />
						</div>
					)}

					{asset.accessVip && !asset.isOwned && (
						<div className="absolute top-1.5 left-1.5 z-10">
							<VipBadge size="xs" variant="indigo" />
						</div>
					)}

					{asset.isOwned && !isSelected && (
						<div className="absolute flex gap-0.5 px-1.5 rounded-tl-2xl rounded-br-md bg-success text-success-content shadow-sm items-center top-0 left-0 text-[10px] h-4.5">
							<Icon name="shoppingBag" size={10} />
							<span>خریداری شده</span>
						</div>
					)}
				</>
			)}
		</div>
	)
}
