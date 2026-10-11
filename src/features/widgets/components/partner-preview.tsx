import { t } from '@/common/i18n'
import type { PartnerCatalogItem } from '../types'

export function PartnerPreview({ item }: { item: PartnerCatalogItem }) {
	return (
		<div className="flex flex-col items-center justify-center w-full h-full gap-1.5 px-4 text-center select-none">
			<span className="text-4xl" aria-hidden="true">
				{item.emoji}
			</span>

			<p className="text-sm font-bold text-fg-strong">{item.title}</p>

			<p className="text-2xs leading-relaxed text-fg-muted">
				{t('widgets.partner.preview.hint')}
			</p>
		</div>
	)
}
