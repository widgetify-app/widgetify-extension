import React, { useEffect, useRef, useState } from 'react'
import type { Wallpaper } from '@/common/types/wallpaper.interface'
import { UserCoin } from '@/components/user-coin'
import { CoinPurchaseModal } from '@/components/wallpaper/coin-purchase-modal'
import { useLazyLoad } from '@/hooks/use-lazy-load'
import { HoverPlayVideo } from './hover-play-video'
import { Icon } from '@/icons'
import { Spinner } from '@/components/ui'

interface WallpaperItemProps {
	wallpaper: Wallpaper
	selectedBackground: Wallpaper | null
	setSelectedBackground: (wallpaper: Wallpaper) => void
	onPreviewBackground: (wallpaper: Wallpaper) => void
}

function WallpaperItemFu({
	wallpaper,
	selectedBackground,
	setSelectedBackground,
	onPreviewBackground,
}: WallpaperItemProps) {
	const [loaded, setLoaded] = useState(false)
	const [error, setError] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const imgRef = useRef<HTMLImageElement>(null)
	const videoRef = useRef<HTMLVideoElement>(null)
	const isSelected = selectedBackground?.id === wallpaper.id

	const loadContent = () => {
		if (wallpaper.type === 'IMAGE' && imgRef.current) {
			imgRef.current.src = wallpaper.previewSrc
		} else if (wallpaper.type === 'VIDEO' && videoRef.current) {
			videoRef.current.src = wallpaper.src
			videoRef.current.load()
		}
	}

	const elementRef = useLazyLoad<HTMLDivElement>(loadContent)

	const itemOutlineStyle = isSelected
		? 'ring-2 ring-brand ring-offset-surface'
		: 'ring-1 ring-line hover:ring-brand'

	useEffect(() => {
		if (loaded && videoRef.current && isSelected) {
			videoRef.current.play().catch(() => {})
		}
	}, [loaded, isSelected])

	const handleLoad = () => {
		setLoaded(true)
		setError(false)
	}

	const handleError = () => {
		setLoaded(true)
		setError(true)
	}

	const handleSelect = () => {
		if (!loaded || error) return
		if (wallpaper.coin && !wallpaper.isOwned) {
			setIsModalOpen(true)
		} else {
			setSelectedBackground(wallpaper)
		}
	}

	const handlePurchase = () => {
		setSelectedBackground(wallpaper)
		setIsModalOpen(false)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
	}

	const isAnimated =
		wallpaper?.type === 'VIDEO' ||
		wallpaper?.src?.endsWith('.gif') ||
		wallpaper?.previewSrc?.endsWith('.gif')

	return (
		<>
			<div ref={elementRef} className="relative w-full aspect-video group">
				<button
					type="button"
					onClick={handleSelect}
					aria-pressed={isSelected}
					className={`relative block w-full h-full rounded-xl overflow-hidden cursor-pointer ${itemOutlineStyle} transition-ui duration-200 active:scale-98 focus-visible:focus-ring`}
				>
					{!loaded && (
						<div className="absolute inset-0 flex items-center justify-center bg-scrim rounded-xl">
							<Spinner />
						</div>
					)}
					{error && (
						<div className="absolute inset-0 flex flex-col items-center justify-center bg-danger-fill rounded-xl">
							<Icon name="outlineHeart" className="text-danger" />
							<p className="mt-2 text-xs text-fg-muted">خطا در بارگذاری</p>
						</div>
					)}

					{wallpaper.type === 'IMAGE' ? (
						<img
							ref={imgRef}
							className="absolute inset-0 object-cover w-full h-full transition-opacity rounded-xl"
							style={{ opacity: loaded && !error ? 1 : 0 }}
							alt={wallpaper.name || 'Wallpaper'}
							onLoad={handleLoad}
							onError={handleError}
						/>
					) : (
						<HoverPlayVideo
							videoSrc={
								wallpaper.previewVideoSrc ||
								wallpaper.src ||
								wallpaper.previewSrc
							}
							posterSrc={wallpaper.previewSrc} //previewSrc is poster
							className="absolute inset-0 object-cover w-full h-full transition-opacity rounded-xl"
							style={{ opacity: loaded && !error ? 1 : 0 }}
							onLoadedData={handleLoad}
							onError={handleError}
						/>
					)}

					{loaded && !error && (
						<>
							<div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-2 transition-opacity duration-300 rounded-xl bg-linear-to-t from-scrim to-transparent">
								<div className="flex-1 min-w-0 text-3xs font-medium text-image-fg truncate">
									{wallpaper.name && wallpaper.name !== '-'
										? wallpaper.name
										: ''}
								</div>
								{wallpaper.coin ? (
									<div className="flex items-center gap-1 origin-bottom-left scale-75 ms-auto shrink-0">
										<UserCoin
											coins={wallpaper.coin || 0}
											title={
												wallpaper.isOwned
													? 'باز شده'
													: 'قیمت باز کردن'
											}
										/>
									</div>
								) : null}
							</div>

							{isSelected && (
								<div className="absolute p-1 text-on-brand rounded-full shadow-sm top-2 left-2 bg-brand">
									<Icon name="check" size={12} />
								</div>
							)}

							{!isSelected && wallpaper.isOwned && (
								<div className="absolute flex gap-0.5 px-1 rounded-tl-xl rounded-r-lg bg-success text-on-success shadow-sm  items-center top-0 left-0 w-max h-4">
									<Icon name="shoppingBag" size={10} />
									<span className="text-3xs! font-normal">باز شده</span>
								</div>
							)}

							{isAnimated && (
								<div className="absolute flex gap-0.5 px-1 rounded-t-none rounded-b-lg bg-info text-on-info shadow-sm  items-center top-0 right-0 inset-x-0 m-auto w-max h-4">
									<Icon name="play" size={12} />
									<span className="text-3xs! font-normal">متحرک</span>
								</div>
							)}

							<div className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none group-hover:opacity-100 bg-scrim-soft rounded-2xl"></div>
						</>
					)}
				</button>

				{loaded &&
				!error &&
				!isSelected &&
				!wallpaper.isOwned &&
				wallpaper.coin ? (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation()
							onPreviewBackground(wallpaper)
						}}
						className="absolute bottom-1.5 right-1.5 flex items-center gap-1 px-2 py-1 rounded-lg bg-scrim border border-image-line text-[rgba(255,255,255,0.8)] hover:text-image-fg transition-colors text-3xs font-medium backdrop-blur-sm cursor-pointer opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:focus-ring"
					>
						<Icon name="outlineEye" size={10} />
						<span>پیش‌نمایش</span>
					</button>
				) : null}
			</div>

			<CoinPurchaseModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				wallpaper={wallpaper}
				onPurchase={handlePurchase}
			/>
		</>
	)
}

export const WallpaperItem = React.memo(
	WallpaperItemFu,
	(prevProps, nextProps) =>
		prevProps.wallpaper.id === nextProps.wallpaper.id &&
		prevProps.selectedBackground?.id === nextProps.selectedBackground?.id
)
