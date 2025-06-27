import { ClockDisplay } from './clock-display/clock-display'
import { DateDisplay } from './date-display/date.display'
import { InfoPanel } from './info-panel/info-panel'

export function WigiPadWidget() {
	return (
		<div className="h-80 min-h-80 max-h-80 grid grid-cols-2 grid-rows-2 gap-3 !p-0">
			<DateDisplay />
			<ClockDisplay />
			<div className="col-span-2">
				<InfoPanel />
			</div>
		</div>
	)
}
