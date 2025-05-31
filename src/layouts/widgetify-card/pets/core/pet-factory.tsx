import React from 'react'
import { PetTypes } from '../pet.context'

const PetDogComponent = React.lazy(() =>
  import('../pet-item/pet-dog').then((module) => ({
    default: module.DogComponent,
  })),
)
const PetChickenComponent = React.lazy(() =>
  import('../pet-item/pet-chicken').then((module) => ({
    default: module.ChickenComponent,
  })),
)

interface PetFactoryProps {
  petType: PetTypes | null
  name: string
}

export const PetFactory: React.FC<PetFactoryProps> = ({ petType }) => {
  if (!petType) return null

  switch (petType) {
    case PetTypes.DOG_AKITA:
      return <PetDogComponent />
    case PetTypes.CHICKEN:
      return <PetChickenComponent />
    default:
      return null
  }
}
