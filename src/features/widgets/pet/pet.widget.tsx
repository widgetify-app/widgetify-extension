import { getPetBackground } from './utils/get-pet-background'
import { PetProvider, usePetContext } from './pet.context'
import { PetFactory } from './components/pet-factory'
import { WidgetContainer } from '../components/widget-container'
import type { PetMeta } from './types'

function PetScene() {
	const { background, backgroundMeta } = usePetContext()
	const scene = getPetBackground(background, backgroundMeta)

	return (
		<section
			aria-label="حیوان خانگی"
			className="relative w-full h-full overflow-hidden"
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
		</section>
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

export { PET_PREVIEW, PET_BACKGROUNDS } from './constants'
export { PetTypes, type PetBackgroundId } from './types'
