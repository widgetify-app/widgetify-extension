import type React from 'react'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { useRef, useState } from 'react'
import { TodayChip } from '@/features/widgets/components/today-chip'
import {
	WidgetHeader,
	WidgetHeaderButton,
	WidgetHeaderTabs,
} from '@/features/widgets/components/widget-header'
import { useWidgetMenuActions } from '@/features/widgets/widget-menu.context'
import Analytics from '@/analytics'
import { ClickableTooltip, PopoverMenuItem } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { useDate } from '@/features/widgets/date.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { Icon } from '@/icons'
import { useGetMoods } from '@/services/mood-log/get-moods.hook'
import { useGetEvents } from '@/services/date/get-events.hook'
import { CalendarDayDetails } from '../components/day/day-details'
import { DayItem } from '../components/day/day'
import { useDayDetailsPopup } from '../hooks/use-day-details-popup'
import { GoogleCalendarTab } from '../../google-calendar/google-calendar.widget'
import { PERSIAN_WEEKDAYS } from '@/features/widgets/constants'
import { EMPTY_EVENTS } from '../constants'
import type { CalendarDisplay, CalendarTab } from '../types'
import { formatDateStr } from '@/common/utils/date-events'
import { toIsoDateKey } from '@/features/widgets/utils/jalali-date'
import { buildMonthGrid } from '../utils/month-grid'

const MonthTitle: React.FC = () => {
	const { currentDate, today, goToToday } = useDate()
	const isAwayFromToday =
		currentDate.jMonth() !== today.jMonth() || currentDate.jYear() !== today.jYear()

	return (
		<div className="flex items-center justify-between h-5.5 px-1.5 shrink-0">
			<h3 className="text-sm font-extrabold text-fg-strong">
				<time dateTime={toIsoDateKey(currentDate)}>
					{currentDate.format('jMMMM jYYYY')}
				</time>
			</h3>
			{isAwayFromToday && <TodayChip onClick={goToToday} />}
		</div>
	)
}

interface MonthGridProps {
	display: CalendarDisplay
}

const MonthGrid: React.FC<MonthGridProps> = ({ display }) => {
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
			<div ref={gridRef} className="flex-1 min-h-0">
				<table className="w-full table-fixed border-collapse">
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
									className={cn(
										'h-4.5 font-semibold text-3xs',
										weekday.short === PERSIAN_WEEKDAYS[6].short
											? 'text-danger'
											: 'text-fg-faint'
									)}
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
												display={display}
												onClick={openFor}
											/>
										</td>
									) : (
										<td
											key={`cell-${weekIndex}-${dayIndex}`}
											aria-hidden="true"
											className="h-8 text-xs font-semibold text-center tabular-nums text-fg-ghost"
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

const CALENDAR_TABS: { id: CalendarTab; label: string }[] = [
	{ id: 'calendar', label: t('widgets.calendar.tab.calendar') },
	{ id: 'google', label: t('widgets.calendar.tab.google') },
]

interface Calendar2x3Props {
	display: CalendarDisplay
}

export function Calendar2x3({ display }: Calendar2x3Props) {
	const [activeTab, setActiveTab] = useState<CalendarTab>('calendar')
	const { currentDate, today, setCurrentDate, goToToday } = useDate()

	const isAwayFromToday =
		currentDate.jMonth() !== today.jMonth() || currentDate.jYear() !== today.jYear()

	const onTabClick = (tab: CalendarTab) => {
		setActiveTab(tab)
		Analytics.event(`calendar_tab_switch_to_${tab}`)
	}

	const changeMonth = (delta: number) => {
		setCurrentDate(currentDate.clone().add(delta, 'jMonth'))
	}

	useWidgetMenuActions(
		activeTab === 'calendar' && isAwayFromToday && (
			<PopoverMenuItem
				icon={<Icon name="undo" size={14} />}
				label={t('widgets.calendar.goToToday')}
				onClick={goToToday}
			/>
		)
	)

	const tabs = (
		<WidgetHeaderTabs
			label={t('widgets.calendar.tabsLabel')}
			tabs={CALENDAR_TABS}
			activeTab={activeTab}
			onChange={onTabClick}
		/>
	)

	if (activeTab === 'google') {
		return <GoogleCalendarTab tabs={tabs} />
	}

	return (
		<>
			<WidgetHeader
				title={tabs}
				actions={
					<>
						<WidgetHeaderButton
							label={t('widgets.calendar.prevMonth')}
							icon="chevronRight"
							onClick={() => changeMonth(-1)}
						/>
						<WidgetHeaderButton
							label={t('widgets.calendar.nextMonth')}
							icon="chevronLeft"
							onClick={() => changeMonth(1)}
						/>
					</>
				}
			/>
			<section
				aria-label={t('widgets.calendar.aria')}
				className="flex flex-col flex-1 min-h-0 gap-1"
			>
				<MonthTitle />
				<MonthGrid display={display} />
			</section>
		</>
	)
}
