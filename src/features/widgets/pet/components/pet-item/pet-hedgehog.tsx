import hedgehogFood from '@/assets/animals/hedgehog/hedgehog-food.png'
import idle from '@/assets/animals/hedgehog/hedgehog_idle_8fps.webp'
import lie from '@/assets/animals/hedgehog/hedgehog_lie_8fps.webp'
import running from '@/assets/animals/hedgehog/hedgehog_run_8fps.webp'
import swipe from '@/assets/animals/hedgehog/hedgehog_swipe_8fps.webp'
import walking from '@/assets/animals/hedgehog/hedgehog_walk_8fps.webp'

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

const HEDGEHOG_ANIMATIONS: PetAnimations = {
	idle,
	walk: walking,
	run: running,
	swipe,
	sit: lie,
}

const HEDGEHOG_DIMENSIONS: PetDimensions = {
	size: 32,
	width: 50,
	walkSpeed: PetSpeed.SLOW,
	runSpeed: PetSpeed.NORMAL,
	maxHeight: 100,
}

const HEDGEHOG_ASSETS: PetAssets = {
	collectibleIcon: <PetFood src={hedgehogFood} />,
	collectibleSize: 24,
	collectibleFallSpeed: 2,
}

export const HedgehogComponent = ({ className }: { className?: string }) => {
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
		name: getCurrentPetName(PetTypes.HEDGEHOG),
		animations: HEDGEHOG_ANIMATIONS,
		dimensions: HEDGEHOG_DIMENSIONS,
		sequence: PET_SEQUENCES[PetTypes.HEDGEHOG],
		assets: HEDGEHOG_ASSETS,
		isHungry: isPetHungry(PetTypes.HEDGEHOG),
		onCollectibleCollection: () => levelUpHungryState(PetTypes.HEDGEHOG),
		onLevelDownHungryState: () => levelDownHungryState(PetTypes.HEDGEHOG),
	})

	return (
		<BasePetContainer
			className={className}
			name={getCurrentPetName(PetTypes.HEDGEHOG)}
			containerRef={containerRef}
			petRef={petRef}
			direction={direction}
			showName={showName}
			airborne={airborne}
			collectibles={collectibles}
			animationSrc={animationSrc}
			dimensions={dimensions}
			assets={assets}
			isHungry={isPetHungry(PetTypes.HEDGEHOG)}
		/>
	)
}
