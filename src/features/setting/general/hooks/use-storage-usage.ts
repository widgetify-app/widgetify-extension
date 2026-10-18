import { useCallback, useEffect, useState } from 'react'
import {
	deleteCaches,
	estimateOriginUsage,
	measureCaches,
	measureSavedData,
} from '@/common/storage'
import {
	isClearableCache,
	type StorageUsageSummary,
	summarizeStorageUsage,
} from '../utils/storage-usage'

export function useStorageUsage() {
	const [summary, setSummary] = useState<StorageUsageSummary | null>(null)
	const [clearableNames, setClearableNames] = useState<string[]>([])
	const [failed, setFailed] = useState(false)
	const [isClearing, setIsClearing] = useState(false)

	const measure = useCallback(async () => {
		try {
			const [caches, userDataBytes, browserReportedBytes] = await Promise.all([
				measureCaches(),
				measureSavedData(),
				import.meta.env.FIREFOX ? Promise.resolve(0) : estimateOriginUsage(),
			])
			const next = summarizeStorageUsage({
				caches,
				userDataBytes,
				browserReportedBytes,
			})
			setClearableNames(
				caches.map((cache) => cache.name).filter((name) => isClearableCache(name))
			)
			setSummary(next)
			setFailed(false)
			return next
		} catch {
			setFailed(true)
			return null
		}
	}, [])

	useEffect(() => {
		measure()
	}, [measure])

	const clear = async (): Promise<number> => {
		const before = summary?.clearableBytes ?? 0
		setIsClearing(true)
		try {
			await deleteCaches(clearableNames)
			const after = await measure()
			return Math.max(0, before - (after?.clearableBytes ?? 0))
		} finally {
			setIsClearing(false)
		}
	}

	return { summary, failed, isClearing, clear }
}
