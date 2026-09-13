import { getPetBackground } from './utils/get-pet-background'
import { PetProvider, usePetContext } from './pet.context'
import { PetFactory } from './components/pet-factory'
import { WidgetContainer } from '../widget-container'
import type { PetMeta } from './types'

function PetScene() {
	const { background } = usePetContext()
	const scene = getPetBackground(background)

	return (
		<div
			className="relative w-full h-24 overflow-hidden"
			style={
				{
					backgroundImage: scene.image ? `url(${scene.image})` : undefined,
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

interface PetWidgetProps {
	meta?: PetMeta
	instanceId?: string
}

export function PetWidget({ meta, instanceId }: PetWidgetProps = {}) {
	return (
		<PetProvider meta={meta} instanceId={instanceId}>
			<WidgetContainer padding={false}>
				<PetScene />
			</WidgetContainer>
		</PetProvider>
	)
}
