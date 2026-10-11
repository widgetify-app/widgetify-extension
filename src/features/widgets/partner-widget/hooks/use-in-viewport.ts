import { type RefObject, useEffect, useState } from 'react'

export function useInViewport(ref: RefObject<HTMLElement | null>): boolean {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const element = ref.current

		if (!element) return

		const observer = new IntersectionObserver(([entry]) =>
			setIsVisible(entry.isIntersecting)
		)

		observer.observe(element)

		return () => observer.disconnect()
	}, [ref])

	return isVisible
}
