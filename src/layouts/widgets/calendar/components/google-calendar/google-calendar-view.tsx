import Analytics from '@/analytics'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import { useGetGoogleCalendarEvents } from '@/services/hooks/date/getGoogleCalendarEvents.hook'
import { useDate } from '@/context/date.context'
import { CalendarEvent } from './google-event.item'
import { useAuth } from '@/context/auth.context'
import { Button } from '@/components/button/button'
import { callEvent } from '@/common/utils/call-event'

const HOUR_HEIGHT = 80
export const GoogleCalendarView: React.FC = () => {
	const { user, isAuthenticated } = useAuth()
	const { selectedDate, isToday, setSelectedDate, currentDate } = useDate()
	const containerRef = useRef<HTMLDivElement>(null)
	const [currentTime, setCurrentTime] = useState(new Date())

	const isCalendarConnected = user?.connections?.includes('google') || false

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 60000)
		return () => clearInterval(timer)
	}, [])

	useEffect(() => {
		if (containerRef.current && isToday(selectedDate)) {
			const now = new Date()
			const scrollPos =
				((now.getHours() * 60 + now.getMinutes()) / 60) * HOUR_HEIGHT - 100
			containerRef.current.scrollTo({ top: scrollPos, behavior: 'smooth' })
		}
	}, [selectedDate])

	const { data: events } = useGetGoogleCalendarEvents(
		isCalendarConnected,
		selectedDate.clone().startOf('day').toDate(),
		selectedDate.clone().endOf('day').toDate()
	)

	const handleEventClick = (event: any) => {
		Analytics.event('google_calendar_event_click')
		if (event.hangoutLink) {
			window.open(event.hangoutLink, '_blank')
		} else if (event.location) {
			window.open(
				`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`,
				'_blank'
			)
		}
	}

	const onNextDay = () => {
		setSelectedDate(selectedDate.clone().add(1, 'jD'))
		Analytics.event('google_calendar_next_day')
	}

	const onPrevDay = () => {
		setSelectedDate(selectedDate.clone().add(-1, 'jD'))
		Analytics.event('google_calendar_prev_day')
	}

	const onGoToToday = () => {
		setSelectedDate(currentDate.clone())
		Analytics.event('google_calendar_go_to_today')
	}

	const getInitials = (email: string) =>
		email.split('@')[0].substring(0, 2).toUpperCase()

	const hours = Array.from({ length: 24 }, (_, i) => i)

	const nextEvent = events?.find((e) => new Date(e.start.dateTime) > currentTime)

	if (!isCalendarConnected) {
		return (
			<div className="flex flex-col items-center justify-center h-full p-4 text-center">
				<p className="mb-2 text-sm text-content">
					{isAuthenticated
						? 'برای مشاهده رویدادهای گوگل، لطفاً حساب گوگل خود را متصل کنید.'
						: 'برای مشاهده رویدادهای گوگل، لطفاً وارد حساب کاربری خود شوید.'}
				</p>
				<Button
					size="sm"
					className="rounded-2xl text-xs! btn"
					onClick={() => callEvent('openProfile')}
				>
					{isAuthenticated ? 'اتصال حساب گوگل' : 'ورود به حساب کاربری'}
				</Button>
			</div>
		)
	}

	return (
		<div className="relative flex flex-col h-full overflow-hidden">
			<div className="sticky top-0 z-50 flex flex-row justify-between p-2 border-b border-content">
				<div className="flex-1 text-xs font-bold text-content">
					{events?.length || 0} رویداد
				</div>
				{nextEvent && (
					<div className="text-[10px] truncate text-muted line-clamp-1">
						بعدی: {new Date(nextEvent.start.dateTime).getHours()}:
						{new Date(nextEvent.start.dateTime)
							.getMinutes()
							.toString()
							.padStart(2, '0')}{' '}
						- {nextEvent.summary}
					</div>
				)}
			</div>

			<div
				ref={containerRef}
				className="relative flex-1 pb-20 overflow-y-auto custom-scrollbar"
			>
				<div
					className="relative w-full"
					style={{ height: `${24 * HOUR_HEIGHT}px` }}
				>
					{hours.map((hour) => {
						const isPast =
							isToday(selectedDate) && currentTime.getHours() > hour
						return (
							<div
								key={hour}
								className="flex items-start border-b border-base-200/40"
								style={{ height: `${HOUR_HEIGHT}px` }}
							>
								<div
									className={`w-10 text-[10px] text-center pt-1 border-l border-base-200/50 sticky right-0 z-30 font-bold transition-opacity ${isPast ? 'opacity-30' : 'opacity-80'}`}
								>
									{hour === 0 ? '۱۲' : hour <= 12 ? hour : hour - 12}
									<span className="block text-[8px] font-medium">
										{hour < 12 ? 'ق.ظ' : 'ب.ظ'}
									</span>
								</div>
								<div
									className={`relative flex-1 h-full ${isPast ? 'bg-base-200/5' : ''}`}
								/>
							</div>
						)
					})}

					{isToday(selectedDate) && (
						<div
							className="absolute left-0 z-40 flex items-center w-full pointer-events-none"
							style={{
								top: `${((currentTime.getHours() * 60 + currentTime.getMinutes()) / 60) * HOUR_HEIGHT}px`,
							}}
						>
							<div className="w-2.5 h-2.5 bg-red-500 rounded-full sticky right-0 z-50 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
							<div
								className="flex-1 h-[1.5px] bg-red-500/80"
								style={{ marginRight: '-4px' }}
							/>
						</div>
					)}

					{events?.map((event) => (
						<CalendarEvent
							key={event.id}
							event={event}
							isToday={isToday(selectedDate)}
							currentTime={currentTime}
							hourHeight={HOUR_HEIGHT}
							onEventClick={handleEventClick}
							getInitials={getInitials}
						/>
					))}
				</div>
			</div>

			<div
				className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1.5  rounded-2xl w-[70%] max-w-50 justify-between bg-content bg-white/2 border border-white/8 z-50
				"
			>
				<button
					className="p-1.5 hover:bg-base-200 rounded-xl transition-colors cursor-pointer text-muted"
					onClick={() => onPrevDay()}
				>
					<HiChevronRight size={18} />
				</button>

				<button
					className={`px-3 py-1 text-[10px] font-black rounded-lg cursor-pointer transition-all ${
						isToday(selectedDate)
							? 'bg-primary/10 text-primary-content'
							: 'hover:bg-base-200 text-content'
					}`}
					onClick={() => onGoToToday()}
				>
					{selectedDate.format('dddd')}
				</button>

				<button
					className="p-1.5 hover:bg-base-200 rounded-xl transition-colors cursor-pointer text-muted"
					onClick={() => onNextDay()}
				>
					<HiChevronLeft size={18} />
				</button>
			</div>
		</div>
	)
}
