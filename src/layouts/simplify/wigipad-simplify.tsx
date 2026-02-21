import { WidgetContainer } from '../widgets/widget-container'
import { DateDisplay } from '../widgets/wigiPad/date-display/date.display'
import { ClockDisplay } from '../widgets/wigiPad/clock-display/clock-display'
import { InfoPanel } from '../widgets/wigiPad/info-panel/info-panel'

export function SimplifyYadkar() {
	return (
		<WidgetContainer className="grid grid-cols-2 grid-rows-2 gap-x-2 gap-y-1 !p-2">
			<DateDisplay />
			<ClockDisplay />
			<div className="col-span-2 ">
				<InfoPanel />
			</div>
		</WidgetContainer>
	)
}
