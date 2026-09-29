import { useEffect, useState } from 'react'
import { PetTooltip } from './pet-tooltip'
import { cn } from '@/common/utils/cn'
import type { CollectibleItem, PetAssets, PetDimensions, Position } from '../types'

interface CollectiblesRendererProps {
	collectibles: CollectibleItem[]
	assets: PetAssets
}

const CollectiblesRenderer: React.FC<CollectiblesRendererProps> = ({
	collectibles,
	assets,
}) => {
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
}

interface BasePetContainerProps {
	name: string
	containerRef: React.RefObject<HTMLButtonElement | null>
	petRef: React.RefObject<HTMLDivElement | null>
	position: Position
	direction: number
	showName?: boolean
	collectibles: CollectibleItem[]
	getAnimationForCurrentAction: () => string
	dimensions: PetDimensions
	assets: PetAssets
	isHungry: boolean
	className?: string
}

export const BasePetContainer: React.FC<BasePetContainerProps> = ({
	name,
	containerRef,
	petRef,
	position,
	direction,
	showName,
	collectibles,
	getAnimationForCurrentAction,
	dimensions,
	assets,
	isHungry,
	className,
}) => {
	const showToolTip = showName || isHungry

	const currentSrc = getAnimationForCurrentAction()
	const [loadedSrcs, setLoadedSrcs] = useState<string[]>(() =>
		currentSrc ? [currentSrc] : []
	)

	useEffect(() => {
		if (!currentSrc) return
		setLoadedSrcs((prev) =>
			prev.includes(currentSrc) ? prev : [...prev, currentSrc]
		)
	}, [currentSrc])

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
					transform: `translate3d(${position.x}px, ${-position.y}px, 0)`,
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
							placement={position.y > 0 ? 'bottom' : 'top'}
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
								visibility: src === currentSrc ? 'visible' : 'hidden',
							}}
						/>
					))}
				</div>
			</div>
		</button>
	)
}
