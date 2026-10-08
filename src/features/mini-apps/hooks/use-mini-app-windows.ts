import { useEffect, useState } from 'react'
import { watchStorage } from '@/common/storage'
import type { MiniAppWindows } from '../types'
import { forgetMiniAppWindow, readLiveMiniAppWindows } from '../utils/mini-app-windows'

export function useMiniAppWindows(): MiniAppWindows {
	const [windows, setWindows] = useState<MiniAppWindows>({})

	useEffect(() => {
		readLiveMiniAppWindows().then(setWindows)

		const unwatch = watchStorage('miniAppWindows', (value) => setWindows(value ?? {}))
		const onRemoved = (windowId: number) => {
			forgetMiniAppWindow(windowId)
		}
		browser.windows.onRemoved.addListener(onRemoved)

		return () => {
			unwatch()
			browser.windows.onRemoved.removeListener(onRemoved)
		}
	}, [])

	return windows
}
