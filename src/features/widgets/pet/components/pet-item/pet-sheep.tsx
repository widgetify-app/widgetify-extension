import sheepFood from '@/assets/animals/sheep/sheep-food.png'
import idle from '@/assets/animals/sheep/sheep_idle_8fps.webp'
import lie from '@/assets/animals/sheep/sheep_lie_8fps.webp'
import running from '@/assets/animals/sheep/sheep_run_8fps.webp'
import swipe from '@/assets/animals/sheep/sheep_swipe_8fps.webp'
import walking from '@/assets/animals/sheep/sheep_walk_8fps.webp'

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

const SHEEP_ANIMATIONS: PetAnimations = {
	idle,
	walk: walking,
	run: running,
	swipe,
	sit: lie,
}

const SHEEP_DIMENSIONS: PetDimensions = {
	size: 32,
	width: 50,
	walkSpeed: PetSpeed.SLOW,
	runSpeed: PetSpeed.NORMAL,
	maxHeight: 100,
}

const SHEEP_ASSETS: PetAssets = {
	collectibleIcon: <PetFood src={sheepFood} />,
	collectibleSize: 24,
	collectibleFallSpeed: 2,
}

export const SheepComponent = ({ className }: { className?: string }) => {
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
		name: getCurrentPetName(PetTypes.SHEEP),
		animations: SHEEP_ANIMATIONS,
		dimensions: SHEEP_DIMENSIONS,
		sequence: PET_SEQUENCES[PetTypes.SHEEP],
		assets: SHEEP_ASSETS,
		isHungry: isPetHungry(PetTypes.SHEEP),
		onCollectibleCollection: () => levelUpHungryState(PetTypes.SHEEP),
		onLevelDownHungryState: () => levelDownHungryState(PetTypes.SHEEP),
	})

	return (
		<BasePetContainer
			className={className}
			name={getCurrentPetName(PetTypes.SHEEP)}
			containerRef={containerRef}
			petRef={petRef}
			direction={direction}
			showName={showName}
			airborne={airborne}
			collectibles={collectibles}
			animationSrc={animationSrc}
			dimensions={dimensions}
			assets={assets}
			isHungry={isPetHungry(PetTypes.SHEEP)}
		/>
	)
}
