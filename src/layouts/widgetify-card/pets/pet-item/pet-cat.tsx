import catFood from '@/assets/animals/cat/cat-food.png'
import idle from '@/assets/animals/cat/zardaloo_idle_8fps.gif'
import lie from '@/assets/animals/cat/zardaloo_lie_8fps.gif'
import running from '@/assets/animals/cat/zardaloo_run_8fps.gif'
import swipe from '@/assets/animals/cat/zardaloo_swipe_8fps.gif'
import walking from '@/assets/animals/cat/zardaloo_walk_fast_8fps.gif'

import { BasePetContainer, useBasePetLogic } from '../core/base-pet'
import { PetFood } from '../core/pet-food'
import {
	type PetAnimations,
	type PetAssets,
	type PetDimensions,
	type PetDurations,
	PetSpeed,
} from '../core/pet-types'
import { usePetContext } from '../pet.context'

export const CatComponent = () => {
	const { getCurrentPetName } = usePetContext()

	const catAnimations: PetAnimations = {
		idle,
		walk: walking,
		run: running,
		swipe: swipe,
		stand: lie,
		sit: lie,
		climb: walking,
	}

	const catDimensions: PetDimensions = {
		size: 25,
		walkSpeed: PetSpeed.SLOW,
		runSpeed: PetSpeed.NORMAL,
		climbSpeed: PetSpeed.NORMAL,
		maxHeight: 100,
	}
	const catDurations: PetDurations = {
		walk: { min: 4000, max: 9000 },
		run: { min: 2000, max: 5000 },
		rest: { min: 6000, max: 12000 },
		climb: { min: 3000, max: 6000 },
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
		name: getCurrentPetName(),
		animations: catAnimations,
		dimensions: catDimensions,
		durations: catDurations,
		assets: catAssets,
	})

	return (
		<BasePetContainer
			name={getCurrentPetName()}
			containerRef={containerRef}
			petRef={petRef}
			position={position}
			direction={direction}
			showName={showName}
			collectibles={collectibles}
			getAnimationForCurrentAction={getAnimationForCurrentAction}
			dimensions={dimensions}
			assets={assets}
			altText="a Dummy Cat"
		/>
	)
}
