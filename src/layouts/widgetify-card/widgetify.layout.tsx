import { WidgetContainer } from '../widgets/widget-container'
import { NotificationCenter } from './notification-center/notification-center'
import { Pet } from './pets/pet'
import { PetProvider } from './pets/pet.context'

import type { WidgetSize } from '../widgets/layout-engine/types'

interface WidgetifyLayoutProps {
	size?: WidgetSize
}

export const WidgetifyLayout: React.FC<WidgetifyLayoutProps> = ({ size }) => {
	return (
		<WidgetContainer className="overflow-hidden flex flex-col !p-2 h-full">
			<div className="relative w-full h-full">
				{
					<PetProvider>
						<Pet />
					</PetProvider>
				}

				<div className="relative z-10 flex flex-col items-center gap-2 overflow-y-auto h-full small-scrollbar">
					<div
						className={`flex flex-col flex-1 w-full gap-1 overflow-y-auto scrollbar-none pb-2`}
					>
						<NotificationCenter hasBorder />
					</div>
				</div>
			</div>
		</WidgetContainer>
	)
}
