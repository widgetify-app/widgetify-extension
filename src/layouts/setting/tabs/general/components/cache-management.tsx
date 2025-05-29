import { SectionPanel } from '@/components/section-panel'
import { useTheme } from '@/context/theme.context'
import { useState, useEffect } from 'react'
import { FiTrash2, FiDownload, FiHardDrive, FiWifi, FiWifiOff } from 'react-icons/fi'
import { assetCache } from '@/common/utils/assetCache'

interface CacheStats {
	totalSize: number
	totalItems: number
	isOnline: boolean
}

export function CacheManagement() {
	const { theme } = useTheme()
	const [cacheStats, setCacheStats] = useState<CacheStats>({
		totalSize: 0,
		totalItems: 0,
		isOnline: navigator.onLine
	})
	const [isClearing, setIsClearing] = useState(false)
	const [lastCleared, setLastCleared] = useState<Date | null>(null)

	useEffect(() => {
		loadCacheStats()
		
		// Listen for online/offline status changes
		const handleOnline = () => setCacheStats(prev => ({ ...prev, isOnline: true }))
		const handleOffline = () => setCacheStats(prev => ({ ...prev, isOnline: false }))
		
		window.addEventListener('online', handleOnline)
		window.addEventListener('offline', handleOffline)
		
		return () => {
			window.removeEventListener('online', handleOnline)
			window.removeEventListener('offline', handleOffline)
		}
	}, [])

	const loadCacheStats = async () => {
		try {
			const stats = await assetCache.getCacheStats()
			setCacheStats(prev => ({
				...prev,
				totalSize: stats.totalSize,
				totalItems: stats.totalItems
			}))
		} catch (error) {
			console.warn('Failed to load cache stats:', error)
		}
	}

	const handleClearCache = async () => {
		setIsClearing(true)
		try {
			await assetCache.clearAssetCache()
			setLastCleared(new Date())
			setCacheStats(prev => ({
				...prev,
				totalSize: 0,
				totalItems: 0
			}))
		} catch (error) {
			console.error('Failed to clear cache:', error)
		} finally {
			setIsClearing(false)
		}
	}

	const formatBytes = (bytes: number): string => {
		if (bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	const getButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-red-500 hover:bg-red-600 text-white'
			case 'dark':
				return 'bg-red-600 hover:bg-red-700 text-white'
			default:
				return 'bg-red-500/80 hover:bg-red-600/80 text-white backdrop-blur-sm'
		}
	}

	const getTextColor = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-700'
			case 'dark':
				return 'text-gray-300'
			default:
				return 'text-gray-200'
		}
	}

	const getSecondaryTextColor = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-500'
			case 'dark':
				return 'text-gray-400'
			default:
				return 'text-gray-400'
		}
	}

	const getStatusColor = (isOnline: boolean) => {
		return isOnline ? 'text-green-500' : 'text-orange-500'
	}

	return (
		<SectionPanel title="مدیریت حافظه نهان" size="md">
			<div className="space-y-4">
				{/* Connection Status */}
				<div className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 dark:bg-gray-800/50">
					<div className="flex items-center gap-2">
						{cacheStats.isOnline ? (
							<FiWifi className={getStatusColor(true)} size={18} />
						) : (
							<FiWifiOff className={getStatusColor(false)} size={18} />
						)}
						<span className={`font-medium ${getTextColor()}`}>
							وضعیت اتصال
						</span>
					</div>
					<span className={`${getStatusColor(cacheStats.isOnline)} font-medium`}>
						{cacheStats.isOnline ? 'آنلاین' : 'آفلاین'}
					</span>
				</div>

				{/* Cache Statistics */}
				<div className="grid grid-cols-2 gap-3">
					<div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50 dark:bg-gray-800/50">
						<FiHardDrive className="text-blue-500" size={18} />
						<div>
							<p className={`text-sm font-medium ${getTextColor()}`}>حجم ذخیره</p>
							<p className={`text-xs ${getSecondaryTextColor()}`}>
								{formatBytes(cacheStats.totalSize)}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50 dark:bg-gray-800/50">
						<FiDownload className="text-green-500" size={18} />
						<div>
							<p className={`text-sm font-medium ${getTextColor()}`}>تعداد فایل</p>
							<p className={`text-xs ${getSecondaryTextColor()}`}>
								{cacheStats.totalItems} فایل
							</p>
						</div>
					</div>
				</div>

				{/* Cache Info */}
				<div className={`p-3 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50`}>
					<p className={`text-sm ${getTextColor()} mb-2`}>
						<strong>حافظه نهان چیست؟</strong>
					</p>
					<p className={`text-xs ${getSecondaryTextColor()} leading-relaxed`}>
						تصاویر پس‌زمینه و آیکون‌های بوکمارک‌ها در حافظه محلی ذخیره می‌شوند تا در صورت قطع اینترنت همچنان قابل مشاهده باشند.
					</p>
				</div>

				{/* Clear Cache Button */}
				<div className="flex flex-col gap-2">
					<button
						onClick={handleClearCache}
						disabled={isClearing || cacheStats.totalItems === 0}
						className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getButtonStyle()}`}
					>
						{isClearing ? (
							<>
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
								در حال پاک کردن...
							</>
						) : (
							<>
								<FiTrash2 size={16} />
								پاک کردن حافظه نهان
							</>
						)}
					</button>
					
					{lastCleared && (
						<p className={`text-xs text-center ${getSecondaryTextColor()}`}>
							آخرین بار پاک شده: {lastCleared.toLocaleString('fa-IR')}
						</p>
					)}
					
					{cacheStats.totalItems === 0 && (
						<p className={`text-xs text-center ${getSecondaryTextColor()}`}>
							حافظه نهان خالی است
						</p>
					)}
				</div>
			</div>
		</SectionPanel>
	)
}
