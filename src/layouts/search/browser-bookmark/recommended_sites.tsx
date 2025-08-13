import { domAnimation, LazyMotion, m } from 'framer-motion'
import type { RecommendedSite } from '@/services/hooks/trends/getTrends'

interface RecommendedSitesProps {
	recommendedSites: RecommendedSite[]
	isLoading: boolean
}

export const RecommendedSites = ({
	recommendedSites,
	isLoading,
}: RecommendedSitesProps) => {
	if (recommendedSites.length === 0 && !isLoading) {
		return null
	}

	return (
		<div>
			<LazyMotion features={domAnimation}>
				<div className="flex gap-2 py-1 overflow-x-auto small-scrollbar">
					{isLoading
						? [...Array(6)].map((_, index) => (
								<SiteItemComponent
									key={`skeleton-${index}`}
									index={index}
									isLoading
								/>
							))
						: recommendedSites
								.slice(0, 6)
								.map((site, index) => (
									<SiteItemComponent
										key={site.name}
										index={index}
										site={site}
									/>
								))}
				</div>

				{/* Sub-sites Section */}
				{recommendedSites.some(
					(site) => site.subSites && site.subSites.length > 0
				) && (
					<div className="">
						{recommendedSites
							.filter((site) => site.subSites && site.subSites.length > 0)
							.map((site) => (
								<div key={site.name} className="mb-2">
									<h3
										className={
											'text-xs font-medium mb-1 text-content'
										}
									>
										{site.name}
									</h3>
									<div className="flex gap-2 pb-2 overflow-x-auto small-scrollbar">
										{site.subSites
											?.slice(0, 6)
											.map((subSite, index) => (
												<SiteItemComponent
													key={subSite.name}
													index={index}
													site={subSite}
												/>
											))}
									</div>
								</div>
							))}
					</div>
				)}
			</LazyMotion>
		</div>
	)
}

interface SiteItemProps {
	index: number
	site?: RecommendedSite
	isLoading?: boolean
}

export const SiteItemComponent = ({ index, site, isLoading = false }: SiteItemProps) => {
	function onSiteClick() {
		if (site?.url) {
			window.open(site.url, '_blank', 'noopener,noreferrer')
		}
	}

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
				className={
					'flex-shrink-0 flex flex-row items-center rounded-lg bg-content'
				}
			>
				<div className="w-5 h-5 mb-1 bg-current rounded-full opacity-20"></div>
			</m.div>
		)
	}

	if (!site) return null

	return (
		<div
			className={`flex-shrink-0 flex flex-row items-center cursor-pointer transition-all hover:scale-105 ${
				!site.url ? 'opacity-60 cursor-not-allowed' : ''
			}`}
			onClick={site.url ? onSiteClick : undefined}
		>
			{site.icon && (
				<img
					src={site.icon}
					alt={site.name}
					className="w-5 h-5 mb-1.5 rounded-lg"
				/>
			)}
			{!site.icon && (
				<div className="flex items-center justify-center w-10 h-10 mb-1.5 rounded-lg shadow-sm dark:bg-gray-700">
					<span className="text-sm font-medium">{site.name.charAt(0)}</span>
				</div>
			)}
		</div>
	)
}
