import { useEffect, useState } from 'react'
import { getFromStorage } from '@/common/storage'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import { WidgetTabKeys } from '@/layouts/widgets-settings/constant/tab-keys'
import { WidgetContainer } from '../widget-container'
import { NewsContainer } from './components/news-container'
import { NewsHeader } from './components/news-header'
import type { WigiNewsSetting } from './rss.interface'

interface NewsLayoutProps {
	inComboWidget: boolean
	enableBackground?: boolean
}

export const NewsLayout: React.FC<NewsLayoutProps> = ({
	enableBackground = true,
	inComboWidget,
}) => {
	const [rssState, setRssState] = useState<WigiNewsSetting>({
		customFeeds: [],
		useDefaultNews: true,
		lastFetchedItems: {},
	})

	useEffect(() => {
		async function loadInitialData() {
			const data = await getFromStorage('rssOptions')
			if (data) {
				setRssState({
					customFeeds: data.customFeeds,
					useDefaultNews: data.useDefaultNews,
					lastFetchedItems: {},
				})
			}
		}

		const event = listenEvent(
			'wigiNewsSettingsChanged',
			async (data: WigiNewsSetting) => {
				setRssState(structuredClone(data))
			}
		)

		loadInitialData()
		return () => {
			event()
		}
	}, [])

	return (
		<>
			{inComboWidget ? (
				<div className="flex flex-col gap-2">
					<NewsContainer
						customFeeds={rssState.customFeeds}
						useDefaultNews={rssState.useDefaultNews}
					/>
				</div>
			) : (
				<WidgetContainer
					background={enableBackground}
					className={'flex flex-col gap-1 px-2 py-2 overflow-y-auto'}
					style={{
						scrollbarWidth: 'none',
					}}
				>
					<NewsHeader
						title="ویجی نیوز"
						onSettingsClick={() =>
							callEvent('openWidgetsSettings', {
								tab: WidgetTabKeys.news_settings,
							})
						}
					/>

					<NewsContainer
						customFeeds={rssState.customFeeds}
						useDefaultNews={rssState.useDefaultNews}
					/>
				</WidgetContainer>
			)}
		</>
	)
}
