import idle from '@/assets/animals/frog/ghoori_idle_8fps.webp'
import lie from '@/assets/animals/frog/ghoori_lie_8fps.webp'
import running from '@/assets/animals/frog/ghoori_run_8fps.webp'
import swipe from '@/assets/animals/frog/ghoori_swipe_8fps.webp'
import walking from '@/assets/animals/frog/ghoori_walk_8fps.webp'
import walking_fast from '@/assets/animals/frog/ghoori_walk_fast_8fps.webp'
import { useMemo } from 'react'
import { LuBug } from 'react-icons/lu'
import { BasePetContainer, useBasePetLogic } from '../core/base-pet'
import {
	type PetAnimations,
	type PetAssets,
	type PetDimensions,
	type PetDurations,
	PetSpeed,
} from '../core/pet-types'
import { PetTypes, usePetContext } from '../pet.context'

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

export const FrogComponent = ({ className }: { className?: string }) => {
	const {
		getCurrentPetName,
		isPetHungry,
		levelUpHungryState,
		levelDownHungryState,
		getPetHungryState,
	} = usePetContext()
	const frogAnimations: PetAnimations = {
		idle,
		walk: walking,
		run: running,
		swipe,
		stand: swipe,
		sit: lie,
		climb: walking_fast,
	}

	const frogDimensions: PetDimensions = {
		size: 32,
		width: 50,
		walkSpeed: PetSpeed.SLOW,
		runSpeed: PetSpeed.NORMAL,
		climbSpeed: PetSpeed.NORMAL,
		maxHeight: 80,
	}

	const frogDurations: PetDurations = {
		walk: { min: 4000, max: 9000 },
		run: { min: 2000, max: 5000 },
		rest: { min: 6000, max: 12000 },
		climb: { min: 3000, max: 6000 },
	}


	const collectibleColor = useMemo(
		() => COLLECTIBLE_COLORS[Math.floor(Math.random() * COLLECTIBLE_COLORS.length)],
		[]
	)

	const frogAssets: PetAssets = {
		collectibleIcon: <LuBug style={{ color: collectibleColor }} size={24} />,
		collectibleSize: 24,
		collectibleFallSpeed: 2,
	}

	const {
		containerRef,
		petRef,
		position,
		direction,
		showName,
		collectibles,
		getAnimationForCurrentAction,
		dimensions,
		assets,
	} = useBasePetLogic({
		name: getCurrentPetName(PetTypes.FROG),
		animations: frogAnimations,
		dimensions: frogDimensions,
		durations: frogDurations,
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
			position={position}
			direction={direction}
			showName={showName}
			collectibles={collectibles}
			getAnimationForCurrentAction={getAnimationForCurrentAction}
			dimensions={dimensions}
			assets={assets}
			isHungry={isPetHungry(PetTypes.FROG)}
		/>
	)
}
