import chickenFood from '@/assets/animals/chicken/chicken-food.png'
import idle from '@/assets/animals/chicken/white_idle_8fps.webp'
import running from '@/assets/animals/chicken/white_run_8fps.webp'
import swipe from '@/assets/animals/chicken/white_swipe_8fps.webp'
import walking from '@/assets/animals/chicken/white_walk_fast_8fps.webp'
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

export const ChickenComponent = ({ className }: { className?: string }) => {
	const { getCurrentPetName, isPetHungry, levelUpHungryState, levelDownHungryState } =
		usePetContext()

	const chickenAnimations: PetAnimations = {
		idle,
		walk: walking,
		run: running,
		swipe,
	}

	const chickenDimensions: PetDimensions = {
		size: 32,
		width: 50,
		walkSpeed: PetSpeed.SLOW,
		runSpeed: PetSpeed.FAST,
		maxHeight: 100,
	}

	const chickenAssets: PetAssets = {
		collectibleIcon: <PetFood src={chickenFood} />,
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
		name: getCurrentPetName(PetTypes.CHICKEN),
		animations: chickenAnimations,
		dimensions: chickenDimensions,
		sequence: PET_SEQUENCES[PetTypes.CHICKEN],
		assets: chickenAssets,
		onCollectibleCollection: () => levelUpHungryState(PetTypes.CHICKEN),
		onLevelDownHungryState: () => levelDownHungryState(PetTypes.CHICKEN),
		isHungry: isPetHungry(PetTypes.CHICKEN),
	})

	return (
		<BasePetContainer
			className={className}
			name={getCurrentPetName(PetTypes.CHICKEN)}
			containerRef={containerRef}
			petRef={petRef}
			position={position}
			direction={direction}
			showName={showName}
			collectibles={collectibles}
			getAnimationForCurrentAction={getAnimationForCurrentAction}
			dimensions={dimensions}
			assets={assets}
			isHungry={isPetHungry(PetTypes.CHICKEN)}
		/>
	)
}
