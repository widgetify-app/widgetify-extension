import idle from '@/assets/animals/dog/akita_idle_8fps.gif'
import lie from '@/assets/animals/dog/akita_lie_8fps.gif'
import running from '@/assets/animals/dog/akita_run_8fps.gif'
import swipe from '@/assets/animals/dog/akita_swipe_8fps.gif'
import walking from '@/assets/animals/dog/akita_walk_fast_8fps.gif'
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

export const DogComponent = () => {
	const { getCurrentPetName } = usePetContext()

	const dogAnimations: PetAnimations = {
		idle,
		walk: walking,
		run: running,
		swipe,
		stand: swipe,
		sit: lie,
		climb: walking,
	}

	const dogDimensions: PetDimensions = {
		size: 32,
		walkSpeed: PetSpeed.NORMAL,
		runSpeed: PetSpeed.VERY_FAST,
		climbSpeed: 1.2,
		maxHeight: 100,
	}

	const dogDurations: PetDurations = {
		walk: { min: 3000, max: 8000 },
		run: { min: 1500, max: 4000 },
		rest: { min: 5000, max: 10000 },
		climb: { min: 2000, max: 5000 },
	}
	const dogAssets: PetAssets = {
		collectibleIcon: <LuBone size={24} className="text-gray-500" />,
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
		animations: dogAnimations,
		dimensions: dogDimensions,
		durations: dogDurations,
		assets: dogAssets,
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
			altText="Interactive Dog"
		/>
	)
}
