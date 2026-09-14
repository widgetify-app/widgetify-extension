import { useEffect, useState } from 'react'
import { useGeneralSetting } from '@/context/general-setting.context'
import { EXIT_ANIMATION_MS } from '@/common/utils/animation-timing'

export { EXIT_ANIMATION_MS }

export function useDelayedUnmount(isOpen: boolean, delayMs: number): boolean {
	const { isOptimalMode } = useGeneralSetting()
	const [shouldRender, setShouldRender] = useState(isOpen)
	const effectiveDelay = isOptimalMode ? 0 : delayMs

	useEffect(() => {
		if (isOpen) {
			setShouldRender(true)
			return
		}

		if (effectiveDelay <= 0) {
			setShouldRender(false)
			return
		}

		const timer = setTimeout(() => setShouldRender(false), effectiveDelay)
		return () => clearTimeout(timer)
	}, [isOpen, effectiveDelay])

	return isOpen || shouldRender
}
