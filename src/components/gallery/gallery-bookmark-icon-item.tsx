import { useState, useRef } from 'react'
import { Icon } from '@/icons'
import { UserCoin } from '@/components/user-coin'
import { useLazyLoad } from '@/hooks/use-lazy-load'
import type { GalleryAsset } from '@/services/gallery/get-gallery-assets.hook'
import { Spinner } from '@/components/ui'

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

	const elementRef = useLazyLoad<HTMLButtonElement>(loadContent)

	const itemOutlineStyle = isSelected
		? 'ring-2 ring-brand ring-offset-2 ring-offset-surface border-brand'
		: 'border-line hover:border-brand-muted hover:bg-fill-2'

	return (
		<button
			type="button"
			aria-pressed={isSelected}
			ref={elementRef}
			onClick={onClick}
			className={`relative w-full aspect-square rounded-2xl cursor-pointer group flex flex-col items-center justify-center p-3 select-none transition-ui duration-200 active:scale-96 bg-fill border ${itemOutlineStyle}`}
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
					<Spinner />
				</div>
			)}
			{error && (
				<div className="flex flex-col items-center justify-center w-full h-full text-danger">
					<Icon name="alert" size={20} />
					<p className="mt-1 text-3xs text-fg-muted">خطا در بارگذاری</p>
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
						<div className="absolute inset-x-1 bottom-1 px-1 py-0.5 rounded-lg bg-surface text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30 shadow-sm border border-line">
							<span className="text-3xs font-medium text-fg truncate block">
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
						<div className="absolute p-1 text-on-brand rounded-full shadow-sm top-2 left-2 bg-brand z-20">
							<Icon name="check" size={12} />
						</div>
					)}
					{asset.accessVip && !asset.isOwned && (
						<div className="absolute top-1.5 left-1.5 z-20">
							<span className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-vip-hover backdrop-blur-xs text-on-vip text-4xs font-bold shadow-sm border border-image-line">
								<Icon name="diamond" size={10} />
								<span>رایگان با پرو</span>
							</span>
						</div>
					)}
					{asset.isOwned && !isSelected && (
						<div className="absolute flex gap-0.5 px-1.5 rounded-tl-xl rounded-br-lg bg-success text-on-success shadow-sm items-center top-0 left-0 text-3xs h-4 z-20">
							<Icon name="shoppingBag" size={10} />
							<span>خریداری شده</span>
						</div>
					)}
				</>
			)}
		</button>
	)
}
