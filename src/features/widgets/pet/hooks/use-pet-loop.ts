import { type RefObject, useEffect, useRef } from 'react'
import { chooseTickMode, IDLE_POLL_MS, type TickFacts } from '../utils/pet-schedule'

const MIN_TICK_MS = 16
const MAX_TICK_MS = 250

interface PetLoopDeps {
	containerRef: RefObject<HTMLButtonElement | null>
	wakeRef: RefObject<() => void>
	tick: (elapsed: number) => void
	readFacts: () => Omit<TickFacts, 'visible'>
}

export function usePetLoop({ containerRef, wakeRef, tick, readFacts }: PetLoopDeps) {
	const tickRef = useRef(tick)
	tickRef.current = tick

	const readFactsRef = useRef(readFacts)
	readFactsRef.current = readFacts

	useEffect(() => {
		let frame: number | null = null
		let timer: ReturnType<typeof setTimeout> | null = null
		let visible = true
		let stopped = false
		let lastTick = performance.now()

		const cancelScheduled = () => {
			if (frame !== null) cancelAnimationFrame(frame)
			if (timer !== null) clearTimeout(timer)
			frame = null
			timer = null
		}

		const schedule = () => {
			if (stopped) return

			const mode = chooseTickMode({ visible, ...readFactsRef.current() })

			if (mode === 'idle') timer = setTimeout(run, IDLE_POLL_MS)
			else if (mode === 'frame') frame = requestAnimationFrame(run)
		}

		const run = () => {
			frame = null
			timer = null

			const now = performance.now()
			const elapsed = now - lastTick
			if (elapsed >= MIN_TICK_MS) {
				lastTick = now
				tickRef.current(Math.min(elapsed, MAX_TICK_MS))
			}
			schedule()
		}

		wakeRef.current = () => {
			cancelScheduled()
			schedule()
		}

		const container = containerRef.current
		const observer = container
			? new IntersectionObserver((entries) => {
					const entry = entries[entries.length - 1]
					if (!entry || entry.isIntersecting === visible) return

					visible = entry.isIntersecting
					cancelScheduled()
					if (visible) {
						lastTick = performance.now()
						schedule()
					}
				})
			: null
		if (container) observer?.observe(container)

		schedule()

		return () => {
			stopped = true
			cancelScheduled()
			observer?.disconnect()
			wakeRef.current = () => {}
		}
	}, [containerRef, wakeRef])
}
