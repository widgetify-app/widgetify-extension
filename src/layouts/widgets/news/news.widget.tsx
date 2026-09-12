import { useEffect, useState } from 'react'
import { getFromStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import { WidgetContainer } from '../widget-container'
import { NewsContainer } from './components/news-container'
import type { WigiNewsSetting } from './rss.interface'
import type { WidgetSize } from '../layout-engine/types'

interface NewsLayoutProps {
	inComboWidget: boolean
	enableBackground?: boolean
	size?: WidgetSize
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

	if (inComboWidget) {
		return (
			<div className="flex flex-col gap-2 mt-1 overflow-y-auto min-h-52 scrollbar-none">
				<NewsContainer
					customFeeds={rssState.customFeeds}
					useDefaultNews={rssState.useDefaultNews}
				/>
			</div>
		)
	}

	return (
		<WidgetContainer
			background={enableBackground}
			className={'flex flex-col  overflow-y-auto scrollbar-none'}
			style={{ scrollbarWidth: 'none' }}
		>
			<NewsContainer
				customFeeds={rssState.customFeeds}
				useDefaultNews={rssState.useDefaultNews}
			/>
		</WidgetContainer>
	)
}
