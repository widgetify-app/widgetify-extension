import idle from '@/assets/animals/frog/ghoori_idle_8fps.gif'
import lie from '@/assets/animals/frog/ghoori_lie_8fps.gif'
import running from '@/assets/animals/frog/ghoori_run_8fps.gif'
import swipe from '@/assets/animals/frog/ghoori_swipe_8fps.gif'
import walking from '@/assets/animals/frog/ghoori_walk_8fps.gif'
import walking_fast from '@/assets/animals/frog/ghoori_walk_fast_8fps.gif'
import { LuBug } from 'react-icons/lu'
import { BasePetContainer, useBasePetLogic } from '../core/base-pet'
import {
	type PetAnimations,
	type PetAssets,
	type PetDimensions,
	type PetDurations,
	PetSpeed,
} from '../core/pet-types'
import { PetTypes, usePetContext } from '../pet.context'

export const frogComponent = () => {
	const { getCurrentPetName } = usePetContext()

	const frogAnimations: PetAnimations = {
		idle,
		walk: walking,
		run: running,
		swipe,
		stand: swipe,
		sit: lie,
		climb: walking_fast,
	}

	const frogDimensions: PetDimensions = {
		size: 32,
		walkSpeed: PetSpeed.SLOW,
		runSpeed: PetSpeed.NORMAL,
		climbSpeed: PetSpeed.NORMAL,
		maxHeight: 80,
	}

	const frogDurations: PetDurations = {
		walk: { min: 4000, max: 9000 },
		run: { min: 2000, max: 5000 },
		rest: { min: 6000, max: 12000 },
		climb: { min: 3000, max: 6000 },
	}

	const collectibleColors = [
		'red-400',
		'green-500',
		'purple-300',
		'yellow-200',
		'pink-600',
		'teal-400',
		'cyan-500',
		'indigo-400',
		'lime-300',
		'blue-500',
	]

	const frogAssets: PetAssets = {
		collectibleIcon: (
			<LuBug
				className={`text-${collectibleColors[Math.floor(Math.random() * collectibleColors.length)]}`}
				size={24}
			/>
		),
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
		name: getCurrentPetName(PetTypes.FROG),
		animations: frogAnimations,
		dimensions: frogDimensions,
		durations: frogDurations,
		assets: frogAssets,
	})

	return (
		<BasePetContainer
			name={getCurrentPetName(PetTypes.FROG)}
			containerRef={containerRef}
			petRef={petRef}
			position={position}
			direction={direction}
			showName={showName}
			collectibles={collectibles}
			getAnimationForCurrentAction={getAnimationForCurrentAction}
			dimensions={dimensions}
			assets={assets}
			altText="Interactive Ghoori(frog)"
		/>
	)
}
