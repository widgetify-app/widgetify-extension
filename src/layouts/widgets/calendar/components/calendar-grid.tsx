import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { getTextColor, useTheme } from '@/context/theme.context'
import { useTodoStore } from '@/context/todo.context'
import { useGetEvents } from '@/services/hooks/date/getEvents.hook'
import { useGetGoogleCalendarEvents } from '@/services/hooks/date/getGoogleCalendarEvents.hook'
import type React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { type WidgetifyDate, formatDateStr } from '../utils'
import { DayItem } from './day/day'

const WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

interface CalendarGridProps {
  currentDate: WidgetifyDate
  selectedDate: WidgetifyDate
  setSelectedDate: (date: WidgetifyDate) => void
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  selectedDate,
  setSelectedDate,
}) => {
  const { user } = useAuth()
  const { timezone } = useGeneralSetting()

  const { theme } = useTheme()
  const { data: events } = useGetEvents()
  const { todos } = useTodoStore()

  const startOfMonth = currentDate.clone().startOf('jMonth').toDate()
  const endOfMonth = currentDate.clone().endOf('jMonth').toDate()

  const { data: googleEvents } = useGetGoogleCalendarEvents(
    user?.connections?.includes('google') || false,
    startOfMonth,
    endOfMonth,
  )

  const firstDayOfMonth = currentDate.clone().startOf('jMonth').day()
  const daysInMonth = currentDate.clone().endOf('jMonth').jDate()
  const emptyDays = (firstDayOfMonth + 1) % 7

  const prevMonth = currentDate.clone().subtract(1, 'jMonth')
  const daysInPrevMonth = prevMonth.clone().endOf('jMonth').jDate()
  const prevMonthStartDay = daysInPrevMonth - emptyDays + 1

  const totalCells = 42
  const nextMonthDays = totalCells - daysInMonth - emptyDays

  const selectedDateStr = formatDateStr(selectedDate)

  const getWeekdayHeaderStyle = () => {
    return theme === 'light' ? 'text-gray-500' : 'text-gray-400'
  }

  return (
    <div className="grid grid-cols-7 gap-1 p-2 text-center">
      {WEEKDAYS.map((day) => (
        <div key={day} className={`text-sm mb-1 ${getWeekdayHeaderStyle()}`}>
          {day}
        </div>
      ))}

      {Array.from({ length: emptyDays }).map((_, i) => (
        <div
          key={`prev-month-${i}`}
          className={`
						p-0 text-xs
						h-6 w-6 mx-auto flex items-center justify-center rounded-full
						${getTextColor(theme)} opacity-40
					`}
        >
          {prevMonthStartDay + i}
        </div>
      ))}

      {Array.from({ length: daysInMonth }, (_, i) => (
        <DayItem
          key={uuidv4()}
          currentDate={currentDate}
          day={i + 1}
          events={events}
          googleEvents={googleEvents}
          selectedDateStr={selectedDateStr}
          setSelectedDate={setSelectedDate}
          todos={todos}
          timezone={timezone}
        />
      ))}

      {Array.from({ length: nextMonthDays }).map((_, i) => (
        <div
          key={`next-month-${i}`}
          className={`
						p-0 text-xs 
						h-6 w-6 mx-auto flex items-center justify-center rounded-full
						${getTextColor(theme)} opacity-40
					`}
        >
          {i + 1}
        </div>
      ))}
    </div>
  )
}
