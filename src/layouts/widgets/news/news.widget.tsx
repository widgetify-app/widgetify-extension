import type React from 'react'
import { WidgetContainer } from '../widget-container'
import { NewsContainer } from './components/news-container'
import { useNewsSettings } from './hooks/use-news-settings'

interface NewsLayoutProps {
	inComboWidget: boolean
	enableBackground?: boolean
}

export const NewsLayout: React.FC<NewsLayoutProps> = ({
	enableBackground = true,
	inComboWidget,
}) => {
	const { settings } = useNewsSettings()

	if (inComboWidget) {
		return (
			<div className="flex flex-col gap-2 mt-1 overflow-y-auto min-h-52 scrollbar-none">
				<NewsContainer
					customFeeds={settings.customFeeds}
					useDefaultNews={settings.useDefaultNews}
				/>
			</div>
		)
	}

	return (
		<WidgetContainer
			background={enableBackground}
			className="flex flex-col overflow-y-auto scrollbar-none"
			style={{ scrollbarWidth: 'none' }}
		>
			<section aria-label="اخبار" className="flex flex-col h-full">
				<NewsContainer
					customFeeds={settings.customFeeds}
					useDefaultNews={settings.useDefaultNews}
				/>
			</section>
		</WidgetContainer>
	)
}
