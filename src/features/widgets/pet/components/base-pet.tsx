import { memo, useState } from 'react'
import { PetTooltip } from './pet-tooltip'
import { cn } from '@/common/utils/cn'
import type { CollectibleItem, PetAssets, PetDimensions } from '../types'

interface CollectiblesRendererProps {
	collectibles: CollectibleItem[]
	assets: PetAssets
}

const CollectiblesRenderer = memo(function CollectiblesRenderer({
	collectibles,
	assets,
}: CollectiblesRendererProps) {
	const CollectibleIcon = assets.collectibleIcon

	return (
		<>
			{collectibles.map(
				(item) =>
					!item.collected && (
						<div
							key={item.id}
							className="absolute bottom-0 left-0"
							style={{
								transform: `translate3d(${item.x}px, ${-item.y}px, 0)`,
								willChange: 'transform',
							}}
						>
							{CollectibleIcon}
						</div>
					)
			)}
		</>
	)
})

interface BasePetContainerProps {
	name: string
	containerRef: React.RefObject<HTMLButtonElement | null>
	petRef: React.RefObject<HTMLDivElement | null>
	direction: number
	showName?: boolean
	airborne: boolean
	collectibles: CollectibleItem[]
	animationSrc: string
	dimensions: PetDimensions
	assets: PetAssets
	isHungry: boolean
	className?: string
}

export const BasePetContainer = memo(function BasePetContainer({
	name,
	containerRef,
	petRef,
	direction,
	showName,
	airborne,
	collectibles,
	animationSrc,
	dimensions,
	assets,
	isHungry,
	className,
}: BasePetContainerProps) {
	const showToolTip = showName || isHungry

	const [loadedSrcs, setLoadedSrcs] = useState<string[]>(() =>
		animationSrc ? [animationSrc] : []
	)
	if (animationSrc && !loadedSrcs.includes(animationSrc)) {
		setLoadedSrcs([...loadedSrcs, animationSrc])
	}

	return (
		<button
			type="button"
			ref={containerRef}
			aria-label={`غذا دادن به ${name}`}
			className={cn(
				'absolute top-0 bottom-0 flex w-full overflow-hidden focus-visible:focus-ring',
				className
			)}
			style={{
				zIndex: 50,
			}}
		>
			<CollectiblesRenderer collectibles={collectibles} assets={assets} />

			<div
				ref={petRef}
				className="absolute bottom-0 left-0 cursor-pointer"
				style={{
					width: `${dimensions.width}px`,
					height: `${dimensions.size}px`,
					zIndex: 10,
					willChange: 'transform',
				}}
			>
				<div
					className="relative w-full h-full transition-transform duration-300"
					style={{ transform: `scaleX(${direction})` }}
				>
					{showToolTip && (
						<PetTooltip
							direction={direction}
							content={isHungry ? 'غذاااا بدهه' : name}
							emoji={isHungry ? '🍽️' : undefined}
							isAnimation={isHungry}
							placement={airborne ? 'bottom' : 'top'}
						/>
					)}
					{loadedSrcs.map((src) => (
						<img
							key={src}
							src={src}
							alt=""
							aria-hidden="true"
							className="absolute inset-0 object-contain w-full h-full pointer-events-none"
							style={{
								visibility: src === animationSrc ? 'visible' : 'hidden',
							}}
						/>
					))}
				</div>
			</div>
		</button>
	)
})
