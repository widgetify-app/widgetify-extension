import { useCallback, useEffect, useRef, useState } from 'react'
import { getFromStorage, removeFromStorage, setToStorage } from '@/common/storage'
import { isPagerIdStale, normalizePagerId } from '../utils/normalize-pager-id'

interface CompactPagerStateOptions {
	ids: readonly string[]
	isReady: boolean
	storageKey?: string
}

type PagerStorageKey = `compactPager:${string}`

const savedIds = new Map<PagerStorageKey, string | null>()

export function useCompactPagerState({
	ids,
	isReady,
	storageKey,
}: CompactPagerStateOptions) {
	const key: PagerStorageKey | null = storageKey ? `compactPager:${storageKey}` : null
	const known = key ? savedIds.get(key) : undefined
	const [currentId, setCurrentId] = useState<string | null>(known ?? null)
	const [isHydrated, setIsHydrated] = useState(key === null || known !== undefined)
	const hasSelected = useRef(false)

	useEffect(() => {
		if (!key) return
		if (savedIds.has(key)) {
			const cachedId = savedIds.get(key) ?? null
			if (cachedId && !hasSelected.current) setCurrentId(cachedId)
			setIsHydrated(true)
			return
		}
		let cancelled = false

		getFromStorage(key)
			.catch(() => null)
			.then((saved) => {
				const savedId = normalizePagerId(saved)
				if (!savedIds.has(key)) savedIds.set(key, savedId)
				if (cancelled) return
				if (savedId && !hasSelected.current) setCurrentId(savedId)
				setIsHydrated(true)
			})

		return () => {
			cancelled = true
		}
	}, [key])

	const select = useCallback(
		(id: string) => {
			hasSelected.current = true
			setCurrentId(id)
			if (!key) return
			savedIds.set(key, id)
			setToStorage(key, id)
		},
		[key]
	)

	const isStale = isPagerIdStale(currentId, ids, isReady)

	useEffect(() => {
		if (!isStale) return
		setCurrentId(null)
		if (!key) return
		savedIds.set(key, null)
		removeFromStorage(key)
	}, [isStale, key])

	return { currentId, select, isHydrated }
}
