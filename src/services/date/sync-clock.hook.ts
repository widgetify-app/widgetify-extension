import { useEffect } from 'react'
import { setClockOffset } from '@/common/utils/trusted-time'
import { getServerClockOffset } from '@/services/date/get-server-clock-offset'

const RESYNC_EVERY_MS = 30 * 60 * 1000
const RESYNC_AFTER_RETURN_MS = 5 * 60 * 1000

export function useSyncClock() {
	useEffect(() => {
		let lastSyncAt = Number.NEGATIVE_INFINITY

		const sync = async () => {
			lastSyncAt = performance.now()

			try {
				setClockOffset(await getServerClockOffset())
			} catch {
				lastSyncAt = Number.NEGATIVE_INFINITY
			}
		}

		const syncWhenBack = () => {
			if (document.visibilityState !== 'visible') return
			if (performance.now() - lastSyncAt < RESYNC_AFTER_RETURN_MS) return

			sync()
		}

		sync()

		const timer = setInterval(sync, RESYNC_EVERY_MS)
		document.addEventListener('visibilitychange', syncWhenBack)

		return () => {
			clearInterval(timer)
			document.removeEventListener('visibilitychange', syncWhenBack)
		}
	}, [])
}
