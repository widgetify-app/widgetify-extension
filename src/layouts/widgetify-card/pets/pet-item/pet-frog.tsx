import idle from '@/assets/animals/frog/ghoori_idle_8fps.gif'
import lie from '@/assets/animals/frog/ghoori_lie_8fps.gif'
import running from '@/assets/animals/frog/ghoori_walk_fast_8fps.gif'
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
import { usePetContext } from '../pet.context'

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
		climbSpeed: 0.8,
		maxHeight: 80,
    }

    const frogDurations: PetDurations = {
       walk: { min: 4000, max: 9000 },
		run: { min: 2000, max: 5000 },
		rest: { min: 6000, max: 12000 },
		climb: { min: 3000, max: 6000 },
    }
    const frogAssets: PetAssets = {
        collectibleIcon: LuBug,
        collectibleSize: 24,
        collectibleFallSpeed: 2,
        collectibleColor: 'blue-300',
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
        name: getCurrentPetName() || 'Ghoori',
        animations: frogAnimations,
        dimensions: frogDimensions,
        durations: frogDurations,
        assets: frogAssets,
    })

    return (
        <BasePetContainer
            name={getCurrentPetName() || 'Ghoori'}
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
