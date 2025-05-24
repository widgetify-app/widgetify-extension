import React, { Suspense } from 'react'
import { PetTypes } from './pet.context'
import { frogComponent } from './pet-item/pet-frog'

// Lazy load pet components
const DogComponent = React.lazy(() =>
	import('./pet-item/pet-dog').then((module) => ({ default: module.DogComponent })),
)
const ChickenComponent = React.lazy(() =>
	import('./pet-item/pet-chicken').then((module) => ({
		default: module.ChickenComponent,
	})),
)
const CrabComponent = React.lazy(() =>
	import('./pet-item/pet-crab').then((module) => ({
		default: module.CrabComponent,
	})),
)

interface PetFactoryProps {
	petType: PetTypes | null
}

export const PetFactory: React.FC<PetFactoryProps> = ({ petType }) => {
	if (!petType) return null

	let PetComponent = null
	switch (petType) {
		case PetTypes.DOG_AKITA:
			PetComponent = DogComponent
			break
		case PetTypes.CHICKEN:
			PetComponent = ChickenComponent
			break
		case PetTypes.CRAB:
			PetComponent = CrabComponent
			break
		case PetTypes.FROG:
			PetComponent = frogComponent
			break
		default:
			return null
	}

	return (
		<Suspense fallback={<div></div>}>
			<PetComponent />
		</Suspense>
	)
}
