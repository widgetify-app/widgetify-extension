import { OfflineIndicator } from '@/components/offline-indicator'
import { useTheme } from '@/context/theme.context'
import { motion } from 'framer-motion'
import { FaGear, FaRss } from 'react-icons/fa6'

interface NewsHeaderProps {
	title: string
	isCached?: boolean
	useDefaultNews: boolean
	platformName?: string
	platformUrl?: string
	onSettingsClick: () => void
}

export const NewsHeader = ({
	title,
	isCached,
	useDefaultNews,
	platformName,
	platformUrl,
	onSettingsClick,
}: NewsHeaderProps) => {
	const { themeUtils } = useTheme()

	return (
		<div
			className={`top-0 z-20 flex items-center justify-between w-full pb-2 mb-2 border-b ${themeUtils.getBorderColor()}`}
		>
			<div className="flex flex-col">
				<div className="flex items-center gap-2">
					<FaRss className="w-4 h-4 opacity-70" />
					<p className="text-lg font-bold">{title}</p>
				</div>

				{isCached && useDefaultNews ? (
					<OfflineIndicator
						mode="status"
						message="به دلیل مشکل در اتصال، اطلاعات ذخیره شده قبلی نمایش داده می‌شود"
					/>
				) : platformName && useDefaultNews ? (
					<a
						href={platformUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center mt-1 text-xs transition-colors opacity-70 hover:opacity-100 hover:text-primary"
					>
						<span>قدرت گرفته از</span>
						<span className="mr-1 font-semibold">{platformName}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-3 h-3 mr-1"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M7 7h10v10" />
							<path d="M7 17 17 7" />
						</svg>
					</a>
				) : null}

				<div className="flex items-center mt-1 mr-2 text-xs">
					<span className="font-light opacity-70">
						{useDefaultNews ? '' : 'اخباری لحظه‌ای از منابع شما'}
					</span>
				</div>
			</div>

			<motion.button
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.9 }}
				className="p-1 rounded-full cursor-pointer hover:bg-gray-500/10"
				onClick={onSettingsClick}
			>
				<FaGear className="w-5 h-5 opacity-70 hover:opacity-100" />
			</motion.button>
		</div>
	)
}
