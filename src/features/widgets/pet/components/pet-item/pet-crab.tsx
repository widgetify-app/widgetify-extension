import crabFood from '@/assets/animals/crab/crab-food.png'
import idle from '@/assets/animals/crab/red_idle_8fps.webp'
import running from '@/assets/animals/crab/red_run_8fps.webp'
import swipe from '@/assets/animals/crab/red_swipe_8fps.webp'
import walking from '@/assets/animals/crab/red_walk_fast_8fps.webp'

import { useBasePetLogic } from '../../hooks/use-base-pet-logic'
import { BasePetContainer } from '../base-pet'
import { PetFood } from '../pet-food'
import {
	type PetAnimations,
	type PetAssets,
	type PetDimensions,
	PetSpeed,
} from '../../types'
import { usePetContext } from '../../pet.context'
import { PET_SEQUENCES } from '../../utils/species-sequences'
import { PetTypes } from '../../types'

const CRAB_ANIMATIONS: PetAnimations = {
	idle,
	walk: walking,
	run: running,
	swipe,
}

const CRAB_DIMENSIONS: PetDimensions = {
	size: 32,
	width: 50,
	walkSpeed: PetSpeed.SLOW,
	runSpeed: PetSpeed.NORMAL,
	maxHeight: 80,
	sidestep: true,
}

const CRAB_ASSETS: PetAssets = {
	collectibleIcon: <PetFood src={crabFood} />,
	collectibleSize: 24,
	collectibleFallSpeed: 2,
}

export const CrabComponent = ({ className }: { className?: string }) => {
	const { getCurrentPetName, isPetHungry, levelUpHungryState, levelDownHungryState } =
		usePetContext()

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
		name: getCurrentPetName(PetTypes.CRAB),
		animations: CRAB_ANIMATIONS,
		dimensions: CRAB_DIMENSIONS,
		sequence: PET_SEQUENCES[PetTypes.CRAB],
		assets: CRAB_ASSETS,
		isHungry: isPetHungry(PetTypes.CRAB),
		onCollectibleCollection: () => levelUpHungryState(PetTypes.CRAB),
		onLevelDownHungryState: () => levelDownHungryState(PetTypes.CRAB),
	})

	return (
		<BasePetContainer
			className={className}
			name={getCurrentPetName(PetTypes.CRAB)}
			containerRef={containerRef}
			petRef={petRef}
			direction={direction}
			showName={showName}
			airborne={airborne}
			collectibles={collectibles}
			animationSrc={animationSrc}
			dimensions={dimensions}
			assets={assets}
			isHungry={isPetHungry(PetTypes.CRAB)}
		/>
	)
}
