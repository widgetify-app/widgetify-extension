import { type RefObject, useLayoutEffect, useState } from 'react'

export interface ContainerSize {
	width: number
	height: number
}

export function useContainerSize(
	ref: RefObject<HTMLElement | null>
): ContainerSize {
	const [size, setSize] = useState<ContainerSize>({
		width: 0,
		height: 0,
	})

	useLayoutEffect(() => {
		const element = ref.current
		if (!element) return

		let animationFrameId: number | null = null

		const updateSize = (entries: ResizeObserverEntry[]) => {
			const entry = entries[0]
			if (!entry) return

			const width =
				entry.contentBoxSize?.[0]?.inlineSize ?? entry.contentRect.width

			const height =
				entry.contentBoxSize?.[0]?.blockSize ?? entry.contentRect.height

			if (animationFrameId !== null) {
				cancelAnimationFrame(animationFrameId)
			}

			animationFrameId = requestAnimationFrame(() => {
				setSize({
					width,
					height,
				})
			})
		}

		const observer = new ResizeObserver(updateSize)
		observer.observe(element)

		const initialRect = element.getBoundingClientRect()
		if (initialRect.width > 0 || initialRect.height > 0) {
			setSize({
				width: initialRect.width,
				height: initialRect.height,
			})
		}

		return () => {
			if (animationFrameId !== null) {
				cancelAnimationFrame(animationFrameId)
			}
			observer.disconnect()
		}
	}, [ref])

	return size
}
