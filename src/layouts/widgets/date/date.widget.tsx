import { DateDisplay } from '../wigi-pad/date-display/date.display'
import { WidgetContainer } from '../widget-container'
import type { WidgetSize } from '../layout-engine/types'
import { DateCompactSquare } from './variants/date-1x1'
import { DateCompactRow } from './variants/date-2x1'
import { DateWideBanner } from './variants/date-4x1'

interface DateWidgetProps {
	size?: WidgetSize
}

export function DateWidget({ size = { w: 2, h: 2 } }: DateWidgetProps) {
	if (size.w === 1 && size.h === 1) {
		return (
			<WidgetContainer className="h-full w-full">
				<DateCompactSquare />
			</WidgetContainer>
		)
	}

	if (size.w === 2 && size.h === 1) {
		return (
			<WidgetContainer className="h-full w-full">
				<DateCompactRow />
			</WidgetContainer>
		)
	}

	if (size.w >= 4 && size.h === 1) {
		return (
			<WidgetContainer className="h-full w-full">
				<DateWideBanner />
			</WidgetContainer>
		)
	}

	return (
		<WidgetContainer className="flex flex-col items-center justify-center p-2 h-full w-full">
			<DateDisplay />
		</WidgetContainer>
	)
}
