import { useState, useRef } from 'react'
import { Icon } from '@/src/icons'
import { VipBadge } from '@/components/ui'
import { UserCoin } from '@/layouts/setting/tabs/account/components/user-coin'
import { useLazyLoad } from '@/layouts/setting/tabs/wallpapers/hooks/use-lazy-load'
import type { GalleryAsset } from '@/services/hooks/gallery/get-gallery-assets.hook'

interface GalleryPhotoItemProps {
	asset: GalleryAsset
	isSelected: boolean
	onClick: () => void
}

export function GalleryPhotoItem({ asset, isSelected, onClick }: GalleryPhotoItemProps) {
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
				<div className="flex items-center justify-center w-full min-h-28 bg-base-300/30">
					<div className="w-5 h-5 border-2 rounded-full border-primary/30 border-t-primary animate-spin" />
				</div>
			)}

			{error && (
				<div className="flex flex-col items-center justify-center w-full min-h-28 bg-error/10">
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
				className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-103"
				style={{ opacity: loaded && !error ? 1 : 0 }}
			/>

			{loaded && !error && (
				<>
					<div className="absolute inset-x-0 bottom-0 p-2.5 rounded-b-2xl bg-linear-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
