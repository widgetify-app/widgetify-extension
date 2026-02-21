import { WidgetContainer } from '../widgets/widget-container'
import { DateDisplay } from '../widgets/wigiPad/date-display/date.display'
import { ClockDisplay } from '../widgets/wigiPad/clock-display/clock-display'
import { useInfoPanelData } from '../widgets/wigiPad/info-panel/hooks/useInfoPanelData'
import { MdOutlineCloud, MdOutlineTab, MdOutlineTimer } from 'react-icons/md'
import { TabNavigation } from '@/components/tab-navigation'
import { InfoWeather } from '../widgets/wigiPad/info-panel/infoWeather'
import { NotificationItem } from '../widgets/wigiPad/info-panel/components/ann-item'
import Analytics from '@/analytics'
import { PomodoroTimer } from '../widgets/tools/pomodoro/pomodoro-timer'
import { NotificationCenter } from '../widgetify-card/notification-center/notification-center'

const sections = [
	{ id: 'all', label: 'ویجی تب', icon: <MdOutlineTab size={14} /> },
	{ id: 'weather', label: 'آب و هوا', icon: <MdOutlineCloud size={14} /> },
	{ id: 'pomodoro', label: 'پومودورو', icon: <MdOutlineTimer size={14} /> },
]

export function SimplifyYadkar() {
	const [activeSection, setActiveSection] = useState<string>('all')
	const data = useInfoPanelData()
	const tabContainerRef = useRef<HTMLDivElement>(null)

	const onChangeTab = (val: string) => {
		setActiveSection(val)
		Analytics.event(`wigipad_simplify_tab_${val}`)
	}

	const renderContent = () => {
		switch (activeSection) {
			case 'weather':
				return <InfoWeather />
			case 'pomodoro':
				return <PomodoroTimer />

			default:
				return (
					<div className="grid grid-cols-2 grid-rows-2 gap-x-2">
						<DateDisplay />
						<ClockDisplay />
						<div className="col-span-2">
							<div className="overflow-y-auto scrollbar-none max-h-32 min-h-32">
								{data.notifications.map((notification, index) => (
									<NotificationItem
										key={index}
										notification={notification}
									/>
								))}
								<div className="mt-2">
									<NotificationCenter />
								</div>
							</div>
						</div>
					</div>
				)
		}
	}

	return (
		<WidgetContainer className="flex flex-col">
			<div className="relative flex-1 h-60">{renderContent()}</div>
			<div ref={tabContainerRef} className="col-span-2">
				<TabNavigation
					tabMode="advanced"
					activeTab={activeSection}
					onTabClick={(tab) => onChangeTab(tab)}
					tabs={sections}
					size="small"
					className="m-0! py-0.5! border-none! flex-nowrap w-full"
				/>
			</div>
		</WidgetContainer>
	)
}
