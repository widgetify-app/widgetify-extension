import type React from 'react'
import { useState, useEffect } from 'react'
import Analytics from '@/analytics'
import { HiChevronLeft, HiChevronRight, HiOutlineCalendar } from 'react-icons/hi2'
import { useGetGoogleCalendarEvents } from '@/services/hooks/date/getGoogleCalendarEvents.hook'
import { useDate } from '@/context/date.context'
import { CalendarEvent } from './google-event.item'
import { useAuth } from '@/context/auth.context'
import { Button } from '@/components/button/button'
import { callEvent } from '@/common/utils/call-event'
import type { WidgetifyDate } from '../../utils'
import { GoogleEventItemSkeleton } from './google-event.item-skeleton'

export const GoogleCalendarView: React.FC = () => {
	const { user, isAuthenticated } = useAuth()
	const { currentDate, isToday } = useDate()
	const [currentTime, setCurrentTime] = useState(new Date())
	const [selectedDay, setSelectedDay] = useState(currentDate)

	const isCalendarConnected = user?.connections?.includes('google') || false

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 30000)
		return () => clearInterval(timer)
	}, [])

	const getStartOfDay = (date: WidgetifyDate) => {
		return `${date.clone().locale('en').format('YYYY-MM-DD')}T00:00:00+03:30`
	}

	const getEndOfDay = (date: WidgetifyDate) => {
		return `${date.clone().locale('en').format('YYYY-MM-DD')}T23:59:59+03:30`
	}

	const { data: events, isLoading } = useGetGoogleCalendarEvents(
		isCalendarConnected,
		getStartOfDay(selectedDay),
		getEndOfDay(selectedDay)
	)

	const handleEventClick = (event: any) => {
		Analytics.event('google_calendar_event_click')
		const link =
			event.hangoutLink ||
			(event.location
				? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
						event.location
					)}`
				: null)
		if (link) window.open(link, '_blank')
	}

	const getInitials = (email: string) =>
		email.split('@')[0].substring(0, 2).toUpperCase()

	const todayFlag = isToday(selectedDay)
	const selectedDate = selectedDay.toDate()
	const now = currentTime
	const startOfToday = currentDate.startOf('day').toDate()
	const classified = [...(events ?? [])]
		.sort(
			(a, b) =>
				new Date(a.start.dateTime).getTime() -
				new Date(b.start.dateTime).getTime()
		)
		.map((event) => {
			const start = new Date(event.start.dateTime)
			const end = new Date(event.end.dateTime)

			const isNow = todayFlag && now >= start && now <= end

			let isPast = false

			if (selectedDate < startOfToday) {
				isPast = true
			} else if (todayFlag) {
				isPast = end < now
			}

			return { event, isNow, isPast }
		})

	const nextIdx = classified.findIndex((e) => !e.isNow && !e.isPast)

	if (!isCalendarConnected) {
		return (
			<div className="flex flex-col items-center justify-center h-full gap-3 p-4 text-center">
				<div className="p-3 rounded-2xl bg-primary/10 text-primary">
					<HiOutlineCalendar size={24} />
				</div>
				<p className="text-[11px] text-base-content/60 leading-relaxed">
					{isAuthenticated
						? 'برای مشاهده برنامه‌ها، تقویم گوگل را متصل کنید.'
						: 'لطفاً وارد حساب کاربری خود شوید.'}
				</p>
				<Button
					size="sm"
					className="text-xs rounded-xl"
					onClick={() => callEvent('openProfile', 'platforms')}
				>
					{isAuthenticated ? 'اتصال تقویم' : 'ورود'}
				</Button>
			</div>
		)
	}

	const handlePrevDay = () => {
		setSelectedDay(selectedDay.clone().add(-1, 'jD'))
		Analytics.event('google_calendar_prev_day')
	}
	const handleNextDay = () => {
		setSelectedDay(selectedDay.clone().add(1, 'jD'))
		Analytics.event('google_calendar_next_day')
	}

	const handleResetDay = () => {
		setSelectedDay(currentDate.clone())
		Analytics.event('google_calendar_reset_day')
	}

	return (
		<div className="flex flex-col h-full overflow-hidden">
			<div className="flex items-center justify-between px-2 shrink-0">
				<button
					onClick={() => handlePrevDay()}
					className="flex items-center justify-center transition-colors rounded-lg cursor-pointer w-7 h-7 hover:bg-base-200 text-base-content/40 hover:text-base-content"
				>
					<HiChevronRight size={16} />
				</button>

				<button
					onClick={() => handleResetDay()}
					className="flex flex-col items-center cursor-pointer select-none"
				>
					<span
						className={`text-[12px] font-black leading-tight text-base-content`}
					>
						{todayFlag
							? `امروز، ${selectedDay.format('dddd')}`
							: selectedDay.format('dddd')}
					</span>
					<span
						className={`text-[9px] leading-none mt-0.5 text-base-content/35`}
					>
						{selectedDay.format('jD jMMMM jYYYY')}
					</span>
				</button>

				<button
					onClick={() => handleNextDay()}
					className="flex items-center justify-center transition-colors rounded-lg cursor-pointer w-7 h-7 hover:bg-base-200 text-base-content/40 hover:text-base-content"
				>
					<HiChevronLeft size={16} />
				</button>
			</div>

			<div className="flex-1 overflow-y-auto px-1 pb-2 flex flex-col gap-0.5 min-h-0">
				{isLoading &&
					Array.from({ length: 4 }).map((_, i) => (
						<GoogleEventItemSkeleton key={`google-item-loading-${i}`} />
					))}

				{!isLoading && classified.length === 0 && (
					<div className="flex flex-col items-center justify-center flex-1 gap-2 py-8 opacity-25">
						<HiOutlineCalendar size={28} strokeWidth={1.5} />
						<p className="text-[10px] font-medium text-base-content">
							رویدادی وجود ندارد
						</p>
					</div>
				)}

				{!isLoading &&
					classified.map(({ event, isNow, isPast }, i) => (
						<CalendarEvent
							key={`google-item-${i}`}
							event={event}
							isNow={isNow}
							isPast={isPast}
							isNext={i === nextIdx}
							currentTime={currentTime}
							getInitials={getInitials}
							onEventClick={handleEventClick}
						/>
					))}
			</div>
		</div>
	)
}
