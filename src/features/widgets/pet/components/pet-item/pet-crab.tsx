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

export const CrabComponent = ({ className }: { className?: string }) => {
	const { getCurrentPetName, isPetHungry, levelUpHungryState, levelDownHungryState } =
		usePetContext()

	const crabAnimations: PetAnimations = {
		idle,
		walk: walking,
		run: running,
		swipe,
	}

	const crabDimensions: PetDimensions = {
		size: 32,
		width: 50,
		walkSpeed: PetSpeed.SLOW,
		runSpeed: PetSpeed.NORMAL,
		maxHeight: 80,
		sidestep: true,
	}

	const crabAssets: PetAssets = {
		collectibleIcon: <PetFood src={crabFood} />,
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
		name: getCurrentPetName(PetTypes.CRAB),
		animations: crabAnimations,
		dimensions: crabDimensions,
		sequence: PET_SEQUENCES[PetTypes.CRAB],
		assets: crabAssets,
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
			position={position}
			direction={direction}
			showName={showName}
			collectibles={collectibles}
			getAnimationForCurrentAction={getAnimationForCurrentAction}
			dimensions={dimensions}
			assets={assets}
			isHungry={isPetHungry(PetTypes.CRAB)}
		/>
	)
}
