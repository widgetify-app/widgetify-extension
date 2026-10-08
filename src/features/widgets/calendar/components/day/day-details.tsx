import type React from 'react'
import { useEffect, useId, useState } from 'react'
import { useIsMutating } from '@tanstack/react-query'
import Analytics from '@/analytics'
import { moodOptions } from '@/common/constants/moods'
import { t } from '@/common/i18n'
import { MoodImage } from '@/components/mood-image'
import { autoFormatErrorToast, showToast } from '@/common/toast'
import { cn } from '@/common/utils/cn'
import { useAuth } from '@/context/auth.context'
import { useDate } from '@/features/widgets/date.context'
import { Icon } from '@/icons'
import { Tooltip } from '@/components/ui'
import { type ApiError, safeAwait } from '@/services/api'
import type { FetchedAllEvents } from '@/services/date/get-events.hook'
import type { MoodEntry } from '@/services/mood-log/get-moods.hook'
import { type MoodType, useUpsertMoodLog } from '@/services/mood-log/upsert-mood-log.hook'
import {
	getGregorianEvents,
	getHijriEvents,
	getShamsiEvents,
	hijriMonthNames,
	type WidgetifyDate,
} from '@/common/utils/date-events'
import { moodLogKeys } from '@/services/mood-log/mood-log.keys'
import { isSameJalaliDay } from '@/features/widgets/utils/jalali-date'

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

	const isSavingMood = useIsMutating({ mutationKey: moodLogKeys.upsert }) > 0

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
			showToast(t('widgets.calendar.toast.needAuth'), 'error')
			return
		}

		const [error, response] = await safeAwait<
			ApiError,
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
			showToast(t('widgets.calendar.toast.moodRemoved'), 'info')
		} else {
			setMood(value)
			showToast(t('widgets.calendar.toast.moodSaved'), 'success')
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
	const moodTitle = isSameJalaliDay(date, today)
		? t('widgets.calendar.moodTitle.today')
		: t('widgets.calendar.moodTitle.day')

	useEffect(() => {
		const existingMood = moods?.find((m) => m.date === isoDate)
		setMood(existingMood?.mood || '')
	}, [isoDate, moods])

	return (
		<section
			className="flex flex-col gap-2.5 p-3 w-59 bg-surface-2 rounded-2xl"
			aria-labelledby={headingId}
		>
			<header className="flex flex-col gap-0.5">
				<h2 id={headingId} className="text-sm font-extrabold text-fg-strong">
					<time dateTime={isoDate}>{date.format('dddd jD jMMMM jYYYY')}</time>
				</h2>
				<dl className="flex items-center gap-2.5 text-3xs text-fg-faint">
					<div className="flex items-center gap-1">
						<dt>
							<Icon name="moon" size={12} aria-hidden="true" />
							<span className="sr-only">
								{t('widgets.calendar.hijriDate')}
							</span>
						</dt>
						<dd>
							{hijriDate} {hijriMonthName}
						</dd>
					</div>
					<div className="flex items-center gap-1">
						<dt>
							<Icon name="globeAsia" size={12} aria-hidden="true" />
							<span className="sr-only">
								{t('widgets.calendar.gregorianDate')}
							</span>
						</dt>
						<dd dir="ltr">{gregorian}</dd>
					</div>
				</dl>
			</header>

			{dayEvents.length > 0 && (
				<>
					<span aria-hidden="true" className="h-px bg-line" />
					<ul className="flex flex-col gap-1.5 overflow-y-auto text-xs max-h-28 scrollbar-none">
						{dayEvents.map((event, idx) => (
							<li
								key={`e-${idx}`}
								className="flex items-center gap-2 text-fg"
							>
								<span
									aria-hidden="true"
									className={cn(
										'rounded-full size-1.75 shrink-0',
										event.isHoliday ? 'bg-danger' : 'bg-brand-muted'
									)}
								/>
								<span className="flex-1 min-w-0">{event.title}</span>
								{event.isHoliday && (
									<span className="px-2 font-semibold rounded-full h-5 leading-5 text-3xs bg-danger-fill text-danger shrink-0">
										{t('widgets.calendar.holiday')}
									</span>
								)}
							</li>
						))}
					</ul>
				</>
			)}

			{!isFuture && isWithinMoodBacklog && (
				<>
					<span aria-hidden="true" className="h-px bg-line" />
					<fieldset className="flex flex-col gap-1.5">
						<legend className="mb-1.5 font-semibold text-3xs text-fg-faint">
							{moodTitle}
						</legend>
						<div className="flex justify-between">
							{moodOptions.map((option) => (
								<Tooltip key={option.value} content={t(option.labelKey)}>
									<button
										type="button"
										onClick={() =>
											handleMoodChange(option.value as MoodType)
										}
										disabled={isSavingMood}
										aria-label={t(option.labelKey)}
										aria-pressed={mood === option.value}
										className={cn(
											'grid rounded-lg cursor-pointer size-8.5 place-items-center transition-ui focus-visible:focus-ring',
											'disabled:cursor-not-allowed disabled:opacity-60',
											mood === option.value
												? 'bg-brand-fill ring-[1.5px] ring-inset ring-brand-muted'
												: 'bg-fill hover:bg-fill-2'
										)}
									>
										<span className="text-lg leading-none">
											<MoodImage mood={option.value} />
										</span>
									</button>
								</Tooltip>
							))}
						</div>
					</fieldset>
				</>
			)}
		</section>
	)
}
