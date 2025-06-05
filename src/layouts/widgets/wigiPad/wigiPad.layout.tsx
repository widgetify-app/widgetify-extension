import { WidgetContainer } from '../widget-container'
import { ClockDisplay } from './clock-display/clock-display'
import { DateDisplay } from './date-display/date.display'

export function WigiPadWidget() {
	return (
		<WidgetContainer className="grid grid-rows-2">
			<div className="grid grid-cols-2">
				<DateDisplay />
				<ClockDisplay />
			</div>
			<div className="grid grid-cols-1"></div>
		</WidgetContainer>
	)
}
