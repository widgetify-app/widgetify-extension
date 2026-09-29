import idle from '@/assets/animals/dog/akita_idle_8fps.webp'
import lie from '@/assets/animals/dog/akita_lie_8fps.webp'
import running from '@/assets/animals/dog/akita_run_8fps.webp'
import swipe from '@/assets/animals/dog/akita_swipe_8fps.webp'
import walking from '@/assets/animals/dog/akita_walk_fast_8fps.webp'
import dogFood from '@/assets/animals/dog/dog-food.png'
import { PetFood } from '../pet-food'

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

export const DogComponent = ({ className }: { className?: string }) => {
	const { getCurrentPetName, isPetHungry, levelUpHungryState, levelDownHungryState } =
		usePetContext()

	const dogAnimations: PetAnimations = {
		idle,
		walk: walking,
		run: running,
		swipe,
		sit: lie,
	}

	const dogDimensions: PetDimensions = {
		size: 32,
		width: 50,
		walkSpeed: PetSpeed.NORMAL,
		runSpeed: PetSpeed.VERY_FAST,
		maxHeight: 100,
	}

	const dogAssets: PetAssets = {
		collectibleIcon: <PetFood src={dogFood} />,
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
		name: getCurrentPetName(PetTypes.DOG),
		animations: dogAnimations,
		dimensions: dogDimensions,
		sequence: PET_SEQUENCES[PetTypes.DOG],
		assets: dogAssets,
		isHungry: isPetHungry(PetTypes.DOG),
		onCollectibleCollection: () => levelUpHungryState(PetTypes.DOG),
		onLevelDownHungryState: () => levelDownHungryState(PetTypes.DOG),
	})

	return (
		<BasePetContainer
			className={className}
			name={getCurrentPetName(PetTypes.DOG)}
			containerRef={containerRef}
			petRef={petRef}
			position={position}
			direction={direction}
			showName={showName}
			collectibles={collectibles}
			getAnimationForCurrentAction={getAnimationForCurrentAction}
			dimensions={dimensions}
			assets={assets}
			isHungry={isPetHungry(PetTypes.DOG)}
		/>
	)
}
