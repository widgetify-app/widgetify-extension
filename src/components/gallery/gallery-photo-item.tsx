import { useState, useRef } from 'react'
import { Icon } from '@/icons'
import { UserCoin } from '@/components/user-coin'
import { useLazyLoad } from '@/hooks/use-lazy-load'
import type { GalleryAsset } from '@/services/gallery/get-gallery-assets.hook'
import { Spinner } from '@/components/ui'

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

	const elementRef = useLazyLoad<HTMLButtonElement>(loadContent)

	const itemOutlineStyle = isSelected
		? 'ring-2 ring-brand ring-offset-2 ring-offset-surface'
		: 'ring-1 ring-line hover:ring-brand'

	return (
		<button
			type="button"
			aria-pressed={isSelected}
			ref={elementRef}
			onClick={onClick}
			className={`block w-full text-start break-inside-avoid relative rounded-2xl cursor-pointer group overflow-hidden bg-fill-2 ${itemOutlineStyle} transition-ui duration-200 active:scale-98`}
		>
			{!loaded && (
				<div className="flex items-center justify-center w-full min-h-28 bg-fill">
					<Spinner />
				</div>
			)}

			{error && (
				<div className="flex flex-col items-center justify-center w-full min-h-28 bg-danger-fill">
					<Icon name="alert" className="text-danger" />
					<p className="mt-1 text-3xs text-fg-muted">خطا در بارگذاری</p>
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
					<div className="absolute inset-x-0 bottom-0 p-2.5 rounded-b-2xl bg-linear-to-t from-scrim via-[rgba(0,0,0,0.4)] to-transparent flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
						<span className="text-2xs font-medium text-image-fg truncate max-w-[60%]">
							{asset.title || ''}
						</span>

						{asset.price > 0 && !asset.isOwned ? (
							<div className="origin-bottom-left scale-75">
								<UserCoin coins={asset.price} title="قیمت خرید" />
							</div>
						) : null}
					</div>

					{isSelected && (
						<div className="absolute p-1 text-on-brand rounded-full shadow-sm top-2 left-2 bg-brand">
							<Icon name="check" size={12} />
						</div>
					)}

					{asset.accessVip && !asset.isOwned && (
						<div className="absolute top-1.5 left-1.5 z-10">
							<span className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-vip-hover backdrop-blur-xs text-on-vip text-3xs font-bold shadow-sm border border-image-line">
								<Icon name="diamond" size={10} />
								<span>رایگان با پرو</span>
							</span>
						</div>
					)}

					{asset.isOwned && !isSelected && (
						<div className="absolute flex gap-0.5 px-1.5 rounded-tl-2xl rounded-br-lg bg-success text-on-success shadow-sm items-center top-0 left-0 text-3xs h-4.5">
							<Icon name="shoppingBag" size={10} />
							<span>خریداری شده</span>
						</div>
					)}
				</>
			)}
		</button>
	)
}
