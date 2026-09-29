import idle from '@/assets/animals/frog/ghoori_idle_8fps.webp'
import lie from '@/assets/animals/frog/ghoori_lie_8fps.webp'
import running from '@/assets/animals/frog/ghoori_run_8fps.webp'
import swipe from '@/assets/animals/frog/ghoori_swipe_8fps.webp'
import walking from '@/assets/animals/frog/ghoori_walk_8fps.webp'
import { useMemo } from 'react'
import { Icon } from '@/icons'
import { useBasePetLogic } from '../../hooks/use-base-pet-logic'
import { BasePetContainer } from '../base-pet'
import {
	type PetAnimations,
	type PetAssets,
	type PetDimensions,
	PetSpeed,
} from '../../types'
import { usePetContext } from '../../pet.context'
import { PET_SEQUENCES } from '../../utils/species-sequences'
import { PetTypes } from '../../types'

const COLLECTIBLE_COLORS = [
	'#f87171',
	'#22c55e',
	'#d8b4fe',
	'#fef08a',
	'#db2777',
	'#2dd4bf',
	'#06b6d4',
	'#818cf8',
	'#bef264',
	'#3b82f6',
]

const FROG_ANIMATIONS: PetAnimations = {
	idle,
	walk: walking,
	run: running,
	swipe,
	sit: lie,
}

const FROG_DIMENSIONS: PetDimensions = {
	size: 32,
	width: 50,
	walkSpeed: PetSpeed.SLOW,
	runSpeed: PetSpeed.NORMAL,
	maxHeight: 80,
	hop: {
		distance: { min: 35, max: 60 },
		height: { min: 12, max: 22 },
		durationMs: 450,
		crouchMs: { min: 500, max: 1200 },
	},
}

export const FrogComponent = ({ className }: { className?: string }) => {
	const { getCurrentPetName, isPetHungry, levelUpHungryState, levelDownHungryState } =
		usePetContext()

	const collectibleColor = useMemo(
		() => COLLECTIBLE_COLORS[Math.floor(Math.random() * COLLECTIBLE_COLORS.length)],
		[]
	)

	const frogAssets: PetAssets = useMemo(
		() => ({
			collectibleIcon: (
				<Icon name="bug" style={{ color: collectibleColor }} size={24} />
			),
			collectibleSize: 24,
			collectibleFallSpeed: 2,
		}),
		[collectibleColor]
	)

	const {
		containerRef,
		petRef,
		direction,
		showName,
		airborne,
		collectibles,
		animationSrc,
		dimensions,
		assets,
	} = useBasePetLogic({
		name: getCurrentPetName(PetTypes.FROG),
		animations: FROG_ANIMATIONS,
		dimensions: FROG_DIMENSIONS,
		sequence: PET_SEQUENCES[PetTypes.FROG],
		assets: frogAssets,
		isHungry: isPetHungry(PetTypes.FROG),
		onCollectibleCollection: () => levelUpHungryState(PetTypes.FROG),
		onLevelDownHungryState: () => levelDownHungryState(PetTypes.FROG),
	})

	return (
		<BasePetContainer
			className={className}
			name={getCurrentPetName(PetTypes.FROG)}
			containerRef={containerRef}
			petRef={petRef}
			direction={direction}
			showName={showName}
			airborne={airborne}
			collectibles={collectibles}
			animationSrc={animationSrc}
			dimensions={dimensions}
			assets={assets}
			isHungry={isPetHungry(PetTypes.FROG)}
		/>
	)
}
