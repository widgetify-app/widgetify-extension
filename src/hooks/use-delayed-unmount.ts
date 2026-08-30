import { useEffect, useRef, useState } from 'react'

export const EXIT_ANIMATION_MS = 360

export function useDelayedUnmount(isOpen: boolean, delayMs: number): boolean {
	const [shouldRender, setShouldRender] = useState(isOpen)

	useEffect(() => {
		if (isOpen) {
			setShouldRender(true)
			return
		}

		const timer = setTimeout(() => setShouldRender(false), delayMs)
		return () => clearTimeout(timer)
	}, [isOpen, delayMs])

	return isOpen || shouldRender
}

export function useLastDefined<T>(value: T, retainMs = EXIT_ANIMATION_MS): T {
	const [, forceRelease] = useState(0)
	const lastRef = useRef<T>(value)
	const isDefined = value !== null && value !== undefined && value !== false

	if (isDefined) {
		lastRef.current = value
	}

	useEffect(() => {
		if (isDefined) return

		const timer = setTimeout(() => {
			lastRef.current = value
			forceRelease((tick) => tick + 1)
		}, retainMs)

		return () => clearTimeout(timer)
	}, [isDefined, retainMs, value])

	return lastRef.current
}
