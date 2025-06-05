import { WidgetContainer } from '../widget-container'
import { ClockDisplay } from './clock-display/clock-display'
import { DateDisplay } from './date-display/date.display'
import { InfoPanel } from './info-panel/info-panel'

export function WigiPadWidget() {
	return (
		<WidgetContainer className="grid grid-rows-2 gap-0">
			<div className="grid grid-cols-2">
				<DateDisplay />
				<ClockDisplay />
			</div>
			<div className="grid grid-cols-1">
				<InfoPanel />
			</div>
		</WidgetContainer>
	)
}
