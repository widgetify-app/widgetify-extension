import { type RefObject, useEffect } from 'react'

export function useHorizontalWheelScroll(ref: RefObject<HTMLElement | null>) {
	useEffect(() => {
		const element = ref.current
		if (!element) return

		const onWheel = (event: WheelEvent) => {
			if (event.ctrlKey) return
			if (element.scrollWidth <= element.clientWidth) return

			const delta =
				Math.abs(event.deltaY) > Math.abs(event.deltaX)
					? event.deltaY
					: event.deltaX
			if (delta === 0) return

			const isRtl = getComputedStyle(element).direction === 'rtl'
			const before = element.scrollLeft
			element.scrollLeft = before + (isRtl ? -delta : delta)

			if (element.scrollLeft !== before) {
				event.preventDefault()
			}
		}

		element.addEventListener('wheel', onWheel, { passive: false })
		return () => element.removeEventListener('wheel', onWheel)
	}, [ref])
}
