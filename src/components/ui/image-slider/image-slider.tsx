import { useState } from 'react'
import { Icon } from '@/icons'
import { cn } from '@/common/utils/cn'
import { useImageSlider, type UseImageSliderOptions } from './use-image-slider'

export interface ImageSliderDotsProps {
	count: number
	currentIndex: number
	onSelect: (index: number) => void
	className?: string
	size?: 'sm' | 'md'
	variant?: 'light' | 'dark'
}

export function ImageSliderDots({
	count,
	currentIndex,
	onSelect,
	className,
	size = 'sm',
	variant = 'light',
}: ImageSliderDotsProps) {
	if (count <= 1) return null

	return (
		<div
			className={cn(
				'flex items-center gap-1 px-2 py-1 rounded-full backdrop-blur-md pointer-events-auto',
				variant === 'light'
					? 'bg-black/50 border border-white/10'
					: 'bg-base-200/80 border border-content',
				className
			)}
		>
			{Array.from({ length: count }).map((_, idx) => (
				<button
					key={`slider-dot-${idx}`}
					type="button"
					onClick={(e) => {
						e.stopPropagation()
						e.preventDefault()
						onSelect(idx)
					}}
					className={cn(
						'rounded-full transition-all duration-300 cursor-pointer',
						size === 'sm' ? 'h-1.5' : 'h-2',
						idx === currentIndex
							? variant === 'light'
								? 'w-4 bg-white'
								: 'w-3.5 bg-primary'
							: variant === 'light'
								? 'w-1.5 bg-white/40 hover:bg-white/70'
								: 'w-1 bg-base-content/30 hover:bg-base-content/60'
					)}
					aria-label={`اسلاید ${idx + 1}`}
				/>
			))}
		</div>
	)
}

export interface ImageSliderArrowsProps {
	onPrev: (e: React.MouseEvent) => void
	onNext: (e: React.MouseEvent) => void
	className?: string
	variant?: 'dark' | 'glass'
}

export function ImageSliderArrows({
	onPrev,
	onNext,
	className,
	variant = 'dark',
}: ImageSliderArrowsProps) {
	return (
		<div
			className={cn(
				'absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none z-20',
				className
			)}
		>
			<button
				type="button"
				onClick={(e) => {
					e.stopPropagation()
					e.preventDefault()
					onPrev(e)
				}}
				className={cn(
					'pointer-events-auto w-7 h-7 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-xs cursor-pointer',
					variant === 'dark'
						? 'bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20'
						: 'bg-base-100/80 hover:bg-base-100 text-content backdrop-blur-xs border border-content'
				)}
				aria-label="عکس قبلی"
			>
				<Icon name="chevronRight" size={13} />
			</button>
			<button
				type="button"
				onClick={(e) => {
					e.stopPropagation()
					e.preventDefault()
					onNext(e)
				}}
				className={cn(
					'pointer-events-auto w-7 h-7 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-xs cursor-pointer',
					variant === 'dark'
						? 'bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20'
						: 'bg-base-100/80 hover:bg-base-100 text-content backdrop-blur-xs border border-content'
				)}
				aria-label="عکس بعدی"
			>
				<Icon name="chevronLeft" size={13} />
			</button>
		</div>
	)
}

export interface ImageSliderProps extends UseImageSliderOptions {
	alt?: string
	mode?: 'background' | 'image'
	showArrows?: boolean
	arrowsVisibility?: 'always' | 'hover'
	arrowVariant?: 'dark' | 'glass'
	showDots?: boolean
	dotsPosition?: 'bottom-center' | 'top-start' | 'none'
	dotsVariant?: 'light' | 'dark'
	className?: string
	imageClassName?: string
	overlay?: React.ReactNode
	children?:
		| React.ReactNode
		| ((slider: ReturnType<typeof useImageSlider>) => React.ReactNode)
	onIndexChange?: (index: number) => void
	onMouseEnter?: (e: React.MouseEvent) => void
	onMouseLeave?: (e: React.MouseEvent) => void
}

export function ImageSlider({
	images = [],
	fallbackSrc,
	alt = '',
	autoPlay = true,
	interval = 4500,
	mode = 'background',
	showArrows = true,
	arrowsVisibility = 'hover',
	arrowVariant = 'dark',
	showDots = true,
	dotsPosition = 'bottom-center',
	dotsVariant = 'light',
	className,
	imageClassName,
	overlay,
	children,
	onIndexChange,
	onMouseEnter,
	onMouseLeave,
}: ImageSliderProps) {
	const [isHovered, setIsHovered] = useState(false)

	const slider = useImageSlider({
		images,
		fallbackSrc,
		autoPlay,
		interval,
		isPaused: isHovered,
		onChange: onIndexChange,
	})

	const { currentImage, hasMultiple, count, currentIndex, next, prev, goTo } = slider

	const handleMouseEnter = (e: React.MouseEvent) => {
		setIsHovered(true)
		onMouseEnter?.(e)
	}

	const handleMouseLeave = (e: React.MouseEvent) => {
		setIsHovered(false)
		onMouseLeave?.(e)
	}

	return (
		<div
			className={cn(
				'relative w-full h-full select-none overflow-hidden',
				className
			)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{mode === 'background' ? (
				<div
					className={cn(
						'absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-105',
						imageClassName
					)}
					style={{
						backgroundImage: currentImage
							? `url(${currentImage})`
							: undefined,
					}}
				/>
			) : (
				currentImage && (
					<img
						src={currentImage}
						alt={alt}
						className={cn(
							'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105',
							imageClassName
						)}
					/>
				)
			)}

			{overlay}

			{showArrows && hasMultiple && (
				<ImageSliderArrows
					onPrev={prev}
					onNext={next}
					variant={arrowVariant}
					className={cn(
						arrowsVisibility === 'hover' &&
							'opacity-0 group-hover:opacity-100 transition-opacity'
					)}
				/>
			)}

			{showDots && hasMultiple && dotsPosition !== 'none' && (
				<div
					className={cn(
						'absolute z-20',
						dotsPosition === 'bottom-center' &&
							'bottom-2 inset-x-0 flex items-center justify-center',
						dotsPosition === 'top-start' && 'top-2 right-2'
					)}
				>
					<ImageSliderDots
						count={count}
						currentIndex={currentIndex}
						onSelect={goTo}
						variant={dotsVariant}
					/>
				</div>
			)}

			{typeof children === 'function' ? children(slider) : children}
		</div>
	)
}

ImageSlider.Dots = ImageSliderDots
ImageSlider.Arrows = ImageSliderArrows
