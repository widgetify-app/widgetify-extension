import { useDate } from '@/context/date.context'
import { CalendarGrid } from '../components/calendar-grid'
import { CalendarHeader } from '../components/calendar-header'
import { useGetEvents } from '@/services/hooks/date/get-events.hook'
import { combineAndSortEvents } from '@/layouts/widgets/tools/events/utils'
import { toPersianDigits } from '@/common/utils/persian-digits'

export function CalendarWideFull() {
	const { currentDate, selectedDate, setCurrentDate, setSelectedDate, goToToday } =
		useDate()

	const { data: events } = useGetEvents()
	const targetDate = selectedDate || currentDate
	const eventsForCalendar = events || {
		gregorianEvents: [],
		hijriEvents: [],
		shamsiEvents: [],
	}
	const sortedEvents = combineAndSortEvents(eventsForCalendar, targetDate.clone(), [])

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-full w-full p-1 select-none overflow-hidden">
			<div className="flex flex-col h-full overflow-hidden">
				<CalendarHeader
					currentDate={currentDate}
					selectedDate={selectedDate}
					setCurrentDate={setCurrentDate}
					goToToday={goToToday}
				/>
				<div className="h-full overflow-hidden">
					<CalendarGrid
						currentDate={currentDate}
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
					/>
				</div>
			</div>

			<div className="flex flex-col h-full overflow-hidden p-2 rounded-2xl bg-base-200/40 border border-base-content/10">
				<div className="flex items-center justify-between pb-1.5 border-b border-base-content/10 text-xs font-bold text-content">
					<span>رویدادهای {targetDate.locale('fa').format('dddd D MMMM')}</span>
					<span className="text-[10px] text-base-content/60">
						{toPersianDigits(sortedEvents.length)} مناسبت
					</span>
				</div>

				<div className="grow overflow-y-auto space-y-1 mt-1.5 scrollbar-none">
					{sortedEvents.length === 0 ? (
						<div className="flex items-center justify-center h-full text-xs text-muted">
							مناسبتی برای این روز ثبت نشده است
						</div>
					) : (
						sortedEvents.map((evt, idx) => (
							<div
								key={idx}
								className="flex items-center gap-2 p-1.5 rounded-xl bg-base-100/40 border border-base-content/5 text-xs text-content"
							>
								{evt.isHoliday && (
									<span className="w-1.5 h-1.5 rounded-full bg-error shrink-0" />
								)}
								<span className="truncate grow">{evt.title}</span>
								{evt.isHoliday && (
									<span className="text-[9px] px-1.5 py-0.2 rounded bg-error/15 text-error font-medium shrink-0">
										تعطیل
									</span>
								)}
							</div>
						))
					)}
				</div>
			</div>
		</div>
	)
}
