import { useState } from 'react'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { SectionPanel, ToggleSwitch } from '@/components/ui'
import { Icon } from '@/icons'
import { WidgetSettingWrapper } from '@/features/widgets/components/widget-settings-wrapper'
import { useGetAvailableRssFeeds } from '@/services/news/get-rss-feeds.hook'
import { useNewsSettings } from './hooks/use-news-settings'

function extractHostname(rawUrl: string): string {
	try {
		return new URL(rawUrl).hostname.replace(/^www\./, '')
	} catch {
		return rawUrl
	}
}

const CATEGORIES = [
	{ id: 'all', name: t('widgets.news.category.all') },
	{ id: t('news.category.tech'), name: t('news.category.tech') },
	{ id: t('news.category.economy'), name: t('news.category.economy') },
	{ id: t('news.category.sport'), name: t('news.category.sport') },
	{ id: t('news.category.general'), name: t('news.category.general') },
]

export const RssFeedSetting = () => {
	const { data: availableFeeds = [] } = useGetAvailableRssFeeds()
	const { settings, toggleDefaultNews, toggleFeed, isFeedActive } = useNewsSettings()
	const [activeCategory, setActiveCategory] = useState<string>('all')

	const filteredFeeds = availableFeeds.filter(
		(feed) => activeCategory === 'all' || feed.category === activeCategory
	)

	return (
		<WidgetSettingWrapper>
			<div className="space-y-3">
				<SectionPanel title={t('widgets.news.setting.general')} size="xs">
					<label className="flex items-center justify-between p-3 transition-ui rounded-2xl border border-surface-3 bg-surface-2 hover:bg-surface-3 cursor-pointer select-none">
						<div className="space-y-0.5">
							<h4 className="text-xs font-medium text-fg">
								{t('widgets.news.setting.defaultTitle')}
							</h4>
							<p className="text-2xs text-fg-muted">
								{t('widgets.news.setting.defaultDesc')}
							</p>
						</div>
						<div className="shrink-0">
							<ToggleSwitch
								label={t('widgets.news.setting.defaultTitle')}
								enabled={settings.useDefaultNews}
								onToggle={toggleDefaultNews}
							/>
						</div>
					</label>
				</SectionPanel>

				<SectionPanel title={t('widgets.news.setting.sources')} size="xs">
					<div className="flex items-center gap-1 mb-2 overflow-x-auto pb-0.5 scrollbar-none">
						{CATEGORIES.map((cat) => (
							<button
								key={cat.id}
								type="button"
								onClick={() => setActiveCategory(cat.id)}
								className={cn(
									'px-2.5 py-1 text-xs rounded-xl transition-ui cursor-pointer shrink-0',
									activeCategory === cat.id
										? 'bg-brand text-on-brand font-medium'
										: 'bg-fill text-fg-muted hover:bg-surface-2 hover:text-fg'
								)}
							>
								{cat.name}
							</button>
						))}
					</div>

					<div className="space-y-1.5 max-h-72 overflow-y-auto pr-0.5">
						{filteredFeeds.map((feed) => {
							const isActive = isFeedActive(feed.url)
							return (
								<label
									key={feed.url}
									className={cn(
										'flex items-center justify-between p-2.5 transition-ui rounded-2xl border cursor-pointer select-none',
										isActive
											? 'border-brand-fill-2 bg-brand-fill hover:bg-brand-fill-2'
											: 'border-surface-3 bg-surface-2 hover:bg-surface-3'
									)}
								>
									<div className="flex items-center gap-2.5 min-w-0">
										<div
											className={cn(
												'flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-ui',
												isActive
													? 'bg-brand-fill-2 text-brand'
													: 'bg-fill-2 text-fg-muted'
											)}
										>
											<Icon name="outlineNewspaper" size={16} />
										</div>
										<div className="space-y-0.5 min-w-0">
											<h4 className="text-xs font-medium text-fg truncate">
												{feed.name}
											</h4>
											<p className="text-3xs text-fg-muted truncate">
												{extractHostname(feed.url)}
											</p>
										</div>
									</div>
									<div className="shrink-0">
										<ToggleSwitch
											label={feed.name}
											enabled={isActive}
											onToggle={() => toggleFeed(feed)}
										/>
									</div>
								</label>
							)
						})}
					</div>
				</SectionPanel>
			</div>
		</WidgetSettingWrapper>
	)
}
