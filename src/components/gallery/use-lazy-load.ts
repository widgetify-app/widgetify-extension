import { useEffect, useRef } from 'react'

export function useLazyLoad<T extends HTMLElement>(onVisible: () => void) {
	const elementRef = useRef<T>(null)
	const observer = useRef<IntersectionObserver | null>(null)

	useEffect(() => {
		if (!elementRef.current) return

		observer.current = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					onVisible()

					if (observer.current) {
						observer.current.disconnect()
					}
				}
			},
			{
				root: null,
				rootMargin: '100px',
				threshold: 0.1,
			}
		)

		observer.current.observe(elementRef.current)

		return () => {
			if (observer.current) {
				observer.current.disconnect()
			}
		}
	}, [onVisible])

	return elementRef
}
