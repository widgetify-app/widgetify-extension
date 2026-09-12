import { getPetBackground } from './utils/get-pet-background'
import { PetProvider, usePetContext } from './pet.context'
import { PetFactory } from './components/pet-factory'
import { WidgetContainer } from '../widget-container'

function PetScene() {
	const { background } = usePetContext()
	const scene = getPetBackground(background)

	return (
		<div
			className="relative w-full h-24 overflow-hidden"
			style={
				{
					backgroundImage: `url(${scene.image})`,
					backgroundSize: 'auto 100%',
					backgroundPosition: 'bottom center',
					'--pet-ground': `${scene.groundOffsetPx}px`,
				} as React.CSSProperties
			}
		>
			<PetFactory className="bottom-(--pet-ground)" />
		</div>
	)
}

export function PetWidget() {
	return (
		<PetProvider>
			<WidgetContainer padding={false}>
				<PetScene />
			</WidgetContainer>
		</PetProvider>
	)
}
