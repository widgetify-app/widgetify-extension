import { useEffect } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { isClockSyncFresh, setClockOffset } from '@/common/utils/trusted-time'
import { getServerClockOffset } from '@/services/date/get-server-clock-offset'

let started = false

async function loadClockOffset() {
	const saved = await getFromStorage('clockSync')

	if (saved && isClockSyncFresh(saved, Date.now())) {
		setClockOffset(saved.offset)
		return true
	}

	try {
		const offset = await getServerClockOffset()

		setClockOffset(offset)
		await setToStorage('clockSync', { offset, syncedAt: Date.now() })

		return true
	} catch {
		return false
	}
}

export function useSyncClock() {
	useEffect(() => {
		if (started) return

		started = true

		loadClockOffset().then((done) => {
			if (!done) started = false
		})
	}, [])
}
