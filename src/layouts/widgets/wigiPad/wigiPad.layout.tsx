import { TabNavigation } from '@/components/tab-navigation'
import { WidgetContainer } from '../widget-container'
import { ClockDisplay } from './clock-display/clock-display'
import { DateDisplay } from './date-display/date.display'
import { useInfoPanelData } from './info-panel/hooks/useInfoPanelData'
import { MdOutlineCloud, MdOutlineTab } from 'react-icons/md'
import { InfoWeather } from './info-panel/infoWeather'
import { NotificationItem } from './info-panel/components/ann-item'
const sections = [
	{ id: 'all', label: 'ویجی تب', icon: <MdOutlineTab size={14} /> },
	{ id: 'weather', label: 'آب و هوا', icon: <MdOutlineCloud size={14} /> },
]

export function WigiPadWidget() {
	const [activeSection, setActiveSection] = useState<string>('all')
	const data = useInfoPanelData()
	const tabContainerRef = useRef<HTMLDivElement>(null)

	const renderContent = () => {
		switch (activeSection) {
			case 'weather':
				return <InfoWeather />

			default:
				return (
					<div className="grid grid-cols-2 grid-rows-2 gap-x-2">
						<DateDisplay />
						<ClockDisplay />
						<div className="col-span-2">
							<div className="overflow-y-auto scrollbar-none max-h-24 min-h-24">
								{data.notifications.map((notification, index) => (
									<NotificationItem
										key={index}
										notification={notification}
									/>
								))}
							</div>
						</div>
					</div>
				)
		}
	}

	return (
		<WidgetContainer className="flex flex-col !p-2 !h-72 !min-h-72 !max-h-72">
			<div className="flex-1 h-60">{renderContent()}</div>
			<div ref={tabContainerRef} className="col-span-2">
				<TabNavigation
					tabMode="advanced"
					activeTab={activeSection}
					onTabClick={(tab) => setActiveSection(tab)}
					tabs={sections}
					size="small"
					className="m-0! py-0.5! border-none! flex-nowrap w-full"
				/>
			</div>
		</WidgetContainer>
	)
}
