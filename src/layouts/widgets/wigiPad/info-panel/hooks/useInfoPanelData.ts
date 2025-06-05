import { useCurrencyStore } from '@/context/currency.context'
import { useGetCurrencyByCode } from '@/services/hooks/currency/getCurrencyByCode.hook'
import { useGetEvents } from '@/services/hooks/date/getEvents.hook'
import { useGetGoogleCalendarEvents } from '@/services/hooks/date/getGoogleCalendarEvents.hook'
import { useEffect, useState } from 'react'

export interface InfoPanelData {
	birthdays: Array<{
		id: string
		name: string
		date: string
		avatar?: string
	}>
	notifications: Array<{
		id: string
		title: string
		message: string
		type: 'info' | 'warning' | 'success' | 'error'
		timestamp: Date
	}>
	holidays: Array<{
		id: string
		title: string
		date: string
		isToday: boolean
	}>
	currencyRates: Array<{
		id: string
		currency: string
		rate: number
		change: number
		symbol: string
	}>
	googleMeetings: Array<{
		id: string
		title: string
		startTime: string
		endTime: string
		meetLink?: string
	}>
}

export const useInfoPanelData = (): InfoPanelData => {
	const { data: events } = useGetEvents()
	const { data: googleEvents } = useGetGoogleCalendarEvents(true)
	const { selectedCurrencies } = useCurrencyStore()

	// Mock data for now - will be replaced with real APIs
	const [data, setData] = useState<InfoPanelData>({
		birthdays: [
			{ id: '1', name: 'احمد محمدی', date: 'امروز' },
			{ id: '2', name: 'سارا احمدی', date: 'فردا' },
			{ id: '3', name: 'علی رضایی', date: '2 روز دیگر' },
		],
		notifications: [
			{
				id: '1',
				title: 'به‌روزرسانی جدید',
				message: 'نسخه جدید ویجتیفای منتشر شد',
				type: 'info',
				timestamp: new Date(),
			},
			{
				id: '2',
				title: 'یادآوری',
				message: 'جلسه تیم در ساعت 2 بعدازظهر',
				type: 'warning',
				timestamp: new Date(),
			},
		],
		holidays: [],
		currencyRates: [],
		googleMeetings: [],
	})

	useEffect(() => {
		// Process holidays from events API
		if (events) {
			const today = new Date()

			setData((prev) => ({
				...prev,
				holidays: [],
			}))
		}
	}, [events])

	useEffect(() => {
		// Process Google Calendar events
		if (googleEvents && googleEvents.length > 0) {
			const meetings = googleEvents
				.filter((event) => event.conferenceData?.entryPoints?.[0]?.uri)
				.slice(0, 5) // Limit to 5 meetings
				.map((event) => ({
					id: event.id,
					title: event.summary,
					startTime: new Date(event.start.dateTime).toLocaleTimeString('fa-IR', {
						hour: '2-digit',
						minute: '2-digit',
					}),
					endTime: new Date(event.end.dateTime).toLocaleTimeString('fa-IR', {
						hour: '2-digit',
						minute: '2-digit',
					}),
					meetLink: event.conferenceData?.entryPoints?.[0]?.uri || event.hangoutLink,
				}))

			setData((prev) => ({
				...prev,
				googleMeetings: meetings,
			}))
		}
	}, [googleEvents])

	// Fetch currency data for selected currencies
	useEffect(() => {
		const fetchCurrencyData = async () => {
			if (selectedCurrencies && selectedCurrencies.length > 0) {
				try {
					// We'll use a simple approach - get data from localStorage like in CurrencyBox
					const currencyPromises = selectedCurrencies
						.slice(0, 3)
						.map(async (currencyCode) => {
							try {
								const { getFromStorage } = await import('@/common/storage')
								const cachedCurrency = await getFromStorage(`currency:${currencyCode}`)

								if (cachedCurrency) {
									return {
										id: currencyCode,
										currency:
											cachedCurrency.name?.fa || cachedCurrency.name?.en || currencyCode,
										rate: cachedCurrency.rialPrice || cachedCurrency.price || 0,
										change: cachedCurrency.changePercentage || 0,
										symbol: currencyCode,
									}
								}
							} catch (error) {
								console.warn(`Error fetching currency ${currencyCode}:`, error)
							}
							return null
						})
					const currencyResults = await Promise.all(currencyPromises)
					const validCurrencies = currencyResults.filter(
						(currency): currency is NonNullable<typeof currency> => currency !== null,
					)

					if (validCurrencies.length > 0) {
						setData((prev) => ({
							...prev,
							currencyRates: validCurrencies,
						}))
					}
				} catch (error) {
					console.warn('Error fetching currency data:', error)
				}
			}
		}

		fetchCurrencyData()
	}, [selectedCurrencies])

	return data
}
