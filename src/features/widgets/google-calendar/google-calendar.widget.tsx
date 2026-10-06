import { PopoverMenuItem } from '@/components/ui'
import { useWidgetMenuActions } from '@/features/widgets/widget-menu.context'
import { Icon } from '@/icons'
import type { WidgetSize } from '../utils/layout-engine/types'
import { WidgetContainer } from '../components/widget-container'
import { GoogleCalendarAuth } from './components/google-calendar-auth'
import { useGoogleCalendarSchedule } from './hooks/use-google-calendar-schedule'
import type { GoogleCalendarVariant } from './types'
import { GoogleCalendar1x1 } from './variants/google-calendar-1x1'
import { GoogleCalendar2x1 } from './variants/google-calendar-2x1'
import { GoogleCalendarAgenda } from './variants/google-calendar-agenda'
import { GoogleCalendarSchedule } from './variants/google-calendar-schedule'
import { GoogleCalendarTimeline } from './variants/google-calendar-timeline'

export { GoogleCalendarTab } from './components/google-calendar-tab'

interface GoogleCalendarWidgetProps {
	size?: WidgetSize
	meta?: { variant?: GoogleCalendarVariant | string }
}

export function GoogleCalendarWidget({
	size = { w: 2, h: 3 },
	meta,
}: GoogleCalendarWidgetProps) {
	const {
		isAuthenticated,
		isCalendarConnected,
		today,
		currentTime,
		selectedDay,
		setSelectedDay,
		weekDays,
		eventsByDate,
		classifiedEvents,
		rawEvents,
		isLoading,
		isError,
		refetch,
		openEvent,
	} = useGoogleCalendarSchedule()

	useWidgetMenuActions(
		isCalendarConnected && (
			<PopoverMenuItem
				icon={<Icon name="refresh" size={14} />}
				label="بارگذاری مجدد"
				onClick={() => refetch()}
			/>
		)
	)

	const isCompact = size.h === 1
	const containerClass = isCompact ? 'px-3 py-2.5' : 'p-3 gap-2'

	if (!isCalendarConnected) {
		return (
			<WidgetContainer contentClassName={containerClass}>
				<GoogleCalendarAuth isAuthenticated={isAuthenticated} size={size} />
			</WidgetContainer>
		)
	}

	const smallProps = {
		classifiedEvents,
		isLoading,
		isError,
		onEventClick: openEvent,
		onRetry: refetch,
	}

	if (size.w === 1 && size.h === 1) {
		return (
			<WidgetContainer contentClassName={containerClass}>
				<GoogleCalendar1x1 {...smallProps} />
			</WidgetContainer>
		)
	}

	if (size.w === 2 && size.h === 1) {
		return (
			<WidgetContainer contentClassName={containerClass}>
				<GoogleCalendar2x1 {...smallProps} />
			</WidgetContainer>
		)
	}

	const variant = meta?.variant || 'schedule'

	return (
		<WidgetContainer contentClassName={containerClass}>
			{variant === 'timeline' ? (
				<GoogleCalendarTimeline
					selectedDay={selectedDay}
					setSelectedDay={setSelectedDay}
					classifiedEvents={classifiedEvents}
					isLoading={isLoading}
					isError={isError}
					today={today}
					currentTime={currentTime}
					onEventClick={openEvent}
					onRetry={refetch}
				/>
			) : variant === 'agenda' ? (
				<GoogleCalendarAgenda
					rawEvents={rawEvents}
					isLoading={isLoading}
					isError={isError}
					today={today}
					currentTime={currentTime}
					onEventClick={openEvent}
					onRetry={refetch}
				/>
			) : (
				<GoogleCalendarSchedule
					selectedDay={selectedDay}
					setSelectedDay={setSelectedDay}
					weekDays={weekDays}
					eventsByDate={eventsByDate}
					classifiedEvents={classifiedEvents}
					isLoading={isLoading}
					isError={isError}
					today={today}
					onEventClick={openEvent}
					onRetry={refetch}
				/>
			)}
		</WidgetContainer>
	)
}
