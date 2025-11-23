import moment from 'jalali-moment'
import { AiOutlineGoogle } from 'react-icons/ai'
import { FaGlobeAsia } from 'react-icons/fa'
import { FaMoon } from 'react-icons/fa6'
import { useState } from 'react'
import type { FetchedAllEvents } from '@/services/hooks/date/getEvents.hook'
import {
	convertShamsiToHijri,
	filterGoogleEventsByDate,
	getGregorianEvents,
	getHijriEvents,
	getShamsiEvents,
} from '../../utils'
import { useDate } from '@/context/date.context'
import type { GoogleCalendarEvent } from '@/services/hooks/date/getGoogleCalendarEvents.hook'
import type React from 'react'
import { Button } from '@/components/button/button'
import { useAuth } from '@/context/auth.context'
import {
	type MoodType,
	useUpsertMoodLog,
} from '@/services/hooks/moodLog/upsert-moodLog.hook'
import { safeAwait } from '@/services/api'
import type { AxiosError } from 'axios'
import { translateError } from '@/utils/translate-error'
import { useIsMutating } from '@tanstack/react-query'
import { showToast } from '@/common/toast'

interface CalendarDayDetailsProps {
	events: FetchedAllEvents
	googleEvents: GoogleCalendarEvent[]
	eventIcon?: string
}

const moodOptions = [
	{ value: 'sad', emoji: '😢', label: 'ناراحت' },
	{ value: 'normal', emoji: '😐', label: 'معمولی' },
	{ value: 'happy', emoji: '😊', label: 'خوب' },
	{ value: 'excited', emoji: '😂', label: 'سرحال' },
]

