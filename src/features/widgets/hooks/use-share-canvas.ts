import { useCallback, useEffect, useState } from 'react'

type RenderShare = (canvas: HTMLCanvasElement) => Promise<void>

export function useShareCanvas(render: RenderShare, enabled: boolean) {
	const [attempt, setAttempt] = useState(0)
	const [result, setResult] = useState<{
		render: RenderShare
		attempt: number
		image: HTMLCanvasElement | null
	} | null>(null)

	useEffect(() => {
		if (!enabled) return

		let active = true
		const image = document.createElement('canvas')

		async function prepare() {
			try {
				await render(image)
				if (active) setResult({ render, attempt, image })
			} catch {
				if (active) setResult({ render, attempt, image: null })
			}
		}

		void prepare()
		return () => {
			active = false
		}
	}, [render, enabled, attempt])

	const current =
		result?.render === render && result.attempt === attempt ? result : null
	const image = current?.image ?? null
	const previewRef = useCallback(
		(canvas: HTMLCanvasElement | null) => {
			if (!canvas || !image) return

			canvas.width = image.width
			canvas.height = image.height
			canvas.getContext('2d')?.drawImage(image, 0, 0)
		},
		[image]
	)

	return {
		image,
		previewRef,
		failed: current !== null && image === null,
		retry: () => setAttempt((value) => value + 1),
	}
}
