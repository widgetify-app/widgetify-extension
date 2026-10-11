import { t } from '@/common/i18n'
import type { PartnerCatalogItem } from '../types'
import { WidgetContainer } from './widget-container'
import { WidgetHeader } from './widget-header'
import { WidgetIcon } from './widget-icon'

export function PartnerPreview({ item }: { item: PartnerCatalogItem }) {
	return (
		<WidgetContainer contentClassName="p-3 gap-2">
			<WidgetHeader title={item.title} />

			<div className="flex items-center flex-1 min-h-0 gap-2.5 px-3 overflow-hidden select-none rounded-xl bg-fill">
				<span className="flex items-center justify-center shrink-0">
					<WidgetIcon
						definition={{
							id: item.widgetKey,
							icon: 'globe',
							iconUrl: item.iconUrl,
							emoji: item.emoji,
						}}
						size={24}
					/>
				</span>

				<p className="text-2xs leading-relaxed text-fg-muted line-clamp-2">
					{t('widgets.partner.preview.hint')}
				</p>
			</div>
		</WidgetContainer>
	)
}
