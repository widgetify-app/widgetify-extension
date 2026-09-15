import { useEffect, useState } from 'react'
import { getZonedNow, msUntilNextMinute } from '@/common/utils/zoned-now'

const SECOND_MS = 1000

export function useZonedClock(timeZone?: string, withSeconds = false): Date {
	const [now, setNow] = useState(() => getZonedNow(timeZone))

	useEffect(() => {
		const update = () => setNow(getZonedNow(timeZone))

		update()

		if (withSeconds) {
			const timer = setInterval(update, SECOND_MS)
			return () => clearInterval(timer)
		}

		let timer: ReturnType<typeof setTimeout>
		const scheduleNextMinute = () => {
			timer = setTimeout(() => {
				update()
				scheduleNextMinute()
			}, msUntilNextMinute(Date.now()))
		}
		scheduleNextMinute()

		return () => clearTimeout(timer)
	}, [timeZone, withSeconds])

	return now
}
