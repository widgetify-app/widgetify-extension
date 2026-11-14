import { useEffect, useRef } from 'react'
import { useTheme } from '@/context/theme.context'
import { advanceFlakes, createFlakes, FLAKE_COUNT } from '../utils/snow-field'
import { createSnowSprites } from '../utils/snow-sprites'

const FRAME_MS = 1000 / 30
const FRAME_TOLERANCE_MS = 4
const MAX_STEP_MS = 100

function readFlakeColor(): string {
	return getComputedStyle(document.documentElement)
		.getPropertyValue('--color-fg-muted')
		.trim()
}

export function NavbarSnow() {
	const { theme } = useTheme()
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		const ctx = canvas?.getContext('2d')

		if (!canvas || !ctx) return

		let width = 0
		let height = 0
		let sprites: ImageBitmap[] = []
		let frame = 0
		let last = 0
		let cancelled = false

		const observer = new ResizeObserver(([entry]) => {
			const ratio = window.devicePixelRatio || 1

			width = entry.contentRect.width
			height = entry.contentRect.height
			canvas.width = Math.round(width * ratio)
			canvas.height = Math.round(height * ratio)
			ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
		})

		observer.observe(canvas)

		const flakes = createFlakes(FLAKE_COUNT, 2, Math.random)

		const draw = (now: number) => {
			frame = requestAnimationFrame(draw)

			const elapsed = now - last

			if (elapsed < FRAME_MS - FRAME_TOLERANCE_MS) return

			last = now
			advanceFlakes(flakes, Math.min(elapsed, MAX_STEP_MS) / 1000)
			ctx.clearRect(0, 0, width, height)

			for (const flake of flakes) {
				ctx.globalAlpha = flake.alpha
				ctx.drawImage(
					sprites[flake.sprite],
					flake.x * width,
					flake.y * height,
					flake.size,
					flake.size
				)
			}
		}

		createSnowSprites(readFlakeColor())
			.then((next) => {
				if (cancelled) {
					for (const sprite of next) sprite.close()

					return
				}

				sprites = next
				last = performance.now()
				frame = requestAnimationFrame(draw)
			})
			.catch(() => {})

		return () => {
			cancelled = true
			cancelAnimationFrame(frame)
			observer.disconnect()

			for (const sprite of sprites) sprite.close()
		}
	}, [theme])

	return (
		<div
			aria-hidden="true"
			className="absolute inset-0 -z-10 overflow-hidden pointer-events-none rounded-2xl sm:rounded-widget"
		>
			<canvas ref={canvasRef} className="size-full" />
		</div>
	)
}
