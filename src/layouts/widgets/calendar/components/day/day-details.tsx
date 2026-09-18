import type React from 'react'
import { useEffect, useId, useState } from 'react'
import { useIsMutating } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import Analytics from '@/analytics'
import { moodOptions } from '@/common/constants/moods'
import { autoFormatErrorToast, showToast } from '@/common/toast'
import { cn } from '@/common/utils/cn'
import { useAuth } from '@/context/auth.context'
import { useDate } from '@/context/date.context'
import { Icon } from '@/icons'
import { safeAwait } from '@/services/api'
import type { FetchedAllEvents } from '@/services/hooks/date/get-events.hook'
import type { MoodEntry } from '@/services/hooks/mood-log/get-moods.hook'
import {
	type MoodType,
	useUpsertMoodLog,
} from '@/services/hooks/mood-log/upsert-mood-log.hook'
import {
	getGregorianEvents,
	getHijriEvents,
	getShamsiEvents,
	hijriMonthNames,
	type WidgetifyDate,
} from '../../utils/date-events'

const MOOD_BACKLOG_DAYS = 7

interface CalendarDayDetailsProps {
	date: WidgetifyDate
	events: FetchedAllEvents
	moods: MoodEntry[]
	onMoodChange?: (mood: MoodType) => void
}

export const CalendarDayDetails: React.FC<CalendarDayDetailsProps> = ({
	date,
	events,
	moods,
	onMoodChange,
}) => {
	const headingId = useId()
	const { today, getHijriDate } = useDate()
	const { isAuthenticated } = useAuth()
	const { mutateAsync: upsertMoodLog } = useUpsertMoodLog()

	const [mood, setMood] = useState<MoodType | ''>('')

	const isSavingMood = useIsMutating({ mutationKey: ['upsertMoodLog'] }) > 0

	const currentGregorian = today.clone().doAsGregorian()
	const dayGregorian = date.clone().doAsGregorian()
	const isFuture = dayGregorian.isAfter(currentGregorian, 'day')
	const isWithinMoodBacklog = !dayGregorian.isBefore(
		currentGregorian.clone().subtract(MOOD_BACKLOG_DAYS, 'days'),
		'day'
	)

	const handleMoodChange = async (value: MoodType) => {
		if (isSavingMood) return
		if (!isAuthenticated) {
			showToast('برای ثبت حال روزانه باید وارد حساب کاربری خود شوید.', 'error')
			return
		}

		if (isFuture) {
			showToast('تاریخ انتخاب شده نمی‌تواند در آینده باشد.', 'error')
			return
		}

		if (!isWithinMoodBacklog) {
			showToast('تاریخ انتخاب شده نمی‌تواند بیش از ۷ روز گذشته باشد.', 'error')
			return
		}

		const [error, response] = await safeAwait<
			AxiosError,
			{ action: 'added' | 'removed' }
		>(
			upsertMoodLog({
				mood: value,
				date: dayGregorian.format('YYYY-MM-DD'),
			})
		)
		if (error) {
			autoFormatErrorToast(error)
			return
		}

		onMoodChange?.(value)
		if (response.action === 'removed') {
			setMood('')
			showToast(
				'حال روزانت حذف شد. اگه بعدا خواستی دوباره می‌تونی یکی انتخاب کنی.',
				'info'
			)
		} else {
			setMood(value)
			showToast('حال روزانه شما با موفقیت ثبت شد.', 'success')
		}

		Analytics.event('calendar_mood_clicked')
	}

	const dayEvents = [
		...getShamsiEvents(events, date),
		...getGregorianEvents(events, date),
		...getHijriEvents(events, date),
	].sort((a, b) => Number(b.isHoliday) - Number(a.isHoliday))

	const [, hijriMonth, hijriDate] = getHijriDate(date).split('/')
	const hijriMonthName = hijriMonthNames[Number(hijriMonth) - 1] || hijriMonth

	const gregorian = dayGregorian.format('DD MMM YYYY')
	const isoDate = dayGregorian.format('YYYY-MM-DD')
	const jalali = date.format('jYYYY/jMM/jD')
	const jalaliDay = date.format('dddd')
	const moodTitle = `حس و حال ${jalaliDay === today.format('dddd') ? 'امروز' : 'روز'}`

	useEffect(() => {
		const existingMood = moods?.find((m) => m.date === isoDate)
		setMood(existingMood?.mood || '')
	}, [isoDate, moods])

	return (
		<section
			className="flex flex-col overflow-hidden border w-60 bg-content border-content rounded-2xl"
			aria-labelledby={headingId}
		>
			<header className="px-3 py-2 bg-primary text-primary-content">
				<h2
					id={headingId}
					className="flex items-center justify-between text-sm font-medium"
				>
					{jalaliDay}
					<time
						dateTime={isoDate}
						className="font-normal opacity-90 tabular-nums"
					>
						{jalali}
					</time>
				</h2>
			</header>

			<div className="p-2 space-y-2">
				<dl className="flex items-center justify-between px-1 text-xs text-muted">
					<div className="flex items-center gap-1">
						<dt className="flex items-center">
							<Icon name="moon" size={10} aria-hidden="true" />
							<span className="sr-only">تاریخ قمری</span>
						</dt>
						<dd>
							{hijriDate} {hijriMonthName}
						</dd>
					</div>
					<div className="flex items-center gap-1">
						<dt className="flex items-center">
							<Icon name="globeAsia" size={10} aria-hidden="true" />
							<span className="sr-only">تاریخ میلادی</span>
						</dt>
						<dd>
							<time dateTime={isoDate}>{gregorian}</time>
						</dd>
					</div>
				</dl>

				{!isFuture && isWithinMoodBacklog && (
					<fieldset className="p-1.5 rounded-2xl bg-raised">
						<legend className="sr-only">{moodTitle}</legend>
						<span
							aria-hidden="true"
							className="block mb-1.5 px-0.5 text-[10px] font-medium text-content"
						>
							{moodTitle}
						</span>
						<div className="grid grid-cols-4 gap-1">
							{moodOptions.map((option) => (
								<button
									key={option.value}
									type="button"
									onClick={() =>
										handleMoodChange(option.value as MoodType)
									}
									disabled={isSavingMood}
									aria-pressed={mood === option.value}
									className={cn(
										'p-1.5 rounded-xl transition-ui cursor-pointer',
										'disabled:cursor-not-allowed disabled:opacity-60',
										mood === option.value
											? option.activeClass
											: 'bg-raised opacity-80 hover:opacity-100'
									)}
								>
									<span className="block text-lg leading-none mb-0.5">
										{option.emoji}
									</span>
									<span className="block text-[10px] leading-tight">
										{option.label}
									</span>
								</button>
							))}
						</div>
					</fieldset>
				)}

				{dayEvents.length > 0 && (
					<ul className="flex flex-col p-1 space-y-1 overflow-y-auto max-h-28 scrollbar-thin scrollbar-thumb">
						{dayEvents.map((event, idx) => (
							<li
								key={`e-${idx}`}
								className={cn(
									'flex items-center w-full gap-1 px-2 outline rounded-xl min-h-8',
									event.isHoliday
										? 'bg-danger-subtle text-error outline-danger-subtle'
										: 'text-content outline-content'
								)}
							>
								<span className="flex-1 min-w-0 text-[11px]">
									{event.title}
								</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</section>
	)
}
