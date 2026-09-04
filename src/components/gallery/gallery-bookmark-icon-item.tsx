import { useState, useRef } from 'react'
import { Icon } from '@/src/icons'
import { VipBadge } from '@/components/ui'
import { UserCoin } from '@/layouts/setting/tabs/account/components/user-coin'
import { useLazyLoad } from '@/layouts/setting/tabs/wallpapers/hooks/use-lazy-load'
import type { GalleryAsset } from '@/services/hooks/gallery/get-gallery-assets.hook'

interface GalleryBookmarkIconItemProps {
	asset: GalleryAsset
	isSelected: boolean
	onClick: () => void
}

export function GalleryBookmarkIconItem({
	asset,
	isSelected,
	onClick,
}: GalleryBookmarkIconItemProps) {
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
		? 'ring-2 ring-primary ring-offset-2 ring-offset-base-100 border-primary'
		: 'border-base-content/10 hover:border-primary/50 hover:bg-base-300/40'

	return (
		<div
			ref={elementRef}
			onClick={onClick}
			className={`relative aspect-square rounded-2xl cursor-pointer group flex flex-col items-center justify-center p-3 select-none transition-all duration-200 active:scale-96 bg-base-300/20 border ${itemOutlineStyle}`}
		>
			<div
				className="absolute inset-0 rounded-2xl pointer-events-none opacity-40"
				style={{
					backgroundImage:
						'radial-gradient(circle, currentColor 1px, transparent 1px)',
					backgroundSize: '12px 12px',
				}}
			/>

			{!loaded && (
				<div className="flex items-center justify-center w-full h-full">
					<div className="w-5 h-5 border-2 rounded-full border-primary/30 border-t-primary animate-spin" />
				</div>
			)}

			{error && (
				<div className="flex flex-col items-center justify-center w-full h-full text-error/80">
					<Icon name="alert" size={20} />
					<p className="mt-1 text-[10px] text-muted">خطا در بارگذاری</p>
				</div>
			)}

			<div className="relative z-10 flex items-center justify-center w-full h-full p-2">
				<img
					ref={imgRef}
					alt={asset.title || 'آیکون بوکمارک'}
					onLoad={() => {
						setLoaded(true)
						setError(false)
					}}
					onError={() => {
						setLoaded(true)
						setError(true)
					}}
					className="object-contain w-full h-full max-w-[85%] max-h-[85%] drop-shadow-sm transition-transform duration-200 group-hover:scale-108"
					style={{ opacity: loaded && !error ? 1 : 0 }}
				/>
			</div>

			{loaded && !error && (
				<>
					{asset.title && (
						<div className="absolute inset-x-1 bottom-1 px-1 py-0.5 rounded-lg bg-base-100/90 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 shadow-xs border border-base-content/10">
							<span className="text-[10px] font-medium text-content truncate block">
								{asset.title}
							</span>
						</div>
					)}

					{asset.price > 0 && !asset.isOwned && (
						<div className="absolute bottom-2 right-2 z-20 origin-bottom-right scale-75">
							<UserCoin coins={asset.price} title="قیمت خرید" />
						</div>
					)}

					{isSelected && (
						<div className="absolute p-1 text-white rounded-full shadow-sm top-2 left-2 bg-primary z-20">
							<Icon name="check" size={12} />
						</div>
					)}

					{asset.accessVip && !asset.isOwned && (
						<div className="absolute top-1.5 left-1.5 z-20">
							<VipBadge size="xs" variant="indigo" />
						</div>
					)}

					{asset.isOwned && !isSelected && (
						<div className="absolute flex gap-0.5 px-1.5 rounded-tl-xl rounded-br-md bg-success text-success-content shadow-xs items-center top-0 left-0 text-[10px] h-4 z-20">
							<Icon name="shoppingBag" size={9} />
							<span>خریداری شده</span>
						</div>
					)}
				</>
			)}
		</div>
	)
}
