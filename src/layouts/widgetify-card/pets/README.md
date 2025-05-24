# Pet System Architecture

This document describes how the pet system is designed and how to add new pets to the application.

## Overview

The pet system uses a modular architecture that allows for easy addition of new pet types. Each pet shares common behavior logic but can have unique characteristics, animations, and collectibles.

## Directory Structure

```
/pets
  /core
    base-pet.tsx        - Contains the shared pet behavior logic, collectible rendering, and base container
    pet-types.ts        - Contains type definitions for pets
  /pet-item
    pet-chicken.tsx     - Chicken pet implementation
    pet-dog.tsx         - Dog pet implementation
    ... (other pet implementations)
  pet.context.tsx       - Context provider for pet settings
  pet-factory.tsx       - Factory for creating pet components
  pet.tsx               - Main pet component
```

## How to Add a New Pet

To add a new pet to the system:

1. **Add the pet type to the enum in pet.context.tsx**:

```tsx
export enum PetTypes {
  DOG_AKITA = 'dog-akita',
  CHICKEN = 'chicken',
  YOUR_NEW_PET = 'your-new-pet', // Add your new pet here
}
```

2. **Add a default name for your pet**:

```tsx
const DEFAULT_SETTINGS: PetSettings = {
  enablePets: true,
  petType: null,
  petOptions: {
    [PetTypes.DOG_AKITA]: {
      name: 'آکیتا',
    },
    [PetTypes.CHICKEN]: {
      name: 'قدقدپور',
    },
    [PetTypes.YOUR_NEW_PET]: { // Add your new pet here
      name: 'Your Pet Name',
    },
  },
}
```

3. **Create a new pet component file** in the `/pet-item` directory:

The easiest way is to copy the `pet-template.tsx` file and modify it for your new pet. Here's a simplified example:

```tsx
// pet-item/pet-your-new-pet.tsx
import idle from '@/assets/animals/your-pet/your_pet_idle_8fps.gif'
import running from '@/assets/animals/your-pet/your_pet_run_8fps.gif'
import swipe from '@/assets/animals/your-pet/your_pet_swipe_8fps.gif'
import walking from '@/assets/animals/your-pet/your_pet_walk_fast_8fps.gif'
import { YourCollectibleIcon } from 'react-icons/xx'
import { BasePetContainer, useBasePetLogic } from '../core/base-pet'
import { PetSpeed } from '../core/pet-types'
import { usePetContext } from '../pet.context'

export const YourPetComponent = () => {
  const { getCurrentPetName } = usePetContext()
  
  // Define animations, dimensions, durations and assets for your pet
  const petAnimations = {
    idle,
    walk: walking,
    run: running,
    swipe,
    stand: swipe,
    climb: walking
  }
  
  const petDimensions = {
    size: 32,
    walkSpeed: PetSpeed.NORMAL,
    runSpeed: PetSpeed.VERY_FAST,
    climbSpeed: 1.2,
    maxHeight: 100
  }
  
  const petDurations = {
    walk: { min: 3000, max: 8000 },
    run: { min: 1500, max: 4000 },
    rest: { min: 5000, max: 10000 },
    climb: { min: 4000, max: 7000 }
  }
  
  const petAssets = {
    collectibleIcon: YourCollectibleIcon,
    collectibleSize: 24,
    collectibleFallSpeed: 2,
    collectibleColor: 'blue-500', // Tailwind color class
  }

  // Use the base pet logic
  const {
    containerRef,
    petRef,
    position,
    direction,
    showName,
    collectibles,
    getAnimationForCurrentAction,
    dimensions,
    assets
  } = useBasePetLogic({
    name: getCurrentPetName() || 'Your Pet Default Name',
    animations: petAnimations,
    dimensions: petDimensions,
    durations: petDurations,
    assets: petAssets
  })

  // Use the BasePetContainer component for consistent rendering
  return (
    <BasePetContainer 
      name={getCurrentPetName() || 'Your Pet Default Name'}
      containerRef={containerRef}
      petRef={petRef}
      position={position}
      direction={direction}
      showName={showName}
      collectibles={collectibles}
      getAnimationForCurrentAction={getAnimationForCurrentAction}
      dimensions={dimensions}
      assets={assets}
      altText="Interactive Pet"
    />
  )
}
```

4. **Update the PetFactory** in `pet-factory.tsx` to include your new pet:

```tsx
// Add the import for your new pet component
const YourPetComponent = React.lazy(() => import('./pet-item/pet-your-new-pet').then(module => ({ default: module.YourPetComponent })));

// Add the case for your new pet in the switch statement
switch (petType) {
  case PetTypes.DOG_AKITA:
    PetComponent = DogComponent;
    break;
  case PetTypes.CHICKEN:
    PetComponent = ChickenComponent;
    break;
  case PetTypes.YOUR_NEW_PET:
    PetComponent = YourPetComponent;
    break;
  default:
    return null;
}
```

5. **Add your pet animations** to the assets folder:
   - Ensure your animations follow the naming convention: `<pet_name>_<action>_8fps.gif`
   - Place them in the appropriate folder: `@/assets/animals/your-pet/`

## Pet Behaviors and Animations

Pets share these common behaviors:
- Walking/running
- Resting (idle or sitting)
- Climbing walls
- Chasing collectible items
- Interaction with users when clicked

Each pet needs at least these animations:
- Idle
- Walk
- Run
- Stand/Swipe

## Customizing Pet Behavior

You can customize various aspects of your pet:

- **Speed**: Choose from predefined speeds in `PetSpeed` Enum
- **Size**: Adjust the pixel size of the pet
- **Animation durations**: Control how long each behavior lasts
- **Collectibles**: Define what the pet chases and collects

## Styling and Positioning

All pets use a common container that positions them at the bottom of the screen. You can customize this if needed for specific pet types.

## Creating Pet Assets

For a cohesive look, pet animations should:
- Be pixel art style
- Have a transparent background
- Run at 8 frames per second
- Include all the required actions (idle, walk, run, etc.)
- Be sized appropriately for the dimension settings
