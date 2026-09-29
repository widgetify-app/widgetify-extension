import { useEffect, useRef, useCallback } from 'react'

interface UseInfiniteScrollOptions {
	hasNextPage: boolean
	isFetchingNextPage: boolean
	fetchNextPage: () => void
	direction?: 'horizontal' | 'vertical'
	threshold?: number
	rootMargin?: string
}

export function useInfiniteScroll({
	hasNextPage,
	isFetchingNextPage,
	fetchNextPage,
	direction = 'vertical',
	threshold = 0.1,
	rootMargin = '0px',
}: UseInfiniteScrollOptions) {
	const observerRef = useRef<IntersectionObserver | null>(null)
	const loadMoreRef = useRef<HTMLDivElement | null>(null)
	const containerRef = useRef<HTMLDivElement | null>(null)
	const isRequestingRef = useRef(false)

	const handleScroll = useCallback(() => {
		if (
			!containerRef.current ||
			!hasNextPage ||
			isFetchingNextPage ||
			isRequestingRef.current
		)
			return

		const container = containerRef.current
		const {
			scrollLeft,
			scrollWidth,
			clientWidth,
			scrollTop,
			scrollHeight,
			clientHeight,
		} = container

		let isNearEnd = false

		if (direction === 'horizontal') {
			isNearEnd = scrollLeft + clientWidth >= scrollWidth - 100
		} else {
			isNearEnd = scrollTop + clientHeight >= scrollHeight - 100
		}

		if (isNearEnd) {
			isRequestingRef.current = true
			fetchNextPage()
			setTimeout(() => {
				isRequestingRef.current = false
			}, 500)
		}
	}, [hasNextPage, isFetchingNextPage, fetchNextPage, direction])

	useEffect(() => {
		if (!isFetchingNextPage) {
			isRequestingRef.current = false
		}
	}, [isFetchingNextPage])

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		container.addEventListener('scroll', handleScroll)
		return () => {
			container.removeEventListener('scroll', handleScroll)
		}
	}, [handleScroll])

	useEffect(() => {
		if (observerRef.current) {
			observerRef.current.disconnect()
		}

		observerRef.current = new IntersectionObserver(
			(entries) => {
				if (
					entries[0].isIntersecting &&
					hasNextPage &&
					!isFetchingNextPage &&
					!isRequestingRef.current
				) {
					isRequestingRef.current = true
					fetchNextPage()
					setTimeout(() => {
						isRequestingRef.current = false
					}, 500)
				}
			},
			{
				root: containerRef.current,
				threshold,
				rootMargin,
			}
		)

		if (loadMoreRef.current) {
			observerRef.current.observe(loadMoreRef.current)
		}

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect()
			}
		}
	}, [hasNextPage, isFetchingNextPage, fetchNextPage, threshold, rootMargin])

	return { containerRef, loadMoreRef }
}
