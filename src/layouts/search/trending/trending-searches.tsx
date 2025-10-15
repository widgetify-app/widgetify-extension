import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FaChartLine } from 'react-icons/fa6'
import { getFromStorage, setToStorage } from '@/common/storage'
import { SectionPanel } from '@/components/section-panel'
import { type TrendItem, useGetTrends } from '@/services/hooks/trends/getTrends'
import { TrendingItems } from './trending_items'

interface TrendingSearchesProps {
	visible: boolean
	onSelectTrend: (trend: string) => void
	onSelectSite?: (url: string) => void
}

export const TrendingSearches = ({ visible, onSelectTrend }: TrendingSearchesProps) => {
	const [trends, setTrends] = useState<TrendItem[]>([])
	const [isCached, setIsCached] = useState(false)

	const { data, isError, isLoading } = useGetTrends({
		enabled: visible,
	})

	useEffect(() => {
		if (data) {
			if (data.trends?.length) {
				setTrends(data.trends)
				setIsCached(false)
				setToStorage('search_trends', data.trends)
			}
		}

		if (isError) {
			const fetchDataFromStorage = async () => {
				const storedTrends = await getFromStorage('search_trends')
				if (storedTrends?.length) {
					setTrends(storedTrends)
					setIsCached(true)
				}
			}

			fetchDataFromStorage()
		}
	}, [data, isError])

	if (!visible) return null

	return (
		<LazyMotion features={domAnimation}>
			<AnimatePresence>
				<m.div
					initial={{ opacity: 0, y: -30 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -30 }}
					className={
						'left-0 right-0 overflow-hidden absolute w-full h-40 shadow-2xl bg-widget widget-wrapper rounded-2xl top-14'
					}
					style={{
						zIndex: 9999,
					}}
				>
					<div className="p-2">
						<SectionPanel
							title="ترندهای امروز"
							icon={<FaChartLine className="w-3 h-3 opacity-50" />}
							size="xs"
						>
							<TrendingItems
								trends={trends}
								isLoading={isLoading}
								isCached={isCached}
								onTrendClick={onSelectTrend}
							/>
						</SectionPanel>
					</div>
				</m.div>
			</AnimatePresence>
		</LazyMotion>
	)
}
