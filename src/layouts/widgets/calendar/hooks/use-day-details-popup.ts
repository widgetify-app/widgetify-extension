import { useState } from 'react'
import Analytics from '@/analytics'
import { useDate } from '@/context/date.context'
import type { WidgetifyDate } from '../utils/date-events'

export function useDayDetailsPopup() {
	const { today, setSelectedDate } = useDate()
	const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null)
	const [popupDate, setPopupDate] = useState<WidgetifyDate | null>(null)
	const [isOpen, setIsOpen] = useState(false)

	const openFor = (day: WidgetifyDate, element: HTMLButtonElement) => {
		Analytics.event('calendar_day_click')
		setSelectedDate(day)
		setPopupDate(day)
		setAnchor(element)
		setIsOpen(true)
	}

	const setOpen = (open: boolean) => {
		setIsOpen(open)
		setSelectedDate(open && popupDate ? popupDate : today.clone())
	}

	return { anchor, popupDate, isOpen, openFor, setOpen }
}
