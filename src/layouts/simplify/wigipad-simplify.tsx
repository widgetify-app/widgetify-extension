import { WidgetContainer } from '../widgets/widget-container'
import { DateDisplay } from '../widgets/wigiPad/date-display/date.display'
import { ClockDisplay } from '../widgets/wigiPad/clock-display/clock-display'
import { MdOutlineCloud, MdOutlineTab, MdOutlineTimer } from 'react-icons/md'
import { TabNavigation } from '@/components/tab-navigation'
import { InfoWeather } from '../widgets/wigiPad/info-panel/infoWeather'
import Analytics from '@/analytics'
import { PomodoroTimer } from '../widgets/tools/pomodoro/pomodoro-timer'
import { NotificationCenter } from '../widgetify-card/notification-center/notification-center'
import { useGetNotifications } from '@/services/hooks/extension/getNotifications.hook'
import { RenderWigiPadItem } from '../widgets/wigiPad/info-panel/components/ann-item'
import { WigiPadMain } from '../widgets/wigiPad/wigi-pad-main/wigi-pad-main'
import { PetProvider, usePetContext } from '../widgetify-card/pets/pet.context'
import { Pet } from '../widgetify-card/pets/pet'

const sections = [
	{ id: 'all', label: 'ویجی تب', icon: <MdOutlineTab size={14} /> },
	{ id: 'weather', label: 'آب و هوا', icon: <MdOutlineCloud size={14} /> },
	{ id: 'pomodoro', label: 'پومودورو', icon: <MdOutlineTimer size={14} /> },
]

export function SimplifyYadkar() {
	const { data: fetchedData } = useGetNotifications({})
	return (
		<WidgetContainer className="relative flex flex-col w-full overflow-hidden h-60 max-h-60!">
			<div className="flex flex-col flex-1 min-h-0 gap-2 ">
				<div className="shrink-0">
					<WigiPadMain banner={null} />
				</div>

				<div className="flex-1 min-h-0 pb-10 mt-1 overflow-y-auto scrollbar-none">
					<div className="flex flex-col gap-1.5 pb-2">
						{fetchedData?.wigiPad?.map((notification, index) => (
							<RenderWigiPadItem
								key={`wigipad-item-${index}`}
								notification={notification}
							/>
						))}

						<div className="mt-2">
							<NotificationCenter />
						</div>
					</div>
				</div>
			</div>
			<PetProvider>
				<PetRender />
			</PetProvider>
		</WidgetContainer>
	)
}
function PetRender() {
	const { isEnabled } = usePetContext()
	if (!isEnabled) return null

	return (
		<div className="z-10 h-7 bg-content ">
			<Pet />
		</div>
	)
}
