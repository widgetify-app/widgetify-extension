import { useEffect, useState } from 'react'
import type { FetchedTimezone } from '@/services/hooks/timezone/getTimezones.hook'

interface SimpleDigitalClockProps {
	timezone: FetchedTimezone
	useSelectedFont?: boolean
}

export function SimpleDigitalClock({
	timezone,
	useSelectedFont = false,
}: SimpleDigitalClockProps) {
	const [time, setTime] = useState(
		new Date(new Date().toLocaleString('en-US', { timeZone: timezone.value }))
	)

	useEffect(() => {
		const timer = setInterval(() => {
			setTime(
				new Date(new Date().toLocaleString('en-US', { timeZone: timezone.value }))
			)
		}, 1000)
		return () => clearInterval(timer)
	}, [timezone])

	const hours = time.getHours().toString().padStart(2, '0')
	const minutes = time.getMinutes().toString().padStart(2, '0')

	return (
		// <div
		// 	className={`text-content flex flex-col items-center text-center leading-none font-black drop-shadow-md z-10 transition-all duration-300 text-xl ${
		// 		!useSelectedFont ? 'font-sans' : ''
		// 	}`}
		// >
		// 	<span>{hours}</span>
		// 	<span>{minutes}</span>
		// </div>
		<div
			className={`text-content  text-3xl -mt-2
			 mx-auto flex flex-col h-full	items-center text-center 
				font-black drop-shadow-md transition-all duration-300`}
		>
			<span>{hours}</span>
			<span>{minutes}</span>
		</div>
	)
}
