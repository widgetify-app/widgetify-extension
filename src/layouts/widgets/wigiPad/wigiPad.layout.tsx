import { WidgetContainer } from '../widget-container'
import { ClockDisplay } from './clock-display/clock-display'
import { DateDisplay } from './date-display/date.display'
import { InfoPanel } from './info-panel/info-panel'

export function WigiPadWidget() {
	return (
		<WidgetContainer className="grid grid-cols-2 grid-rows-2 gap-1">
			<DateDisplay />
			<ClockDisplay />
			<div className="col-span-2">
				<InfoPanel />
			</div>
		</WidgetContainer>
	)
}
