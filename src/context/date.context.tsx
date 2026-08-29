import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import {
	convertShamsiToHijri,
	getCurrentDate,
	getHijriEvents,
	getShamsiEvents,
	type WidgetifyDate,
} from '@/layouts/widgets/calendar/utils'
import { useGetEvents } from '@/services/hooks/date/get-events.hook'
import { useGeneralSetting } from './general-setting.context'

interface DateContextType {
	currentDate: WidgetifyDate
	selectedDate: WidgetifyDate
	today: WidgetifyDate
	todayIsHoliday: boolean
	setCurrentDate: (date: WidgetifyDate) => void
	setSelectedDate: (date: WidgetifyDate) => void
	goToToday: () => void
	isToday: (date: WidgetifyDate) => boolean
	getHijriDate: (date: WidgetifyDate) => string
}

const DateContext = createContext<DateContextType | undefined>(undefined)

export const DateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { selected_timezone: timezone } = useGeneralSetting()
	const activeDate = getCurrentDate(timezone.value)

	const [currentDate, setCurrentDate] = useState<WidgetifyDate>(activeDate)
	const [selectedDate, setSelectedDate] = useState<WidgetifyDate>(activeDate)
	const [today, setToday] = useState<WidgetifyDate>(activeDate)

	useEffect(() => {
		const interval = setInterval(() => {
			setToday(getCurrentDate(timezone.value))
		}, 60000)

		return () => clearInterval(interval)
	}, [timezone])

	useEffect(() => {
		const newToday = getCurrentDate(timezone.value)
		setToday(newToday)
		setCurrentDate(newToday.clone())
		setSelectedDate(newToday.clone())
	}, [timezone])

	const goToToday = () => {
		const newToday = getCurrentDate(timezone.value)
		setCurrentDate(newToday.clone())
		setSelectedDate(newToday.clone())
	}

	const isToday = (date: WidgetifyDate): boolean => {
		return (
			date.jDate() === today.jDate() &&
			date.jMonth() === today.jMonth() &&
			date.jYear() === today.jYear()
		)
	}

	const getHijriDate = (date: WidgetifyDate): string => {
		const hijriDate = convertShamsiToHijri(date)
		return `${hijriDate.iYear()}/${hijriDate.iMonth() + 1}/${hijriDate.iDate()}`
	}

	const { data: events } = useGetEvents()

	const todayEvents = events
		? [...getShamsiEvents(events, today), ...getHijriEvents(events, today)]
		: []

	const todayIsHoliday = today.day() === 5 || todayEvents.some((e) => e.isHoliday)

	return (
		<DateContext.Provider
			value={{
				currentDate,
				selectedDate,
				todayIsHoliday,
				today,
				setCurrentDate,
				setSelectedDate,
				goToToday,
				isToday,
				getHijriDate,
			}}
		>
			{children}
		</DateContext.Provider>
	)
}

export const useDate = (): DateContextType => {
	const context = useContext(DateContext)
	const generalSetting = useGeneralSetting()
	const timezone = generalSetting?.selected_timezone?.value || 'Asia/Tehran'

	if (!context) {
		const activeDate = getCurrentDate(timezone)
		return {
			currentDate: activeDate,
			selectedDate: activeDate,
			today: activeDate,
			todayIsHoliday: activeDate.day() === 5,
			setCurrentDate: () => {},
			setSelectedDate: () => {},
			goToToday: () => {},
			isToday: (date: WidgetifyDate) => {
				return (
					date.jDate() === activeDate.jDate() &&
					date.jMonth() === activeDate.jMonth() &&
					date.jYear() === activeDate.jYear()
				)
			},
			getHijriDate: (date: WidgetifyDate) => {
				const hijriDate = convertShamsiToHijri(date)
				return `${hijriDate.iYear()}/${hijriDate.iMonth() + 1}/${hijriDate.iDate()}`
			},
		}
	}

	return context
}
