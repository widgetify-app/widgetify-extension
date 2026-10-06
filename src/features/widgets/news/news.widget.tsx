import type { ReactNode } from 'react'
import { PopoverMenuItem } from '@/components/ui'
import { Icon } from '@/icons'
import { useRefreshRssFeeds } from '@/services/news/get-news.hook'
import { WidgetContainer } from '../components/widget-container'
import { WidgetHeader } from '../components/widget-header'
import { formatUpdatedAt } from '../utils/updated-at'
import { useWidgetMenuActions, useWidgetSettingsSummary } from '../widget-menu.context'
import { NewsContainer } from './components/news-container'
import { type NewsFeedEntry, useNewsFeeds } from './hooks/use-news-feeds'

export function NewsLayout() {
	const { entries } = useNewsFeeds()
	const { refresh } = useRefreshRssFeeds()

	useWidgetSettingsSummary(
		entries.length
			? `${entries.length.toLocaleString('fa-IR')} منبع روشنه`
			: 'هیچ منبعی روشن نیست'
	)
	useWidgetMenuActions(
		entries.length > 0 && (
			<PopoverMenuItem
				icon={<Icon name="refresh" size={14} />}
				label="به‌روز کن"
				onClick={refresh}
			/>
		)
	)

	return (
		<WidgetContainer contentClassName="p-3 gap-2">
			<NewsView title="اخبار" entries={entries} />
		</WidgetContainer>
	)
}

export function NewsComboView({ tabs }: { tabs: ReactNode }) {
	const { entries } = useNewsFeeds()

	return <NewsView title={tabs} entries={entries} />
}

interface NewsViewProps {
	title: ReactNode
	entries: NewsFeedEntry[]
}

function NewsView({ title, entries }: NewsViewProps) {
	const { isRefreshing } = useRefreshRssFeeds()
	const updatedAt = Math.max(0, ...entries.map((entry) => entry.result.dataUpdatedAt))
	const hasHeadlines = entries.some((entry) => entry.result.data?.length)

	return (
		<>
			<WidgetHeader
				title={title}
				badge={
					isRefreshing &&
					hasHeadlines && (
						<span className="font-medium text-3xs text-fg-faint whitespace-nowrap">
							به‌روز می‌شه…
						</span>
					)
				}
				info={formatUpdatedAt(updatedAt)}
			/>
			<NewsContainer entries={entries} now={Date.now()} />
		</>
	)
}
