import { useState } from 'react'
import type { FetchedAllEvents } from '@/services/hooks/date/getEvents.hook'
import {
	getGregorianEvents,
	getHijriEvents,
	getShamsiEvents,
	hijriMonthNames,
} from '../../utils'
import { useDate } from '@/context/date.context'
import type React from 'react'
import { useAuth } from '@/context/auth.context'
import {
	type MoodType,
	useUpsertMoodLog,
} from '@/services/hooks/moodLog/upsert-moodLog.hook'
import { safeAwait } from '@/services/api'
import type { AxiosError } from 'axios'
import { useIsMutating } from '@tanstack/react-query'
import { autoFormatErrorToast, showToast } from '@/common/toast'
import type { MoodEntry } from '@/services/hooks/moodLog/get-moods.hook'
import Analytics from '@/analytics'
import { moodOptions } from '@/common/constant/moods'
import { Icon } from '@/src/icons'

interface CalendarDayDetailsProps {
	events: FetchedAllEvents
	eventIcon?: string
	moods: MoodEntry[]
	onMoodChange?: (mood: MoodType) => void
}

export const CalendarDayDetails: React.FC<CalendarDayDetailsProps> = ({
	events,
	moods,
	onMoodChange,
}) => {
	const { selectedDate, today, getHijriDate } = useDate()
	const { isAuthenticated } = useAuth()
	const { mutateAsync: upsertMoodLog } = useUpsertMoodLog()

	const [mood, setMood] = useState<MoodType | ''>('')

	const isAdding = useIsMutating({ mutationKey: ['upsertMoodLog'] }) > 0

	const handleMoodChange = async (value: string) => {
		if (isAdding) return
		if (value === '') return
		if (!isAuthenticated) {
			showToast('برای ثبت حال روزانه باید وارد حساب کاربری خود شوید.', 'error')
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

		const [error, response] = await safeAwait<
			AxiosError,
			{ action: 'added' | 'removed' }
		>(
			upsertMoodLog({
				mood: value as MoodType,
				date: selectedGregorian.format('YYYY-MM-DD'),
			})
		)
		if (error) {
			autoFormatErrorToast(error)
			return
		}

		onMoodChange?.(value as MoodType)
		if (response.action === 'removed') {
			setMood('')
			showToast(
				'حال روزانت حذف شد. اگه بعدا خواستی دوباره می‌تونی یکی انتخاب کنی.',
				'info'
			)
		} else {
			setMood(value as MoodType)
			showToast('حال روزانه شما با موفقیت ثبت شد.', 'success', {
				alarmSound: true,
			})
		}

		Analytics.event('calendar_mood_clicked')
	}

	const todayShamsiEvents = getShamsiEvents(events, selectedDate)
	const todayHijriEvents = getHijriEvents(events, selectedDate)
	const todayGregorianEvents = getGregorianEvents(events, selectedDate)

	const dayEvent = [
		...todayShamsiEvents,
		...todayGregorianEvents,
		...todayHijriEvents,
	].sort((a) => (a.isHoliday ? -1 : 1))

	const hijriRaw = getHijriDate(selectedDate)
	const [_, hijriMonth, hijriDate] = hijriRaw.split('/')
	const hijriMonthName = hijriMonthNames[Number(hijriMonth) - 1] || hijriMonth

	const gregorian = selectedDate.clone().doAsGregorian().format('DD MMM YYYY')
	const jalali = selectedDate.format('jYYYY/jMM/jD')
	const jalaliDay = selectedDate.format('dddd')

	const totalEvents = dayEvent.length

	useEffect(() => {
		const selectedDateStr = selectedDate.doAsGregorian().format('YYYY-MM-DD')
		const existingMood = moods?.find((m) => m.date === selectedDateStr)
		setMood(existingMood?.mood || '')
	}, [selectedDate, moods])

	return (
		<div className="flex flex-col overflow-hidden border w-60 bg-base-200 border-base-300 rounded-2xl">
			<div className={`px-3 py-2  bg-primary/90   text-white`}>
				<div className="flex items-center justify-between text-sm">
					<span className="font-medium">{jalaliDay}</span>
					<span className="opacity-90">{jalali}</span>
				</div>
			</div>

			<div className="p-2 space-y-2">
				<div className="flex items-center justify-between px-1 text-xs text-muted">
					<div className="flex items-center gap-1">
						<Icon name="moon" size={10} />
						<span>
							{hijriDate} {hijriMonthName}
						</span>
					</div>
					<div className="flex items-center gap-1">
						<Icon name="globeAsia" size={10} />
						<span>{gregorian}</span>
					</div>
				</div>

				{selectedDate.isBefore() && (
					<div className="p-1.5 rounded-2xl bg-content">
						<div className="flex items-center gap-1 mb-1.5 px-0.5">
							<span className="text-[10px] font-medium text-content">
								حس و حال{' '}
								{jalaliDay === today.format('dddd') ? 'امروز' : 'روز'}
							</span>
						</div>
						<div className="grid grid-cols-4 gap-1">
							{moodOptions
								.filter((f) => f.label)
								.map((option) => (
									<button
										key={option.value}
										onClick={() => handleMoodChange(option.value)}
										disabled={isAdding}
										className={`p-1.5 rounded-xl transition-all cursor-pointer ${
											mood === option.value
												? `bg-${option.colorClass} text-${option.colorClass}-content scale-105`
												: `bg-base-300 hover:bg-base-300/70 opacity-80 hover:opacity-100`
										}`}
									>
										{isAdding ? (
											<div className="w-5 h-5 mx-auto border-2 border-white rounded-full border-t-transparent animate-spin" />
										) : (
											<>
												<div className="text-lg leading-none mb-0.5">
													{option.emoji}
												</div>
												<div className="text-[10px] leading-tight">
													{option.label}
												</div>
											</>
										)}
									</button>
								))}
						</div>
					</div>
				)}

				{totalEvents > 0 && (
					<div className="flex flex-col p-1 pl-1 space-y-1 overflow-y-auto gap-x-1 max-h-28 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent">
						{dayEvent.map((event, idx) => (
							<div
								key={`e-${idx}`}
								className={`flex relative overflow-hidden outline items-center py-0.5 gap-1 min-h-6 h-fit  w-full px-2  rounded-xl ${
									event.isHoliday
										? 'bg-error/20 text-error outline-error/30'
										: 'badge badge-ghost text-content  outline-base-300'
								}`}
							>
								<div
									className={`w-1.5 h-1.5 ml-0.5 -mr-0.5 rounded-full shrink-0 ${event.isHoliday ? 'bg-red-400 animate-pulse ring-2 ring-error/20' : 'bg-primary/80 ring-2 ring-primary/20'} `}
								/>
								<div className="flex-1 min-w-0 text-[11px]">
									{event.title}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
