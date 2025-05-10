import {
	type WidgetifyDate,
	convertShamsiToHijri,
	getCurrentDate,
} from '@/layouts/widgets/calendar/utils'
import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { useGeneralSetting } from './general-setting.context'

interface DateContextType {
	currentDate: WidgetifyDate
	selectedDate: WidgetifyDate
	today: WidgetifyDate
	setCurrentDate: (date: WidgetifyDate) => void
	setSelectedDate: (date: WidgetifyDate) => void
	goToToday: () => void
	isToday: (date: WidgetifyDate) => boolean
	getHijriDate: (date: WidgetifyDate) => string
	getGregorianDate: (date: WidgetifyDate) => string
}

const DateContext = createContext<DateContextType | undefined>(undefined)

export const DateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { timezone } = useGeneralSetting()
	const realToday = getCurrentDate(timezone)

	const [currentDate, setCurrentDate] = useState<WidgetifyDate>(realToday)
	const [selectedDate, setSelectedDate] = useState<WidgetifyDate>(realToday)
	const [today, setToday] = useState<WidgetifyDate>(realToday)

	// Update today date every minute to ensure it stays current
	useEffect(() => {
		const interval = setInterval(() => {
			setToday(getCurrentDate(timezone))
		}, 60000)

		return () => clearInterval(interval)
	}, [timezone])

	// Sync with timezone changes
	useEffect(() => {
		const newToday = getCurrentDate(timezone)
		setToday(newToday)
		setCurrentDate(newToday.clone())
		setSelectedDate(newToday.clone())
	}, [timezone])

	const goToToday = () => {
		const newToday = getCurrentDate(timezone)
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

	const getGregorianDate = (date: WidgetifyDate): string => {
		const gregorianDate = date.clone().locale('en').utc().add(3.5, 'hours')
		return gregorianDate.format('YYYY/MM/DD')
	}

	return (
		<DateContext.Provider
			value={{
				currentDate,
				selectedDate,
				today,
				setCurrentDate,
				setSelectedDate,
				goToToday,
				isToday,
				getHijriDate,
				getGregorianDate,
			}}
		>
			{children}
		</DateContext.Provider>
	)
}

export const useDate = (): DateContextType => {
	const context = useContext(DateContext)

	if (!context) {
		throw new Error('useDate must be used within a DateProvider')
	}

	return context
}
