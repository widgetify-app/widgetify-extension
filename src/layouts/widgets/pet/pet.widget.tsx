import { PetProvider } from './pet.context'
import { PetFactory } from './pet-factory'
import { WidgetContainer } from '../widget-container'

export function PetWidget() {
	return (
		<PetProvider>
			<WidgetContainer padding={false} className="w-full h-full">
				<div className="relative w-full h-24 overflow-hidden ">
					<PetFactory className="bottom-0! z-999" />
				</div>
			</WidgetContainer>
		</PetProvider>
	)
}
