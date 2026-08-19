import { PetProvider } from '@/layouts/widgetify-card/pets/pet.context'
import { PetFactory } from '@/layouts/widgetify-card/pets/pet-factory'
import { WidgetContainer } from '../widget-container'
import type { WidgetSize } from '../layout-engine/types'
import { PetCompactSquare } from './variants/pet-compact-square'

interface PetWidgetContentProps {
	size?: WidgetSize
}

function PetWidgetContent({ size = { w: 2, h: 1 } }: PetWidgetContentProps) {
	if (size.w === 1 && size.h === 1) {
		return (
			<WidgetContainer>
				<PetCompactSquare />
			</WidgetContainer>
		)
	}

	return (
		<WidgetContainer className="h-full w-full">
			<div className="relative w-full h-full overflow-hidden">
				<PetFactory className="-bottom-0.5 z-999" />
			</div>
		</WidgetContainer>
	)
}

export function PetWidget({ size = { w: 2, h: 1 } }: { size?: WidgetSize }) {
	return (
		<PetProvider>
			<PetWidgetContent size={size} />
		</PetProvider>
	)
}
