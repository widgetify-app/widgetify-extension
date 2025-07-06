import { useRssManager } from '@/hooks/useRssManager'
import { WidgetContainer } from '../widget-container'
import { NewsContainer } from './components/news-container'
import { NewsHeader } from './components/news-header'
import { NewsItem } from './components/news-item'
import { RssFeedManager } from './components/rss-feed-manager'

interface NewsLayoutProps {
	inComboWidget: boolean
	enableBackground?: boolean
}

export const NewsLayout: React.FC<NewsLayoutProps> = ({
	enableBackground = true,

	inComboWidget,
}) => {
	const {
		getItemsToDisplay,
		isLoading,
		isLoadingRss,
		newsData,
		onCloseSettingModal,
		openRssModal,
		rssModalOpen,
		rssState,
	} = useRssManager()

	const openNewsLink = (url: string) => {
		window.open(url, '_blank', 'noopener,noreferrer')
	}

	const displayItems = getItemsToDisplay()
	const isAnyLoading = isLoading || isLoadingRss
	const noItemsToShow = !isAnyLoading && displayItems.length === 0
	return (
		<>
			{inComboWidget ? (
				<div className="flex flex-col gap-2">
					<NewsContainer
						inComboWidget={inComboWidget}
						isLoading={isAnyLoading}
						isEmpty={noItemsToShow}
						noFeedsConfigured={
							!rssState.useDefaultNews && rssState.customFeeds.length === 0
						}
						onAddFeed={() => openRssModal()}
					>
						{' '}
						{displayItems.map((item: any, index: number) => (
							<NewsItem
								key={index}
								title={item.title}
								description={item.description}
								source={item.source}
								publishedAt={item.publishedAt}
								link={'link' in item ? (item.link as string) : undefined}
								index={index}
								onClick={openNewsLink}
							/>
						))}
					</NewsContainer>
				</div>
			) : (
				<>
					<WidgetContainer
						background={enableBackground}
						className={'flex flex-col gap-1 overflow-y-auto'}
						style={{
							scrollbarWidth: 'none',
						}}
					>
						<RssFeedManager
							isOpen={rssModalOpen}
							rssNews={rssState}
							onClose={onCloseSettingModal}
						/>
						<NewsHeader
							title="ویجی نیوز"
							isCached={newsData.isCached}
							useDefaultNews={rssState.useDefaultNews}
							platformName={newsData.platform.name}
							platformUrl={newsData.platform.url}
							onSettingsClick={() => openRssModal()}
						/>

						<NewsContainer
							inComboWidget={inComboWidget}
							isLoading={isAnyLoading}
							isEmpty={noItemsToShow}
							noFeedsConfigured={
								!rssState.useDefaultNews &&
								rssState.customFeeds.length === 0
							}
							onAddFeed={() => openRssModal()}
						>
							{displayItems.map((item: any, index: number) => (
								<NewsItem
									key={index}
									title={item.title}
									description={item.description}
									source={item.source}
									publishedAt={item.publishedAt}
									link={
										'link' in item ? (item.link as string) : undefined
									}
									index={index}
									onClick={openNewsLink}
								/>
							))}
						</NewsContainer>
					</WidgetContainer>
				</>
			)}
		</>
	)
}
