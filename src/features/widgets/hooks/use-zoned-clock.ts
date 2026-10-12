import { useEffect, useState } from 'react'
import { nowMs, onClockCorrected } from '@/common/utils/trusted-time'
import { getZonedNow, msUntilNextMinute } from '@/features/widgets/utils/zoned-now'

const SECOND_MS = 1000

export function useZonedClock(timeZone?: string, withSeconds = false): Date {
	const [now, setNow] = useState(() => getZonedNow(timeZone))

	useEffect(() => {
		const update = () => setNow(getZonedNow(timeZone))

		update()

		const stopListening = onClockCorrected(update)

		if (withSeconds) {
			const timer = setInterval(update, SECOND_MS)
			return () => {
				clearInterval(timer)
				stopListening()
			}
		}

		let timer: ReturnType<typeof setTimeout>
		const scheduleNextMinute = () => {
			timer = setTimeout(() => {
				update()
				scheduleNextMinute()
			}, msUntilNextMinute(nowMs()))
		}
		scheduleNextMinute()

		return () => {
			clearTimeout(timer)
			stopListening()
		}
	}, [timeZone, withSeconds])

	return now
}
