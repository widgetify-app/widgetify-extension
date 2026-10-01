import { useState } from 'react'
import { Icon } from '@/icons'
import { ImageSlider, useImageSlider } from '@/components/ui'
import type { CatalogItem } from '../types'

interface BannerProp {
	link: CatalogItem
	onOpenPromoModal?: (item: CatalogItem, triggerEl?: HTMLElement) => void
}

function getUrl(url: string) {
	return url.startsWith('http') ? url : `https://${url}`
}

export function RenderContentBanner({ link, onOpenPromoModal }: BannerProp) {
	const badge = link.badge?.trim()
	const gallery = link.meta?.gallery || []
	const [isHovered, setIsHovered] = useState(false)

	const isModalAction =
		link.meta?.action === 'OPEN_MODAL' ||
		link.meta?.action === 'OPEN_POPOVER' ||
		link.meta?.type === 'POPOVER_MENU' ||
		Boolean(link.meta?.promo)

	const { currentIndex, count, hasMultiple, currentImage, next, prev, goTo } =
		useImageSlider({
			images: gallery,
			fallbackSrc: link.backgroundSrc,
			isPaused: isHovered,
			autoPlay: true,
			interval: 4500,
		})

	const handleClick = (e: React.MouseEvent) => {
		if (isModalAction && onOpenPromoModal) {
			e.preventDefault()
			onOpenPromoModal(link, e.currentTarget as HTMLElement)
		}
	}

	return (
		<a
			href={getUrl(link.url)}
			target="_blank"
			rel="noopener noreferrer"
			onClick={handleClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className="col-span-2 row-span-2 group relative rounded-2xl overflow-hidden border border-surface-3 hover:border-line transition-ui duration-300 flex flex-col justify-between p-4 shadow-sm hover:shadow-md active:scale-[0.99] select-none h-full cursor-pointer"
		>
			<div
				className="absolute inset-0 bg-cover bg-center transition-ui duration-500 ease-out group-hover:scale-105"
				style={{
					backgroundImage: currentImage ? `url(${currentImage})` : undefined,
				}}
			/>

			<div className="absolute inset-0 bg-gradient-to-t from-scrim-strong via-scrim to-transparent transition-opacity group-hover:opacity-90" />

			{hasMultiple && (
				<ImageSlider.Arrows
					onPrev={prev}
					onNext={next}
					variant="dark"
					className="opacity-0 group-hover:opacity-100 transition-opacity"
				/>
			)}

			<div className="relative z-10 flex items-center justify-between mb-auto pb-4 gap-2">
				<div className="flex items-center gap-2">
					{badge && (
						<span
							className="px-2 py-0.5 rounded-lg text-3xs font-bold text-image-fg shadow-sm border border-image-fill backdrop-blur-md"
							style={{
								backgroundColor:
									link.badgeColor || 'var(--color-primary)',
							}}
						>
							{badge}
						</span>
					)}

					{hasMultiple && (
						<ImageSlider.Dots
							count={count}
							currentIndex={currentIndex}
							onSelect={goTo}
							variant="light"
						/>
					)}
				</div>
			</div>

			<div className="relative z-10 flex items-end justify-between gap-3">
				<div className="min-w-0 flex-1">
					<h3 className="text-xs font-bold text-image-fg drop-shadow-sm truncate">
						{link.name}
					</h3>
					{link.description && (
						<p className="text-2xs text-image-fg-muted line-clamp-1 mt-0.5 drop-shadow-xs leading-body font-normal">
							{link.description}
						</p>
					)}
				</div>

				<div className="w-7 h-7 rounded-xl bg-image-fill hover:bg-image-line backdrop-blur-md border border-image-fill flex items-center justify-center text-image-fg shrink-0 group-hover:scale-105 transition-ui shadow-sm">
					{isModalAction ? (
						<Icon name="chevronDown" size={12} />
					) : (
						<Icon name="chevronLeft" size={12} />
					)}
				</div>
			</div>
		</a>
	)
}
