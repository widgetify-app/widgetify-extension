import { Pet } from '@/layouts/widgetify-card/pets/pet'
import { PetProvider } from '@/layouts/widgetify-card/pets/pet.context'

export function FloatingPet() {
  return (
    <div className="fixed bottom-0 left-0 w-screen h-20 pointer-events-none z-50">
      <PetProvider>
        <Pet />
      </PetProvider>
    </div>
  )
}