import { WidgetContainer } from '../widget-container'
import { ClockDisplay, DateDisplay } from './components'

export function WigiPadWidget() {
	return (
		<WidgetContainer className="grid grid-rows-2">
			<div className="grid grid-cols-2">
				<DateDisplay />
				<ClockDisplay />
			</div>
		</WidgetContainer>
	)
}
