import type React from 'react'
import type { WidgetSize } from '../utils/layout-engine/types'
import { WidgetContainer } from '../components/widget-container'
import { useWidgetSettingsSummary } from '../widget-menu.context'
import type { CalendarDisplay } from './types'
import { normalizeCalendarDisplay } from './utils/normalize-calendar-display'
import { Calendar1x1 } from './variants/calendar-1x1'
import { Calendar2x1 } from './variants/calendar-2x1'
import { Calendar2x3 } from './variants/calendar-2x3'

interface CalendarLayoutProps {
	size?: WidgetSize
	meta?: unknown
}

export const CalendarLayout: React.FC<CalendarLayoutProps> = ({
	size = { w: 2, h: 3 },
	meta,
}) => {
	const display = normalizeCalendarDisplay(meta)
	const isToday = size.w === 1 && size.h === 1

	useWidgetSettingsSummary(isToday ? null : displaySummary(display))

	if (isToday) {
		return (
			<WidgetContainer contentClassName="px-3 py-2.5">
				<Calendar1x1 />
			</WidgetContainer>
		)
	}

	if (size.w === 2 && size.h === 1) {
		return (
			<WidgetContainer contentClassName="px-3 py-2.5 gap-1.5">
				<Calendar2x1 display={display} />
			</WidgetContainer>
		)
	}

	return (
		<WidgetContainer contentClassName="p-3 gap-2">
			<Calendar2x3 display={display} />
		</WidgetContainer>
	)
}

function displaySummary({ showEvents, showMoods }: CalendarDisplay): string {
	if (showEvents && showMoods) return 'رویدادها و حال روز'
	if (showEvents) return 'فقط رویدادها'
	if (showMoods) return 'فقط حال روز'
	return 'فقط تاریخ‌ها'
}

export default CalendarLayout
