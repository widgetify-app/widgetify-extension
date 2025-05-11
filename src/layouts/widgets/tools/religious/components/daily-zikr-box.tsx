import {
	getBorderColor,
	getTextColor,
	getWidgetItemBackground,
	useTheme,
} from '@/context/theme.context'
import { LazyMotion, domAnimation, m } from 'framer-motion'

interface DailyZikrBoxProps {
	zikr?: string
	meaning?: string
	isLoading?: boolean
	delay?: number
}

export const DailyZikrBox = ({
	zikr,
	meaning,
	isLoading = false,
	delay = 0.3,
}: DailyZikrBoxProps) => {
	const { theme } = useTheme()

	return (
		<LazyMotion features={domAnimation}>
			<m.div
				className={`${getWidgetItemBackground(theme)} ${getBorderColor(theme)} border rounded-lg p-0.5`}
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay }}
			>
				<div className={`${getTextColor(theme)} text-center mt-2`}>
					{isLoading ? (
						<>
							<div className="w-40 h-5 mx-auto mb-1 bg-current rounded opacity-30 animate-pulse" />
							<div className="w-32 h-4 mx-auto mb-1 text-xs bg-current rounded opacity-20 animate-pulse" />
						</>
					) : (
						<>
							<div className="mb-1 text-sm font-medium w-52">{zikr}</div>
							<div className="text-xs truncate opacity-75 w-52">{meaning}</div>
						</>
					)}
				</div>
			</m.div>
		</LazyMotion>
	)
}
