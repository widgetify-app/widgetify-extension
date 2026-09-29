import owlFood from '@/assets/animals/owl/owl-food.png'
import fly from '@/assets/animals/owl/owl_fly_8fps.webp'
import idle from '@/assets/animals/owl/owl_idle_8fps.webp'
import lie from '@/assets/animals/owl/owl_lie_8fps.webp'
import swipe from '@/assets/animals/owl/owl_swipe_8fps.webp'

import { useBasePetLogic } from '../../hooks/use-base-pet-logic'
import { BasePetContainer } from '../base-pet'
import { PetFood } from '../pet-food'
import type { PetAnimations, PetAssets, PetDimensions } from '../../types'
import { usePetContext } from '../../pet.context'
import { PET_SEQUENCES } from '../../utils/species-sequences'
import { PetTypes } from '../../types'

const OWL_ANIMATIONS: PetAnimations = {
	idle,
	walk: fly,
	run: fly,
	fly,
	swipe: swipe,
	sit: lie,
}

const OWL_DIMENSIONS: PetDimensions = {
	size: 32,
	width: 50,
	walkSpeed: 1.3,
	runSpeed: 2.4,
	maxHeight: 100,
	flight: {
		cruiseMin: 12,
		cruiseMax: 56,
		bobAmplitude: 3,
		bobPeriodMs: 900,
		climbRate: 0.9,
		landRate: 0.7,
		diveRate: 1.4,
		diveSlope: 0.5,
	},
}

const OWL_ASSETS: PetAssets = {
	collectibleIcon: <PetFood src={owlFood} />,
	collectibleSize: 24,
	collectibleFallSpeed: 2,
}

export const OwlComponent = ({ className }: { className?: string }) => {
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
		name: getCurrentPetName(PetTypes.OWL),
		animations: OWL_ANIMATIONS,
		dimensions: OWL_DIMENSIONS,
		sequence: PET_SEQUENCES[PetTypes.OWL],
		assets: OWL_ASSETS,
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
			direction={direction}
			showName={showName}
			airborne={airborne}
			collectibles={collectibles}
			animationSrc={animationSrc}
			dimensions={dimensions}
			assets={assets}
			isHungry={isPetHungry(PetTypes.OWL)}
		/>
	)
}
