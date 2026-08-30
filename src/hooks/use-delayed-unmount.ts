import { useEffect, useRef, useState } from 'react'
import { useGeneralSetting } from '@/context/general-setting.context'
import {
	EXIT_ANIMATION_MS,
	isRetainableValue,
} from '@/common/utils/animation-timing'

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

export function useLastDefined<T>(value: T, retainMs = EXIT_ANIMATION_MS): T {
	const { isOptimalMode } = useGeneralSetting()
	const [, forceRelease] = useState(0)
	const lastRef = useRef<T>(value)
	const isDefined = isRetainableValue(value)
	const effectiveRetain = isOptimalMode ? 0 : retainMs

	if (isDefined) {
		lastRef.current = value
	}

	useEffect(() => {
		if (isDefined) return

		const timer = setTimeout(() => {
			lastRef.current = value
			forceRelease((tick) => tick + 1)
		}, effectiveRetain)

		return () => clearTimeout(timer)
	}, [isDefined, effectiveRetain, value])

	return lastRef.current
}
