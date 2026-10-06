import type React from 'react'
import type { ReactNode } from 'react'
import { PopoverMenuItem } from '@/components/ui'
import { WidgetHeader } from '@/features/widgets/components/widget-header'
import { GoogleCalendarAuth } from '@/features/widgets/google-calendar/components/google-calendar-auth'
import { useGoogleCalendarSchedule } from '@/features/widgets/google-calendar/hooks/use-google-calendar-schedule'
import { useWidgetMenuActions } from '@/features/widgets/widget-menu.context'
import { Icon } from '@/icons'
import { GoogleCalendarEmpty } from './google-calendar-empty'
import { GoogleCalendarEventList } from './google-calendar-event-list'
import { GoogleCalendarEventRow } from './google-calendar-event-row'

interface GoogleCalendarTabProps {
	tabs: ReactNode
}

export const GoogleCalendarTab: React.FC<GoogleCalendarTabProps> = ({ tabs }) => {
	const {
		isAuthenticated,
		isCalendarConnected,
		today,
		classifiedEvents,
		isLoading,
		isError,
		refetch,
		openEvent,
	} = useGoogleCalendarSchedule()

	useWidgetMenuActions(
		isCalendarConnected && (
			<PopoverMenuItem
				icon={<Icon name="refresh" size={14} />}
				label="به‌روز کن"
				onClick={() => refetch()}
			/>
		)
	)

	if (!isCalendarConnected) {
		return <GoogleCalendarAuth isAuthenticated={isAuthenticated} tabs={tabs} />
	}

	return (
		<>
			<WidgetHeader title={tabs} />

			<div className="flex items-baseline justify-between px-2 shrink-0">
				<span className="text-xs font-bold text-fg-strong">
					امروز، {today.format('dddd')}
				</span>
				{classifiedEvents.length > 0 && (
					<span className="font-medium text-3xs text-fg-faint tabular-nums">
						{classifiedEvents.length} برنامه
					</span>
				)}
			</div>

			<GoogleCalendarEventList
				isLoading={isLoading}
				isError={isError}
				isEmpty={classifiedEvents.length === 0}
				empty={
					<GoogleCalendarEmpty
						title="امروز برنامه‌ای نداری"
						description="فرصت خوبیه برای کارهای شخصی"
					/>
				}
				onRetry={refetch}
			>
				<ul className="flex flex-col gap-0.5">
					{classifiedEvents.map((classified) => (
						<li key={classified.event.id}>
							<GoogleCalendarEventRow
								classified={classified}
								onEventClick={openEvent}
							/>
						</li>
					))}
				</ul>
			</GoogleCalendarEventList>
		</>
	)
}
