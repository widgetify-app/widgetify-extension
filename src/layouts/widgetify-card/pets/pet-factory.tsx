import React, { Suspense } from 'react'
import { PetTypes } from './pet.context'

// Lazy load pet components
const DogComponent = React.lazy(() =>
	import('./pet-item/pet-dog').then((module) => ({ default: module.DogComponent })),
)
const ChickenComponent = React.lazy(() =>
	import('./pet-item/pet-chicken').then((module) => ({
		default: module.ChickenComponent,
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
		default:
			return null
	}

	return (
		<Suspense fallback={<div className="h-32"></div>}>
			<PetComponent />
		</Suspense>
	)
}
