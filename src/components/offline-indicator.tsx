import { useTheme } from '@/context/theme.context'
import { motion } from 'framer-motion'
import { TbCloudOff } from 'react-icons/tb'

type OfflineIndicatorMode = 'badge' | 'status' | 'notification'

interface OfflineIndicatorProps {
	mode: OfflineIndicatorMode
	message?: string
}

export const OfflineIndicator = ({ mode, message }: OfflineIndicatorProps) => {
	const { theme } = useTheme()

	const getStylesByTheme = () => {
		switch (theme) {
			case 'light':
				return 'bg-amber-100 text-amber-800 border-amber-200'
			case 'dark':
				return 'bg-amber-900/30 text-amber-300 border-amber-700/50'
			default:
				return 'bg-amber-500/10 text-amber-300 border-amber-500/20 backdrop-blur-sm'
		}
	}

	if (mode === 'badge') {
		return (
			<div className="absolute flex items-center justify-center w-5 h-5 border-2 border-white rounded-full -top-2 -right-2 bg-amber-500">
				<TbCloudOff className="text-xs text-white" />
			</div>
		)
	}

	if (mode === 'status') {
		return (
			<motion.div
				className={`text-xs mt-1 py-0.5 px-2 rounded border ${getStylesByTheme()} inline-flex items-center gap-1`}
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
			>
				<TbCloudOff className="text-xs" />
				<span className="font-light">{message || 'حالت آفلاین'}</span>
			</motion.div>
		)
	}

	return (
		<motion.div
			className={`p-3 rounded-lg border text-sm ${getStylesByTheme()} flex items-center gap-2`}
			initial={{ opacity: 0, y: 5 }}
			animate={{ opacity: 1, y: 0 }}
		>
			<TbCloudOff className="flex-shrink-0 text-lg" />
			<p>
				{message ||
					'اطلاعات کاربری از حافظه محلی بارگذاری شده‌اند. اتصال اینترنت خود را بررسی کنید.'}
			</p>
		</motion.div>
	)
}
