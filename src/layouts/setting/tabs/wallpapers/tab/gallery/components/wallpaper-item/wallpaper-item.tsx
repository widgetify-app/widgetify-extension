import React, { useEffect, useRef, useState } from 'react'
import { FiCheck, FiHeart, FiPlay, FiShoppingBag } from 'react-icons/fi'
import type { Wallpaper } from '@/common/wallpaper.interface'
import { UserCoin } from '@/layouts/setting/tabs/account/components/user-coin'
import { CoinPurchaseModal } from '@/layouts/setting/tabs/wallpapers/components/coin-purchase-modal'
import { useLazyLoad } from '../../../../hooks/use-lazy-load'
import { LuLayers, LuLayoutTemplate } from 'react-icons/lu'
import Tooltip from '@/components/toolTip'
import { HoverPlayVideo } from '../hover-play-video'

interface WallpaperItemProps {
	wallpaper: Wallpaper
	selectedBackground: Wallpaper | null
	setSelectedBackground: (wallpaper: Wallpaper) => void
	onPreviewBackground: (wallpaper: Wallpaper) => void
}

function wallpaperItem({
	wallpaper,
	selectedBackground,
	setSelectedBackground,
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

	const elementRef = useLazyLoad(loadContent)

	const itemOutlineStyle = isSelected
		? 'ring-2 ring-primary/80 ring-offset-blue-100'
		: 'ring-1 ring-base-content/10 group-hover:ring-blue-300/70'

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
			<div
				ref={elementRef}
				className={`relative rounded-xl cursor-pointer group aspect-video h-full  ${itemOutlineStyle} transition-all duration-200 active:scale-98`}
				onClick={handleSelect}
			>
				{!loaded && (
					<div className="flex items-center justify-center w-full h-full bg-gray-900/60 rounded-2xl">
						<div className="w-5 h-5 border-2 rounded-full border-blue-500/30 border-t-blue-500 animate-spin"></div>
					</div>
				)}
				{error && (
					<div className="flex flex-col items-center justify-center w-full h-full bg-red-500/10">
						<FiHeart className="text-red-400" />
						<p className="mt-2 text-xs text-gray-400">خطا در بارگذاری</p>
					</div>
				)}

				{wallpaper.type === 'IMAGE' ? (
					<img
						ref={imgRef}
						className="object-cover w-full h-full transition-opacity rounded-xl"
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
						className="object-cover w-full h-full transition-opacity rounded-xl"
						style={{ opacity: loaded && !error ? 1 : 0 }}
						onLoadedData={handleLoad}
						onError={handleError}
						onClick={(e) => {
							e.stopPropagation()
							handleSelect()
						}}
					/>
				)}

				{loaded && !error && (
					<>
						<div
							className={`absolute flex  justify-between inset-x-0 bottom-0 p-2 rounded-xl transition-opacity duration-300 bg-gradient-to-t from-black/80 to-black/0 items-center`}
						>
							{wallpaper.name && (
								<div className="flex-1 text-xs font-medium text-white">
									{wallpaper.name}
								</div>
							)}
							<div className="flex items-center gap-1">
								{wallpaper.coin && (
									<div className="origin-bottom-left scale-75">
										<UserCoin
											coins={wallpaper.coin}
											title={
												wallpaper.isOwned
													? 'باز شده'
													: 'قیمت باز کردن'
											}
										/>
									</div>
								)}
							</div>
						</div>
						{wallpaper.extensionUI ? (
							<div className="absolute top-0  h-5 py-0.5 px-3 rounded rounded-bl-xl rounded-r-none rounded-tr-xl w-fit bg-black/5 backdrop-blur-lg">
								<Tooltip
									content={
										wallpaper.extensionUI === 'ADVANCED'
											? ' مناسب حالت ظاهری پیشفرض'
											: 'مناسب حالت ظاهری ساده'
									}
								>
									{wallpaper.extensionUI === 'SIMPLE' ? (
										<LuLayoutTemplate
											size={14}
											className="text-white/80"
										/>
									) : (
										<LuLayers size={14} className="text-white/80" />
									)}
								</Tooltip>
							</div>
						) : null}

						{isSelected && (
							<div className="absolute p-1 text-white rounded-full shadow-sm top-2 left-2 bg-primary/80">
								<FiCheck size={12} />
							</div>
						)}

						{!isSelected && wallpaper.isOwned && (
							<div className="absolute flex gap-0.5 px-1 rounded-tl-xl rounded-r-md bg-success text-success-content shadow-sm  items-center top-0 left-0 w-max h-4">
								<FiShoppingBag size={10} />
								<span className="text-[10px]! font-normal">باز شده</span>
							</div>
						)}

						{isAnimated && (
							<div className="absolute flex gap-0.5 px-1 rounded-t-none rounded-b-lg bg-info text-info-content shadow-sm  items-center top-0 right-0 m- inset-x-0 m-auto w-max h-4">
								<FiPlay size={12} />
								<span className="text-[10px]! font-normal">متحرک</span>
							</div>
						)}

						<div className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none group-hover:opacity-100 bg-black/10 "></div>
					</>
				)}
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
	wallpaperItem,
	(prevProps, nextProps) =>
		prevProps.wallpaper.id === nextProps.wallpaper.id &&
		prevProps.selectedBackground?.id === nextProps.selectedBackground?.id
)
