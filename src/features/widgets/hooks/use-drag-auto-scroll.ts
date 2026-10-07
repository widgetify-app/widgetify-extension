import { useCallback, useEffect, useRef } from 'react'
import { edgeScrollStep } from '../utils/edge-scroll'

function findScrollParent(element: HTMLElement | null): HTMLElement | null {
	for (let node = element?.parentElement ?? null; node; node = node.parentElement) {
		const { overflowY } = getComputedStyle(node)
		const canScroll = overflowY === 'auto' || overflowY === 'scroll'
		if (canScroll && node.scrollHeight > node.clientHeight) return node
	}
	return null
}

export function useDragAutoScroll(onScroll: () => void) {
	const onScrollRef = useRef(onScroll)
	onScrollRef.current = onScroll

	const scrollerRef = useRef<HTMLElement | null>(null)
	const startTopRef = useRef(0)
	const pointerYRef = useRef(0)
	const frameRef = useRef<number | null>(null)

	const handleScroll = useCallback(() => onScrollRef.current(), [])

	const stop = useCallback(() => {
		if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
		frameRef.current = null
		scrollerRef.current?.removeEventListener('scroll', handleScroll)
		scrollerRef.current = null
	}, [handleScroll])

	const start = useCallback(
		(element: HTMLElement | null, pointerY: number) => {
			stop()
			const scroller = findScrollParent(element)
			if (!scroller) return

			const rect = scroller.getBoundingClientRect()
			const top = Math.max(rect.top, 0)
			const bottom = Math.min(rect.bottom, window.innerHeight)

			scrollerRef.current = scroller
			startTopRef.current = scroller.scrollTop
			pointerYRef.current = pointerY
			scroller.addEventListener('scroll', handleScroll, { passive: true })

			const step = () => {
				const delta = edgeScrollStep(pointerYRef.current, top, bottom)
				if (delta !== 0) scroller.scrollTop += delta
				frameRef.current = requestAnimationFrame(step)
			}
			frameRef.current = requestAnimationFrame(step)
		},
		[stop, handleScroll]
	)

	const track = useCallback((pointerY: number) => {
		pointerYRef.current = pointerY
	}, [])

	const scrolledBy = useCallback(
		() =>
			scrollerRef.current ? scrollerRef.current.scrollTop - startTopRef.current : 0,
		[]
	)

	useEffect(() => stop, [stop])

	return { start, track, stop, scrolledBy }
}
