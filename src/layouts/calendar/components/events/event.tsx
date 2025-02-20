import type jalaliMoment from 'jalali-moment'
import type { FetchedAllEvents } from '../../../../services/getMethodHooks/getEvents.hook'
import type { Event } from '../../interface/event.interface'
import { getGregorianEvents, getHijriEvents, getShamsiEvents } from '../../utils'

interface Prop {
	// events: Event[]
	events: FetchedAllEvents
	currentDate: jalaliMoment.Moment
}

const getEventTypeColor = (type: Event['type']) => {
	switch (type) {
		case 'holiday':
			return 'bg-red-500/10 text-red-500'
		case 'event':
			return 'bg-blue-500/10 text-blue-500'
		case 'news':
			return 'bg-yellow-500/10 text-yellow-500'
		default:
			return 'bg-gray-500/10 text-gray-500'
	}
}

export function Events({ events, currentDate }: Prop) {
	const shamsiEvents = getShamsiEvents(events, currentDate)

	const gregorianEvents = getGregorianEvents(events, currentDate)

	const hijriEvents = getHijriEvents(events, currentDate)

	const selectedEvents = [...shamsiEvents, ...gregorianEvents, ...hijriEvents]

	return (
		<div>
			<h4 className="mb-2 text-lg text-gray-500 dark:text-gray-400">رویدادها</h4>
			<div className="h-40 space-y-3 overflow-y-auto lg:h-32">
				{selectedEvents.length > 0 ? (
					selectedEvents.map((event, index) => (
						<div
							key={index}
							className={`p-3 rounded-lg ${getEventTypeColor(event.isHoliday ? 'holiday' : 'event')}`}
						>
							<div className="font-medium">{event.title}</div>
							{/* {event.description && (
								<p className="mt-1 text-sm text-gray-300">{event.description}</p>
							)} */}
						</div>
					))
				) : (
					<div className="py-4 text-center text-gray-400">
						رویدادی برای این روز ثبت نشده است
					</div>
				)}
			</div>
		</div>
	)
}
