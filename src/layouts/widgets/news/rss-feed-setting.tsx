import { useState } from 'react'
import { cn } from '@/common/utils/cn'
import { SectionPanel, ToggleSwitch } from '@/components/ui'
import { Icon } from '@/icons'
import { WidgetSettingWrapper } from '@/layouts/widgets-settings/widget-settings-wrapper'
import { useGetAvailableRssFeeds } from '@/services/hooks/news/get-rss-feeds.hook'
import { useNewsSettings } from './hooks/use-news-settings'

function extractHostname(rawUrl: string): string {
	try {
		return new URL(rawUrl).hostname.replace(/^www\./, '')
	} catch {
		return rawUrl
	}
}

const CATEGORIES = [
	{ id: 'all', name: 'همه' },
	{ id: 'فناوری', name: 'فناوری' },
	{ id: 'اقتصاد', name: 'اقتصاد' },
	{ id: 'ورزش', name: 'ورزش' },
	{ id: 'عمومی', name: 'عمومی' },
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
				<SectionPanel title="تنظیمات کلی" size="xs">
					<div
						onClick={toggleDefaultNews}
						className="flex items-center justify-between p-3 transition-colors rounded-xl border border-base-content/10 bg-base-200/40 hover:bg-base-200/70 cursor-pointer select-none"
					>
						<div className="space-y-0.5">
							<h4 className="text-xs font-medium text-content">
								اخبار پیش‌فرض
							</h4>
							<p className="text-[11px] text-muted">
								نمایش تیترهای روز از خبرگزاری‌های معتبر
							</p>
						</div>
						<div className="shrink-0" onClick={(e) => e.stopPropagation()}>
							<ToggleSwitch
								enabled={settings.useDefaultNews}
								onToggle={toggleDefaultNews}
							/>
						</div>
					</div>
				</SectionPanel>

				<SectionPanel title="منابع خبری" size="xs">
					<div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-0.5 scrollbar-none">
						{CATEGORIES.map((cat) => (
							<button
								key={cat.id}
								type="button"
								onClick={() => setActiveCategory(cat.id)}
								className={cn(
									'px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer shrink-0',
									activeCategory === cat.id
										? 'bg-primary text-primary-content font-medium'
										: 'bg-base-200/60 text-muted hover:bg-base-200 hover:text-content'
								)}
							>
								{cat.name}
							</button>
						))}
					</div>

					<div className="space-y-1.5 max-h-72 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-base-content/10">
						{filteredFeeds.map((feed) => {
							const isActive = isFeedActive(feed.url)
							return (
								<div
									key={feed.url}
									onClick={() => toggleFeed(feed)}
									className={cn(
										'flex items-center justify-between p-2.5 transition-colors rounded-xl border cursor-pointer select-none',
										isActive
											? 'border-primary/30 bg-primary/5 hover:bg-primary/10'
											: 'border-base-content/10 bg-base-200/40 hover:bg-base-200/70'
									)}
								>
									<div className="flex items-center gap-2.5 min-w-0">
										<div
											className={cn(
												'flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-colors',
												isActive
													? 'bg-primary/20 text-primary'
													: 'bg-base-300/60 text-muted'
											)}
										>
											<Icon name="outlineNewspaper" size={15} />
										</div>
										<div className="space-y-0.5 min-w-0">
											<h4 className="text-xs font-medium text-content truncate">
												{feed.name}
											</h4>
											<p className="text-[10px] text-muted truncate">
												{extractHostname(feed.url)}
											</p>
										</div>
									</div>
									<div
										className="shrink-0"
										onClick={(e) => e.stopPropagation()}
									>
										<ToggleSwitch
											enabled={isActive}
											onToggle={() => toggleFeed(feed)}
										/>
									</div>
								</div>
							)
						})}
					</div>
				</SectionPanel>
			</div>
		</WidgetSettingWrapper>
	)
}
