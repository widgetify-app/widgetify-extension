import { useTheme } from '@/context/theme.context'
import type { RecommendedSite } from '@/services/getMethodHooks/trends/getTrends'
import { motion } from 'framer-motion'

interface RecommendedSitesProps {
	recommendedSites: RecommendedSite[]
	isLoading: boolean
}

export const RecommendedSites = ({
	recommendedSites,
	isLoading,
}: RecommendedSitesProps) => {
	const { themeUtils } = useTheme()

	if (recommendedSites.length === 0 && !isLoading) {
		return null
	}

	return (
		<div>
			<div className="flex gap-2 p-3 overflow-x-auto small-scrollbar">
				{isLoading
					? [...Array(6)].map((_, index) => (
							<SiteItemComponent key={`skeleton-${index}`} index={index} isLoading />
						))
					: recommendedSites
							.slice(0, 6)
							.map((site, index) => (
								<SiteItemComponent key={site.name} index={index} site={site} />
							))}
			</div>

			{/* Sub-sites Section */}
			{recommendedSites.some((site) => site.subSites && site.subSites.length > 0) && (
				<div className="mt-2">
					{recommendedSites
						.filter((site) => site.subSites && site.subSites.length > 0)
						.map((site) => (
							<div key={site.name} className="mb-2">
								<h3
									className={`text-xs font-medium mb-1 ${themeUtils.getHeadingTextStyle()}`}
								>
									{site.name}
								</h3>
								<div className="flex gap-2 pb-2 overflow-x-auto small-scrollbar">
									{site.subSites?.slice(0, 6).map((subSite, index) => (
										<SiteItemComponent key={subSite.name} index={index} site={subSite} />
									))}
								</div>
							</div>
						))}
				</div>
			)}
		</div>
	)
}

interface SiteItemProps {
	index: number
	site?: RecommendedSite
	isLoading?: boolean
}

export const SiteItemComponent = ({ index, site, isLoading = false }: SiteItemProps) => {
	const { theme } = useTheme()

	function onSiteClick() {
		if (site?.url) {
			window.open(site.url, '_blank', 'noopener,noreferrer')
		}
	}

	const getSiteItemBackground = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-100 hover:bg-gray-200'
			case 'dark':
				return 'bg-neutral-800 hover:bg-neutral-700/90'
			default:
				return 'bg-neutral-900/70  hover:bg-neutral-800/80'
		}
	}

	const getSkeletonBackground = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-200'
			case 'dark':
				return 'bg-neutral-700/70'
			default:
				return 'bg-neutral-800/50'
		}
	}

	if (isLoading) {
		return (
			<motion.div
				initial={{ opacity: 0.4 }}
				animate={{ opacity: [0.4, 0.7, 0.4] }}
				transition={{
					duration: 1.5,
					repeat: Number.POSITIVE_INFINITY,
					delay: index * 0.1,
				}}
				className={`flex-shrink-0 flex flex-col items-center rounded-lg ${getSkeletonBackground()} w-[80px]`}
			>
				<div className="w-10 h-10 mb-1 bg-current rounded-full opacity-20"></div>
				<div className="w-full h-3 bg-current rounded opacity-20"></div>
			</motion.div>
		)
	}

	if (!site) return null

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ delay: index * 0.05 }}
			className={`flex-shrink-0 flex flex-col items-center p-2 cursor-pointer transition-all rounded-lg ${getSiteItemBackground()} hover:scale-105 w-[80px] ${
				!site.url ? 'opacity-60 cursor-not-allowed' : ''
			}`}
			onClick={site.url ? onSiteClick : undefined}
		>
			{site.icon && (
				<img src={site.icon} alt={site.name} className="w-10 h-10 mb-1.5 rounded-lg" />
			)}
			{!site.icon && (
				<div className="flex items-center justify-center w-10 h-10 mb-1.5 bg-gray-300 rounded-lg shadow-sm dark:bg-gray-700">
					<span className="text-sm font-medium">{site.name.charAt(0)}</span>
				</div>
			)}
			<span className="w-full text-xs font-medium text-center truncate" title={site.name}>
				{site.name}
			</span>
		</motion.div>
	)
}