export const CalendarDayDetails: React.FC<CalendarDayDetailsProps> = ({
	events,
	googleEvents,
	eventIcon,
}) => {
	const { selectedDate, today } = useDate()
	const { isAuthenticated } = useAuth()
	const { mutateAsync: upsertMoodLog } = useUpsertMoodLog()
	const [mood, setMood] = useState<MoodType | ''>('')

	const isAdding = useIsMutating({ mutationKey: ['upsertMoodLog'] }) > 0

	const handleMoodChange = async (value: string) => {
		if (isAdding) return
		if (value === '') return
		if (!isAuthenticated) {
			showToast('برای ثبت مود روزانه باید وارد حساب کاربری خود شوید.', 'error')
			return
		}

		const currentGregorian = today.clone().doAsGregorian()
		const selectedGregorian = selectedDate.clone().doAsGregorian()

		if (selectedGregorian.isAfter(currentGregorian, 'day')) {
			showToast('تاریخ انتخاب شده نمی‌تواند در آینده باشد.', 'error')
			return
		}

		if (
			selectedGregorian.isBefore(
				currentGregorian.clone().subtract(7, 'days'),
				'day'
			)
		) {
			showToast('تاریخ انتخاب شده نمی‌تواند بیش از ۷ روز گذشته باشد.', 'error')
			return
		}

		const [error, _] = await safeAwait<AxiosError, any>(
			upsertMoodLog({
				mood: value as MoodType,
				date: selectedGregorian.format('YYYY-MM-DD'),
			})
		)
		if (error) {
			const msg = translateError(error)
			showToast(msg as any, 'error')

			return
		}

		setMood(value as MoodType)
		showToast('مود روزانه با موفقیت ثبت شد!', 'success')
	}

	const todayShamsiEvents = getShamsiEvents(events, selectedDate)
	const todayHijriEvents = getHijriEvents(events, selectedDate)
	const todayGregorianEvents = getGregorianEvents(events, selectedDate)

	const isHoliday =
		selectedDate.day() === 5 ||
		todayShamsiEvents.some((event) => event.isHoliday) ||
		todayHijriEvents.some((event) => event.isHoliday)

	const dayEvent = [
		...todayShamsiEvents,
		...todayGregorianEvents,
		...todayHijriEvents,
	].sort((a) => (a.isHoliday ? -1 : 1))

	const hijri = convertShamsiToHijri(selectedDate)
	const gregorian = selectedDate.clone().doAsGregorian().format('YYYY MMMM DD')
	const jalali = selectedDate.format('jYYYY/jMM/jD')
	const jalaliDay = selectedDate.format('ddd')

	const dayGoogleEvents = filterGoogleEventsByDate(googleEvents, selectedDate)

	const holidayStyle = isHoliday
		? 'from-orange-600 to-red-700'
		: 'from-sky-500 to-blue-700'
	const headerStyle = `max-w-full py-1 px-3 rounded text-center text-white bg-gradient-to-r ${holidayStyle}`

	const infoStyle = 'text-sm'
	const googleStyle = 'text-[#4285f4]'

	return (
		<div className="my-1 flex flex-col min-w-[250px] max-w-[250px] rounded-xl overflow-hidden transition-shadow">
			<div className={headerStyle}>
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-1">
						{eventIcon && (
							<img
								src={eventIcon}
								alt="مناسبت"
								className="object-cover w-6 h-6 transition-all rounded-full"
								onError={(e) => {
									e.currentTarget.style.display = 'none'
								}}
							/>
						)}
						<span className="text-sm truncate">{jalaliDay}</span>
					</div>
					<span className="text-sm truncate">{jalali}</span>
				</div>
			</div>

			<div className="p-3 space-y-2">
				<div className="flex items-center gap-2">
					<FaMoon className="flex-shrink-0 text-amber-500" />
					<span className="text-sm font-medium rtl">
						{hijri.format('iD iMMMM iYYYY')}
					</span>
				</div>

				<div className="flex items-center gap-2">
					<FaGlobeAsia className="flex-shrink-0 text-blue-500" />
					<span className={infoStyle}>{gregorian}</span>
				</div>

				{dayGoogleEvents.length > 0 && (
					<div className="flex items-start gap-2 pt-2 mt-2 border-t rounded-lg border-content">
						<AiOutlineGoogle
							className={`mt-1 flex-shrink-0 ${googleStyle}`}
						/>
						<div className="flex-1">
							<div className={`text-sm font-medium ${googleStyle} mb-1`}>
								{dayGoogleEvents.length} تقویم گوگل
							</div>
							{dayGoogleEvents.map((event, index) => (
								<div
									key={index}
									className={`text-xs mt-1 whitespace-normal break-words ${infoStyle}`}
								>
									• {event.summary} - (
									{moment(event.start.dateTime).format('HH:mm')})
								</div>
							))}
						</div>
					</div>
				)}

				{dayEvent.length > 0 && (
					<div className="flex items-start gap-2 pt-2 mt-2 border-t rounded-lg border-content ">
						<div className="flex items-center justify-center flex-shrink-0 w-4 h-4 mt-1">
							<span className="block w-2 h-2 bg-blue-500 rounded-full"></span>
						</div>
						<div className="flex-1">
							<div className={`text-sm font-medium ${infoStyle} mb-1`}>
								{dayEvent.length} مناسبت
							</div>
							{dayEvent.map((event, index) => (
								<div
									key={index}
									className={`text-xs mt-1 whitespace-normal break-words ${event.isHoliday ? 'text-red-500' : infoStyle}`}
								>
									• {event.title} {event.isHoliday && '(تعطیل)'}
								</div>
							))}
						</div>
					</div>
				)}

				<div className="pt-2 mt-2 border-t rounded-lg border-content">
					<div className="flex items-center gap-1.5">
						<span className="text-xl">💭</span>
						<span className="text-xs font-medium text-content">
							چه حالی داری؟
						</span>
					</div>
					<div className="flex items-center justify-between gap-1.5 h-10">
						{moodOptions.map((option) => (
							<Button
								size="xs"
								key={option.value}
								onClick={() => handleMoodChange(option.value)}
								disabled={isAdding}
								className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-2xl relative transition-all border text-content ${
									mood === option.value
										? 'bg-primary/80 scale-105 shadow-sm border-primary/80'
										: 'bg-content/80 border-content hover:scale-105'
								}`}
							>
								<span className="absolute z-50 text-xl leading-none -top-2">
									{option.emoji}
								</span>
								<span className="text-[10px] z-50 leading-tight text-center absolute -bottom-3.5">
									{option.label}
								</span>
							</Button>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
