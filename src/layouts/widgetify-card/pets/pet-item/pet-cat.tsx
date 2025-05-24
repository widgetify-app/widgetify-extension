import idle from '@/assets/animals/cat/akita_idle_8fps.gif'
import lie from '@/assets/animals/cat/akita_lie_8fps.gif'
import running from '@/assets/animals/cat/akita_run_8fps.gif'
import swipe from '@/assets/animals/cat/akita_swipe_8fps.gif'
import walking from '@/assets/animals/cat/akita_walk_fast_8fps.gif'
import { LuBone } from 'react-icons/lu'
import { BasePetContainer, useBasePetLogic } from '../core/base-pet'
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
		swipe,
		stand: swipe,
		sit: lie,
		climb: walking,
	}

	const catDimensions: PetDimensions = {
		size: 32,
		walkSpeed: PetSpeed.NORMAL,
		runSpeed: PetSpeed.VERY_FAST,
		climbSpeed: 1.2,
		maxHeight: 100,
	}

	const catDurations: PetDurations = {
		walk: { min: 3000, max: 8000 },
		run: { min: 1500, max: 4000 },
		rest: { min: 5000, max: 10000 },
		climb: { min: 2000, max: 5000 },
	}
	const catAssets: PetAssets = {
		collectibleIcon: LuBone,
		collectibleSize: 24,
		collectibleFallSpeed: 2,
		collectibleColor: 'gray-200',
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
		name: getCurrentPetName() || 'Akita',
		animations: catAnimations,
		dimensions: catDimensions,
		durations: catDurations,
		assets: catAssets,
	})

	return (
		<BasePetContainer
			name={getCurrentPetName() || 'Akita'}
			containerRef={containerRef}
			petRef={petRef}
			position={position}
			direction={direction}
			showName={showName}
			collectibles={collectibles}
			getAnimationForCurrentAction={getAnimationForCurrentAction}
			dimensions={dimensions}
			assets={assets}
			altText="Interactive Cat"
		/>
	)
}
