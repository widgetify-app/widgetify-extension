import { useEffect, useRef, useState } from 'react'

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

export function useLastDefined<T>(value: T): T {
	const lastRef = useRef<T>(value)

	if (value !== null && value !== undefined && value !== false) {
		lastRef.current = value
	}

	return lastRef.current
}
