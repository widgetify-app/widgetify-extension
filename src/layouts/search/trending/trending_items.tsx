import { OfflineIndicator } from '@/components/offline-indicator'
import {
	getCardBackground,
	getWidgetItemBackground,
	useTheme,
} from '@/context/theme.context'
import type { TrendItem } from '@/services/hooks/trends/getTrends'
import { LazyMotion, domAnimation, m } from 'framer-motion'

interface TrendingItemsProps {
	trends: TrendItem[]
	isLoading: boolean
	isCached: boolean
	onTrendClick: (trend: string) => void
}

export const TrendingItems = ({
	trends,
	isLoading,
	isCached,
	onTrendClick,
}: TrendingItemsProps) => {
	if (trends.length === 0 && !isLoading) {
		return null
	}

	return (
		<div className="mb-3">
			{isCached && (
				<OfflineIndicator
					mode="status"
					message="به دلیل مشکل در اتصال، اطلاعات ذخیره شده قبلی نمایش داده می‌شود"
				/>
			)}

			<LazyMotion features={domAnimation}>
				<div className="grid grid-cols-1 gap-1 md:grid-cols-2">
					{isLoading
						? [...Array(6)].map((_, index) => (
								<TrendItemComponent key={`skeleton-${index}`} index={index} isLoading />
							))
						: trends
								.slice(0, 6)
								.map((trend, index) => (
									<TrendItemComponent
										key={trend.title}
										index={index}
										trend={trend}
										onClick={() => onTrendClick(trend.title)}
									/>
								))}
				</div>
			</LazyMotion>
		</div>
	)
}

interface TrendItemProps {
	index: number
	trend?: TrendItem
	isLoading?: boolean
	onClick?: () => void
}

export const TrendItemComponent = ({
	index,
	trend,
	isLoading = false,
	onClick,
}: TrendItemProps) => {
	const { theme } = useTheme()

	if (isLoading) {
		return (
			<m.div
				initial={{ opacity: 0.4 }}
				animate={{ opacity: [0.4, 0.7, 0.4] }}
				transition={{
					duration: 1.5,
					repeat: Number.POSITIVE_INFINITY,
					delay: index * 0.1,
				}}
				className={`flex items-center p-1 rounded-lg ${getCardBackground(theme)} h-6`}
			>
				<div className="w-2 h-2 ml-1 bg-current rounded-full opacity-20"></div>
				<div className="w-full h-3 bg-current rounded opacity-20"></div>
			</m.div>
		)
	}

	return (
		<m.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ delay: index * 0.05 }}
			className={`flex items-center px-1.5 py-1 cursor-pointer transition-colors rounded-lg ${getWidgetItemBackground(theme)} h-6 hover:bg-gray-300/10`}
			onClick={onClick}
		>
			<span className="ml-1 text-xs opacity-60">{index + 1}</span>
			<p className="text-xs font-light truncate">{trend?.title}</p>
		</m.div>
	)
}
