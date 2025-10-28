import { WidgetContainer } from '../widget-container'
import { ClockDisplay } from './clock-display/clock-display'
import { DateDisplay } from './date-display/date.display'
import { InfoPanel } from './info-panel/info-panel'

export function WigiPadWidget() {
	return (
		<WidgetContainer className="grid grid-cols-2 grid-rows-2 gap-x-2 gap-y-1 !p-2 !h-72 !min-h-72 !max-h-72">
			<DateDisplay />
			<ClockDisplay />
			<div className="col-span-2 ">
				<InfoPanel />
			</div>
		</WidgetContainer>
	)
}
