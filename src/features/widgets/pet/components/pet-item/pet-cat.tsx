import catFood from '@/assets/animals/cat/cat-food.png'
import idle from '@/assets/animals/cat/zardaloo_idle_8fps.webp'
import lie from '@/assets/animals/cat/zardaloo_lie_8fps.webp'
import running from '@/assets/animals/cat/zardaloo_run_8fps.webp'
import swipe from '@/assets/animals/cat/zardaloo_swipe_8fps.webp'
import walking from '@/assets/animals/cat/zardaloo_walk_fast_8fps.webp'

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

export const CatComponent = ({ className }: { className?: string }) => {
	const { getCurrentPetName, isPetHungry, levelUpHungryState, levelDownHungryState } =
		usePetContext()
	const catAnimations: PetAnimations = {
		idle,
		walk: walking,
		run: running,
		swipe: swipe,
		sit: lie,
	}

	const catDimensions: PetDimensions = {
		size: 25,
		width: 50,
		walkSpeed: PetSpeed.SLOW,
		runSpeed: PetSpeed.NORMAL,
		maxHeight: 100,
	}

	const catAssets: PetAssets = {
		collectibleIcon: <PetFood src={catFood} />,
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
		name: getCurrentPetName(PetTypes.CAT),
		animations: catAnimations,
		dimensions: catDimensions,
		sequence: PET_SEQUENCES[PetTypes.CAT],
		assets: catAssets,
		isHungry: isPetHungry(PetTypes.CAT),
		onCollectibleCollection: () => levelUpHungryState(PetTypes.CAT),
		onLevelDownHungryState: () => levelDownHungryState(PetTypes.CAT),
	})

	return (
		<BasePetContainer
			className={className}
			name={getCurrentPetName(PetTypes.CAT)}
			containerRef={containerRef}
			petRef={petRef}
			position={position}
			direction={direction}
			showName={showName}
			collectibles={collectibles}
			getAnimationForCurrentAction={getAnimationForCurrentAction}
			dimensions={dimensions}
			assets={assets}
			isHungry={isPetHungry(PetTypes.CAT)}
		/>
	)
}
