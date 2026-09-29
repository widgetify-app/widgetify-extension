import owlFood from '@/assets/animals/owl/owl-food.png'
import fly from '@/assets/animals/owl/owl_fly_8fps.webp'
import idle from '@/assets/animals/owl/owl_idle_8fps.webp'
import lie from '@/assets/animals/owl/owl_lie_8fps.webp'
import swipe from '@/assets/animals/owl/owl_swipe_8fps.webp'

import { BasePetContainer, useBasePetLogic } from '../base-pet'
import { PetFood } from '../pet-food'
import {
	type PetAnimations,
	type PetAssets,
	type PetDimensions,
	type PetDurations,
	PetSpeed,
} from '../../types'
import { usePetContext } from '../../pet.context'
import { PetTypes } from '../../types'

export const OwlComponent = ({ className }: { className?: string }) => {
	const { getCurrentPetName, isPetHungry, levelUpHungryState, levelDownHungryState } =
		usePetContext()
	const owlAnimations: PetAnimations = {
		idle,
		walk: fly,
		run: fly,
		fly,
		swipe: swipe,
		stand: idle,
		sit: lie,
	}

	const owlDimensions: PetDimensions = {
		size: 32,
		width: 50,
		walkSpeed: 1.3,
		runSpeed: 2.4,
		climbSpeed: PetSpeed.NORMAL,
		maxHeight: 100,
		flight: {
			cruiseMin: 12,
			cruiseMax: 28,
			bobAmplitude: 3,
			bobPeriodMs: 900,
			climbRate: 0.9,
			landRate: 0.7,
			diveRate: 1.4,
			diveSlope: 0.5,
		},
	}
	const owlDurations: PetDurations = {
		walk: { min: 4000, max: 9000 },
		run: { min: 2000, max: 5000 },
		rest: { min: 6000, max: 12000 },
		climb: { min: 3000, max: 6000 },
	}

	const owlAssets: PetAssets = {
		collectibleIcon: <PetFood src={owlFood} />,
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
		name: getCurrentPetName(PetTypes.OWL),
		animations: owlAnimations,
		dimensions: owlDimensions,
		durations: owlDurations,
		assets: owlAssets,
		isHungry: isPetHungry(PetTypes.OWL),
		onCollectibleCollection: () => levelUpHungryState(PetTypes.OWL),
		onLevelDownHungryState: () => levelDownHungryState(PetTypes.OWL),
	})

	return (
		<BasePetContainer
			className={className}
			name={getCurrentPetName(PetTypes.OWL)}
			containerRef={containerRef}
			petRef={petRef}
			position={position}
			direction={direction}
			showName={showName}
			collectibles={collectibles}
			getAnimationForCurrentAction={getAnimationForCurrentAction}
			dimensions={dimensions}
			assets={assets}
			isHungry={isPetHungry(PetTypes.OWL)}
		/>
	)
}
