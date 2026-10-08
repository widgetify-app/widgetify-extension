import { useRef } from 'react'
import { t } from '@/common/i18n'
import { PopoverMenuItem } from '@/components/ui'
import { Icon } from '@/icons'
import { getPetBackground } from './utils/get-pet-background'
import { PetProvider, usePetContext } from './pet.context'
import { PetFactory } from './components/pet-factory'
import { WidgetContainer } from '../components/widget-container'
import { WidgetMenuButton } from '../components/widget-menu-button'
import { useWidgetMenuActions, useWidgetSettingsSummary } from '../widget-menu.context'
import { PET_BACKGROUNDS } from './constants'
import type { PetMeta } from './types'

function PetScene() {
	const { background, backgroundMeta, petType, getCurrentPetName } = usePetContext()
	const scene = getPetBackground(background, backgroundMeta)
	const sceneRef = useRef<HTMLElement>(null)

	const petName = petType ? getCurrentPetName(petType) : ''
	const isKnownScene = scene.id in PET_BACKGROUNDS
	useWidgetSettingsSummary(
		[petName, isKnownScene ? scene.label : null].filter(Boolean).join(' · ') || null
	)
	useWidgetMenuActions(
		<PopoverMenuItem
			icon={<Icon name="heart" size={14} />}
			label={t('widgets.pet.feed')}
			onClick={() => sceneRef.current?.querySelector('button')?.click()}
		/>
	)

	return (
		<WidgetContainer padding={false} background={!scene.image}>
			<section
				ref={sceneRef}
				aria-label={t('widgets.pet.aria')}
				className="relative w-full h-full overflow-hidden isolate rounded-widget"
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
		</WidgetContainer>
	)
}

interface PetWidgetProps {
	meta?: PetMeta
	instanceId?: string
}

export function PetWidget({ meta, instanceId }: PetWidgetProps = {}) {
	return (
		<PetProvider meta={meta} instanceId={instanceId}>
			<div className="relative w-full h-full">
				<PetScene />
				<WidgetMenuButton placement="image" />
			</div>
		</PetProvider>
	)
}

export { PET_PREVIEW, PET_BACKGROUNDS } from './constants'
export { PetTypes, type PetBackgroundId } from './types'
