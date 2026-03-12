import { WidgetContainer } from '../widgets/widget-container'
import { NotificationCenter } from './notification-center/notification-center'
import { Pet } from './pets/pet'
import { PetProvider } from './pets/pet.context'

export const WidgetifyLayout = () => {
	return (
		<WidgetContainer className="overflow-hidden !h-72 !min-h-72 !max-h-72">
			<div className="relative w-full h-full">
				{
					<PetProvider>
						<Pet />
					</PetProvider>
				}

				<div className="relative z-10 flex flex-col items-center gap-2 overflow-y-auto h-60 small-scrollbar">
					<div
						className={`flex flex-col flex-1 w-full gap-1 overflow-y-auto small-scrollbar`}
					>
						<NotificationCenter />
					</div>
				</div>
			</div>
		</WidgetContainer>
	)
}
