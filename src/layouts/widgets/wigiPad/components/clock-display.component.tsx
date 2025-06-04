import { useGeneralSetting } from '@/context/general-setting.context'
import { getCurrentDate } from '@/layouts/widgets/calendar/utils'
import { useEffect, useState } from 'react'

export function ClockDisplay() {
	const { timezone } = useGeneralSetting()
	const [time, setTime] = useState(getCurrentDate(timezone))

	useEffect(() => {
		const timer = setInterval(() => {
			setTime(getCurrentDate(timezone))
		}, 1000)
		return () => clearInterval(timer)
	}, [timezone])

	const timeZone = timezone.replace('_', ' ').split('/')

	return (
		<div className="flex flex-col items-center justify-center p-3 border border-b-0 rounded bg-content border-content">
			<div className="text-3xl font-bold text-content">{time.format('HH:mm')}</div>
			<div className="text-xs text-content opacity-70">
				{timeZone[timeZone.length - 1]}
			</div>
		</div>
	)
}
