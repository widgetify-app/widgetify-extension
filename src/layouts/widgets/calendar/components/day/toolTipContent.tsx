import { FaGlobeAsia } from 'react-icons/fa'
import { FaMoon } from 'react-icons/fa6'
import { useState } from 'react'
import type { FetchedAllEvents } from '@/services/hooks/date/getEvents.hook'
import {
	convertShamsiToHijri,
	getGregorianEvents,
	getHijriEvents,
	getShamsiEvents,
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
import { translateError } from '@/utils/translate-error'
import { useIsMutating } from '@tanstack/react-query'
import { showToast } from '@/common/toast'
import type { MoodEntry } from '@/services/hooks/moodLog/get-moods.hook'
import Analytics from '@/analytics'
import { moodOptions } from '@/common/constant/moods'
import { TbMoodHappy } from 'react-icons/tb'

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
			const msg = translateError(error)
			showToast(typeof msg === 'string' ? msg : 'خطایی رخ داد!', 'error')
			return
		}

		onMoodChange?.(value as MoodType)
		if (response.action === 'removed') {
			setMood('')
			showToast(
				'مودت حذف شد. اگه بعداً خواستی دوباره می‌تونی یکی انتخاب کنی.',
				'info'
			)
		} else {
			setMood(value as MoodType)
			showToast('مود شما با موفقیت ثبت شد.', 'success', {
				alarmSound: true,
			})
		}

		Analytics.event('calendar_mood_clicked')
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
	const gregorian = selectedDate.clone().doAsGregorian().format('DD MMM YYYY')
	const jalali = selectedDate.format('jYYYY/jMM/jD')
	const jalaliDay = selectedDate.format('dddd')

	const totalEvents = dayEvent.length
	const holidayStyle = isHoliday
		? 'from-orange-600 to-red-700'
		: 'from-sky-500 to-blue-700'

	useEffect(() => {
		const selectedDateStr = selectedDate.doAsGregorian().format('YYYY-MM-DD')
		const existingMood = moods?.find((m) => m.date === selectedDateStr)
		setMood(existingMood?.mood || '')
	}, [selectedDate, moods])

	return (
		<div className="my-1 flex flex-col w-[240px] rounded-xl overflow-hidden bg-base-100 border border-base-300">
			{/* Header */}
			<div className={`px-3 py-2 bg-gradient-to-r ${holidayStyle} text-white`}>
				<div className="flex items-center justify-between text-sm">
					<span className="font-medium">{jalaliDay}</span>
					<span className="opacity-90">{jalali}</span>
				</div>
			</div>

			<div className="p-2 space-y-2">
				<div className="flex items-center justify-between px-1 text-xs text-muted">
					<div className="flex items-center gap-1">
						<FaMoon size={10} />
						<span>{hijri.format('iD iMMMM')}</span>
					</div>
					<div className="flex items-center gap-1">
						<FaGlobeAsia size={10} />
						<span>{gregorian}</span>
					</div>
				</div>

				<div className="p-1.5 rounded-2xl bg-content">
					<div className="flex items-center gap-1 mb-1.5 px-0.5">
						<TbMoodHappy className="text-secondary" size={12} />
						<span className="text-[10px] font-medium text-content">
							مود امروز
						</span>
					</div>
					<div className="grid grid-cols-4 gap-1">
						{moodOptions.map((option) => (
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

				{totalEvents > 0 && (
					<div className="pr-1 space-y-1 overflow-y-auto max-h-32 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent">
						{dayEvent.map((event, idx) => (
							<div
								key={`e-${idx}`}
								className={`flex items-center gap-1.5 p-1.5 rounded-2xl ${
									event.isHoliday
										? 'bg-error/10 border border-error/20'
										: 'bg-base-200'
								}`}
							>
								<div
									className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${event.isHoliday ? 'bg-error' : 'bg-info'}`}
								/>
								<div className="flex-1 min-w-0 text-[10px] text-content truncate">
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
