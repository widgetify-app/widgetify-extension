import { getFromStorage, setToStorage } from '@/common/storage'
import { SectionPanel } from '@/components/section-panel'
import {
	type RecommendedSite,
	type TrendItem,
	useGetTrends,
} from '@/services/hooks/trends/getTrends'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FaChartLine, FaParachuteBox } from 'react-icons/fa6'
import { RecommendedSites } from './recommended_sites'
import { TrendingItems } from './trending_items'

interface TrendingSearchesProps {
	visible: boolean
	onSelectTrend: (trend: string) => void
	onSelectSite?: (url: string) => void
}

export const TrendingSearches = ({ visible, onSelectTrend }: TrendingSearchesProps) => {
	const [trends, setTrends] = useState<TrendItem[]>([])
	const [recommendedSites, setRecommendedSites] = useState<RecommendedSite[]>([])
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

			if (data.recommendedSites?.length) {
				setRecommendedSites(data.recommendedSites)
				setToStorage('recommended_sites', data.recommendedSites)
			}
		}

		if (isError) {
			const fetchDataFromStorage = async () => {
				const storedTrends = await getFromStorage('search_trends')
				if (storedTrends?.length) {
					setTrends(storedTrends)
					setIsCached(true)
				}

				const storedSites = await getFromStorage('recommended_sites')
				if (storedSites?.length) {
					setRecommendedSites(storedSites)
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
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					className={
						'absolute left-0 right-0  w-full mt-1 border shadow-lg rounded-xl overflow-hidden trending-section border-content'
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
						<SectionPanel
							title="ویجی‌باکس"
							size="xs"
							icon={<FaParachuteBox className="w-3 h-3 opacity-50" />}
						>
							<RecommendedSites
								recommendedSites={recommendedSites}
								isLoading={isLoading}
							/>
						</SectionPanel>
					</div>
				</m.div>
			</AnimatePresence>
		</LazyMotion>
	)
}
