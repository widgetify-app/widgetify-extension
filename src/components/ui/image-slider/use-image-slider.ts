import { useCallback, useEffect, useState } from 'react'
import {
	getNextSlideIndex,
	getPrevSlideIndex,
	resolveActiveSlideImage,
} from './slider-utils'

export interface UseImageSliderOptions {
	images?: string[]
	fallbackSrc?: string
	autoPlay?: boolean
	interval?: number
	isPaused?: boolean
	onChange?: (index: number) => void
}

export function useImageSlider({
	images = [],
	fallbackSrc,
	autoPlay = true,
	interval = 4500,
	isPaused = false,
	onChange,
}: UseImageSliderOptions = {}) {
	const count = images.length
	const hasMultiple = count > 1
	const [currentIndex, setCurrentIndex] = useState(0)

	useEffect(() => {
		if (currentIndex >= count && count > 0) {
			setCurrentIndex(0)
		}
	}, [count, currentIndex])

	const next = useCallback(() => {
		if (!hasMultiple) return
		setCurrentIndex((prev) => {
			const nextIdx = getNextSlideIndex(prev, count)
			onChange?.(nextIdx)
			return nextIdx
		})
	}, [count, hasMultiple, onChange])

	const prev = useCallback(() => {
		if (!hasMultiple) return
		setCurrentIndex((prev) => {
			const prevIdx = getPrevSlideIndex(prev, count)
			onChange?.(prevIdx)
			return prevIdx
		})
	}, [count, hasMultiple, onChange])

	const goTo = useCallback(
		(index: number) => {
			if (index >= 0 && index < count) {
				setCurrentIndex(index)
				onChange?.(index)
			}
		},
		[count, onChange]
	)

	useEffect(() => {
		if (!autoPlay || !hasMultiple || isPaused) return
		const timer = setInterval(next, interval)
		return () => clearInterval(timer)
	}, [autoPlay, hasMultiple, isPaused, interval, next])

	const currentImage = resolveActiveSlideImage(images, currentIndex, fallbackSrc)

	return {
		currentIndex,
		count,
		hasMultiple,
		currentImage,
		next,
		prev,
		goTo,
	}
}
