import type React from 'react'
import { cn } from '@/common/utils/cn'
import { useRef, useState } from 'react'
import Analytics from '@/analytics'
import { ClickableTooltip, TabNavigation } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { useDate } from '@/context/date.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { Icon } from '@/icons'
import { useGetMoods } from '@/services/hooks/mood-log/get-moods.hook'
import { useGetEvents } from '@/services/hooks/date/get-events.hook'
import { CalendarDayDetails } from '../components/day/day-details'
import { DayItem } from '../components/day/day'
import { useDayDetailsPopup } from '../hooks/use-day-details-popup'
import { GoogleCalendarTab } from '../components/google-calendar-tab'
import { PERSIAN_WEEKDAYS } from '@/common/constants/weekdays'
import { EMPTY_EVENTS } from '../constants'
import type { CalendarTab } from '../types'
import { formatDateStr } from '../utils/date-events'
import { toIsoDateKey } from '../utils/jalali-date'
import { buildMonthGrid } from '../utils/month-grid'

const navButtonClass =
	'h-7 w-7 flex items-center justify-center rounded-full cursor-pointer transition-ui text-muted opacity-70 hover:bg-base-300 hover:opacity-100 focus-visible:focus-ring'

const MonthHeader: React.FC = () => {
	const { currentDate, today, setCurrentDate, goToToday } = useDate()

	const showTodayButton =
		currentDate.jMonth() !== today.jMonth() || currentDate.jYear() !== today.jYear()

	const changeMonth = (delta: number) => {
		setCurrentDate(currentDate.clone().add(delta, 'jMonth'))
	}

	return (
		<header className="flex items-center justify-between gap-1">
			<h3 className="text-xs font-medium truncate text-content">
				<time dateTime={toIsoDateKey(currentDate)}>
					{currentDate.format('dddd، jD jMMMM jYYYY')}
				</time>
			</h3>

			<nav className="flex gap-0.5 shrink-0" aria-label="پیمایش ماه">
				{showTodayButton && (
					<button
						type="button"
						onClick={goToToday}
						title="برو به امروز"
						aria-label="برو به امروز"
						className={navButtonClass}
					>
						<Icon
							name="backRight"
							size={12}
							strokeWidth={1}
							aria-hidden="true"
						/>
					</button>
				)}

				<button
					type="button"
					onClick={() => changeMonth(-1)}
					title="ماه قبل"
					aria-label="ماه قبل"
					className={navButtonClass}
				>
					<Icon
						name="chevronRight"
						size={12}
						strokeWidth={1}
						aria-hidden="true"
					/>
				</button>

				<button
					type="button"
					onClick={() => changeMonth(1)}
					title="ماه بعد"
					aria-label="ماه بعد"
					className={navButtonClass}
				>
					<Icon
						name="chevronLeft"
						size={12}
						strokeWidth={1}
						aria-hidden="true"
					/>
				</button>
			</nav>
		</header>
	)
}

const MonthGrid: React.FC = () => {
	const { currentDate, selectedDate } = useDate()
	const { isAuthenticated } = useAuth()
	const { selected_timezone: timezone } = useGeneralSetting()
	const { anchor, popupDate, isOpen, openFor, setOpen } = useDayDetailsPopup()
	const gridRef = useRef<HTMLDivElement>(null)

	const { data: events } = useGetEvents()

	const eventsForCalendar = events || EMPTY_EVENTS

	const { data: moodsData, refetch } = useGetMoods(
		isAuthenticated,
		currentDate.clone().doAsGregorian().startOf('jMonth').format('YYYY-MM-DD'),
		currentDate.clone().doAsGregorian().endOf('jMonth').format('YYYY-MM-DD')
	)

	const firstDayOfMonth = currentDate.clone().startOf('jMonth').day()
	const daysInMonth = currentDate.clone().endOf('jMonth').jDate()
	const leadingDays = (firstDayOfMonth + 1) % 7
	const daysInPrevMonth = currentDate
		.clone()
		.subtract(1, 'jMonth')
		.endOf('jMonth')
		.jDate()

	const weeks = buildMonthGrid(leadingDays, daysInMonth, daysInPrevMonth)
	const selectedDateStr = formatDateStr(selectedDate)

	return (
		<>
			<div ref={gridRef} className="flex-1 min-h-0 py-1">
				<table className="w-full h-full table-fixed border-separate border-spacing-[1.3cqh]">
					<caption className="sr-only">
						{currentDate.format('jMMMM jYYYY')}
					</caption>

					<thead>
						<tr>
							{PERSIAN_WEEKDAYS.map((weekday) => (
								<th
									key={weekday.short}
									scope="col"
									abbr={weekday.full}
									className="pb-1 text-[4.6cqh] font-normal text-content opacity-80"
								>
									{weekday.short}
								</th>
							))}
						</tr>
					</thead>

					<tbody>
						{weeks.map((week, weekIndex) => (
							<tr key={`week-${weekIndex}`}>
								{week.map((cell, dayIndex) =>
									cell.inMonth ? (
										<td key={`cell-${weekIndex}-${dayIndex}`}>
											<DayItem
												currentDate={currentDate}
												day={cell.day}
												events={eventsForCalendar}
												selectedDateStr={selectedDateStr}
												timezone={timezone.value}
												moods={moodsData?.moods ?? []}
												onClick={openFor}
											/>
										</td>
									) : (
										<td
											key={`cell-${weekIndex}-${dayIndex}`}
											aria-hidden="true"
											className="text-[4cqh] text-center text-content opacity-40"
										>
											{cell.day}
										</td>
									)
								)}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{anchor && popupDate && (
				<ClickableTooltip
					triggerRef={{ current: anchor }}
					boundaryRef={gridRef}
					content={
						<CalendarDayDetails
							date={popupDate}
							events={eventsForCalendar}
							moods={moodsData?.moods ?? []}
							onMoodChange={() => refetch()}
						/>
					}
					isOpen={isOpen}
					setIsOpen={setOpen}
				/>
			)}
		</>
	)
}

export function Calendar2x3() {
	const [activeTab, setActiveTab] = useState<CalendarTab>('calendar')

	const onTabClick = (tab: CalendarTab) => {
		setActiveTab(tab)
		Analytics.event(`calendar_tab_switch_to_${tab}`)
	}

	return (
		<>
			<section
				className={cn(
					'flex flex-col flex-1 min-h-0 overflow-hidden',
					activeTab === 'calendar' && 'p-2 pb-0'
				)}
				aria-label={activeTab === 'calendar' ? 'تقویم شمسی' : 'گوگل‌کلندر'}
			>
				{activeTab === 'calendar' ? (
					<>
						<MonthHeader />
						<MonthGrid />
					</>
				) : (
					<GoogleCalendarTab />
				)}
			</section>

			<TabNavigation
				tabMode="simple"
				activeTab={activeTab}
				onTabClick={onTabClick}
				tabs={[
					{
						id: 'calendar',
						label: 'تقویم',
						icon: <Icon name="calendar" size={12} />,
					},
					{
						id: 'google',
						label: 'گوگل‌کلندر',
						icon: <Icon name="googleCalendar" size={12} />,
					},
				]}
				size="small"
				className="flex-none m-2 mt-0"
			/>
		</>
	)
}
