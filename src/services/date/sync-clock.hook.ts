import { useEffect } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { isClockSyncFresh, setClockOffset } from '@/common/utils/trusted-time'
import { getServerClockOffset } from '@/services/date/get-server-clock-offset'

let loading: Promise<void> | null = null

async function loadClockOffset() {
	const saved = await getFromStorage('clockSync')

	if (saved && isClockSyncFresh(saved, Date.now())) {
		setClockOffset(saved.offset)
		return
	}

	try {
		const offset = await getServerClockOffset()

		setClockOffset(offset)
		await setToStorage('clockSync', { offset, syncedAt: Date.now() })
	} catch {
		return
	}
}

export function useSyncClock() {
	useEffect(() => {
		loading ??= loadClockOffset().finally(() => {
			loading = null
		})
	}, [])
}
