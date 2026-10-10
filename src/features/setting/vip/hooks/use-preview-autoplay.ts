import { useEffect, useState } from 'react'

const FLIP_EVERY_MS = 3800
const WIPE_MS = 1000

export function usePreviewAutoplay(canPlay: boolean) {
	const [isPro, setIsPro] = useState(false)
	const [isWiping, setIsWiping] = useState(false)
	const [isAutoplay, setIsAutoplay] = useState(true)
	const [isHovered, setIsHovered] = useState(false)

	useEffect(() => {
		if (!canPlay || !isAutoplay || isHovered) return
		const timer = setInterval(() => {
			setIsPro((current) => !current)
			setIsWiping(true)
		}, FLIP_EVERY_MS)
		return () => clearInterval(timer)
	}, [canPlay, isAutoplay, isHovered])

	useEffect(() => {
		if (!isWiping) return
		const timer = setTimeout(() => setIsWiping(false), WIPE_MS)
		return () => clearTimeout(timer)
	}, [isWiping, isPro])

	const choose = (next: boolean) => {
		setIsAutoplay(false)
		if (next === isPro) return
		setIsPro(next)
		setIsWiping(true)
	}

	return { isPro, isWiping, choose, setIsHovered }
}
