import { WidgetContainer } from '../widgets/widget-container'
import { NotificationCenter } from '../widgetify-card/notification-center/notification-center'
import { useGetNotifications } from '@/services/hooks/extension/getNotifications.hook'
import { RenderWigiPadItem } from '../widgets/wigiPad/info-panel/components/ann-item'
import { PetProvider, usePetContext } from '../widgetify-card/pets/pet.context'
import { Pet } from '../widgetify-card/pets/pet'
import { DateDisplay } from '../widgets/wigiPad/date-display/date.display'
import { ClockDisplay } from '../widgets/wigiPad/clock-display/clock-display'

export function SimplifyYadkar() {
	const { data: fetchedData } = useGetNotifications({})

	const hasBanner = !!fetchedData?.wigipadBanner

	return (
		<WidgetContainer className="relative flex flex-col w-full overflow-hidden h-60 max-h-60!">
			<div className="relative grid justify-between grid-cols-2 border border-content rounded-2xl">
				{hasBanner ? (
					<>
						<div
							className="absolute inset-0 transition-transform duration-500 scale-100 bg-center bg-cover rounded-2xl"
							style={{
								backgroundImage: `url(${fetchedData?.wigipadBanner})`,
							}}
						/>
						<div className="absolute inset-0 bg-neutral/50 backdrop-blur-[0.7px] rounded-2xl" />
					</>
				) : null}
				<DateDisplay />
				<ClockDisplay />
			</div>

			<div className="col-span-2 px-1 mt-1 mb-1">
				<div className="overflow-y-auto scrollbar-none max-h-30 min-h-30">
					<div className="pb-8">
						{fetchedData?.wigiPad?.map((notification, index) => (
							<RenderWigiPadItem
								key={`wigipad-item-${index}`}
								notification={notification}
							/>
						))}
						<NotificationCenter />
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
		<div className="z-10 w-full h-6 -mb-5 overflow-hidden">
			<Pet />
		</div>
	)
}

// export function SimplifyYadkar() {
// 	const [activeSection, setActiveSection] = useState<string>('all')
// 	const tabContainerRef = useRef<HTMLDivElement>(null)

// 	const onChangeTab = (val: string) => {
// 		setActiveSection(val)
// 		Analytics.event(`wigipad_simplify_tab_${val}`)
// 	}

// 	const renderContent = () => {
// 		switch (activeSection) {
// 			case 'weather':
// 				return <InfoWeather />
// 			case 'pomodoro':
// 				return <PomodoroTimer />

// 			default:
// 				return (
// 					<div className="grid grid-cols-2 grid-rows-2 gap-x-2">
// 						<DateDisplay />
// 						<ClockDisplay />
// 						<div className="col-span-2">
// 							<div className="overflow-y-auto scrollbar-none max-h-32 min-h-32">
// 								<div className="pb-2 mt-2">
// 									<NotificationCenter />
// 								</div>
// 							</div>
// 						</div>
// 					</div>
// 				)
// 		}
// 	}

// 	return (
// 		<WidgetContainer className="flex flex-col">
// 			<div className="relative flex-1 h-60">{renderContent()}</div>
// 		</WidgetContainer>
// 	)
// }
