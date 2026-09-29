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

const CHICKEN_ANIMATIONS: PetAnimations = {
	idle,
	walk: walking,
	run: running,
	swipe,
}

const CHICKEN_DIMENSIONS: PetDimensions = {
	size: 32,
	width: 50,
	walkSpeed: PetSpeed.SLOW,
	runSpeed: PetSpeed.FAST,
	maxHeight: 100,
}

const CHICKEN_ASSETS: PetAssets = {
	collectibleIcon: <PetFood src={chickenFood} />,
	collectibleSize: 24,
	collectibleFallSpeed: 2,
}

export const ChickenComponent = ({ className }: { className?: string }) => {
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
		name: getCurrentPetName(PetTypes.CHICKEN),
		animations: CHICKEN_ANIMATIONS,
		dimensions: CHICKEN_DIMENSIONS,
		sequence: PET_SEQUENCES[PetTypes.CHICKEN],
		assets: CHICKEN_ASSETS,
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
			direction={direction}
			showName={showName}
			airborne={airborne}
			collectibles={collectibles}
			animationSrc={animationSrc}
			dimensions={dimensions}
			assets={assets}
			isHungry={isPetHungry(PetTypes.CHICKEN)}
		/>
	)
}
