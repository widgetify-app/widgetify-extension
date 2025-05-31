import { useGeneralSetting } from '@/context/general-setting.context'
import { getTextColor, useTheme } from '@/context/theme.context'
import { motion } from 'framer-motion'
import type React from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { TfiBackRight } from 'react-icons/tfi'
import { type WidgetifyDate, getCurrentDate } from '../utils'

interface CalendarHeaderProps {
  currentDate: WidgetifyDate
  selectedDate: WidgetifyDate
  setCurrentDate: (date: WidgetifyDate) => void
  goToToday: () => void
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  selectedDate,
  setCurrentDate,
  goToToday,
}) => {
  const { theme } = useTheme()
  const { timezone } = useGeneralSetting()

  const isCurrentMonthToday = () => {
    const realToday = getCurrentDate(timezone)
    return (
      currentDate.jMonth() === realToday.jMonth() &&
      currentDate.jYear() === realToday.jYear()
    )
  }

  const isTodaySelected = () => {
    const realToday = getCurrentDate(timezone)
    return (
      selectedDate.jDate() === realToday.jDate() &&
      selectedDate.jMonth() === realToday.jMonth() &&
      selectedDate.jYear() === realToday.jYear()
    )
  }

  const showTodayButton = !isCurrentMonthToday() || !isTodaySelected()

  const changeMonth = (delta: number) => {
    // @ts-ignore
    setCurrentDate((prev: jalaliMoment.Moment) =>
      prev.clone().add(delta, 'jMonth'),
    )
  }

  const getHeaderTextStyle = () => {
    return theme === 'light' ? 'text-gray-700' : 'text-gray-200'
  }

  return (
    <div className="flex items-center justify-between p-2 md:p-2">
      <h3 className={`font-medium text-xs ${getHeaderTextStyle()}`}>
        {currentDate.format('dddd، jD jMMMM jYYYY')}
      </h3>

      <div className="flex gap-0.5">
        {showTodayButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={goToToday}
            className={`flex items-center gap-1 p-1 text-xs rounded-lg cursor-pointer transition-colors ${getTextColor(theme)} opacity-70 hover:opacity-100`}
          >
            <TfiBackRight size={12} />
          </motion.button>
        )}

        <button
          onClick={() => changeMonth(-1)}
          className={`flex items-center gap-1 p-1 text-xs rounded-lg cursor-pointer transition-colors ${getTextColor(theme)} opacity-70 hover:opacity-100`}
        >
          <FaChevronRight size={12} />
        </button>

        <button
          onClick={() => changeMonth(1)}
          className={`flex items-center gap-1 p-1  text-xs rounded-lg cursor-pointer transition-colors ${getTextColor(theme)} opacity-70 hover:opacity-100`}
        >
          <FaChevronLeft size={12} />
        </button>
      </div>
    </div>
  )
}
