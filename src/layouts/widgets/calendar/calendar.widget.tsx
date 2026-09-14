import type React from 'react'
import type { WidgetSize } from '../layout-engine/types'
import { WidgetContainer } from '../widget-container'
import { Calendar1x1 } from './variants/calendar-1x1'
import { Calendar2x1 } from './variants/calendar-2x1'
import { Calendar2x3 } from './variants/calendar-2x3'

interface CalendarLayoutProps {
	size?: WidgetSize
}

export const CalendarLayout: React.FC<CalendarLayoutProps> = ({
	size = { w: 2, h: 3 },
}) => {
	if (size.w === 1 && size.h === 1) {
		return (
			<WidgetContainer padding={false} className="h-full">
				<Calendar1x1 />
			</WidgetContainer>
		)
	}

	if (size.w === 2 && size.h === 1) {
		return (
			<WidgetContainer className="h-full">
				<Calendar2x1 />
			</WidgetContainer>
		)
	}

	return (
		<WidgetContainer padding={false} className="flex flex-col h-full">
			<Calendar2x3 />
		</WidgetContainer>
	)
}

export default CalendarLayout
