import { useEffect, useRef, useState } from 'react'

export function useInView<T extends Element>() {
	const ref = useRef<T>(null)
	const [inView, setInView] = useState(true)

	useEffect(() => {
		const element = ref.current
		if (!element) return
		const observer = new IntersectionObserver(([entry]) =>
			setInView(entry.isIntersecting)
		)
		observer.observe(element)
		return () => observer.disconnect()
	}, [])

	return [ref, inView] as const
}
