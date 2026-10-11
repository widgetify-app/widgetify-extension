import { useRef } from 'react'
import { t } from '@/common/i18n'
import { Button, Modal } from '@/components/ui'
import type { PartnerCatalogItem } from '../types'
import { consentLines } from '../utils/partner-catalog/partner-access'

interface Prop {
	item: PartnerCatalogItem | null
	onResolve: (accepted: boolean) => void
}

export function PartnerConsentModal({ item, onResolve }: Prop) {
	const lastItem = useRef(item)

	if (item) lastItem.current = item

	const shown = item ?? lastItem.current

	return (
		<Modal
			isOpen={Boolean(item)}
			onClose={() => onResolve(false)}
			title={t('widgets.partner.consentModal.title')}
			closeLabel={t('ui.common.close')}
		>
			{shown && (
				<section className="flex flex-col gap-4">
					<p className="text-xs leading-relaxed text-fg-muted">
						{t('widgets.partner.consentModal.body')}
					</p>

					<p className="text-sm font-semibold text-fg">
						{shown.emoji} {shown.title}
					</p>

					<ul className="flex flex-col gap-2 text-xs">
						{consentLines(shown.scopes, shown.contactRequirement).map(
							(line) => (
								<li
									key={line}
									className="px-3 py-2 rounded-lg bg-fill text-fg-muted"
								>
									{t(line)}
								</li>
							)
						)}
					</ul>

					<div className="flex gap-2">
						<Button
							type="button"
							color="brand"
							size="sm"
							rounded="xl"
							className="flex-1"
							onClick={() => onResolve(true)}
						>
							{t('widgets.partner.consentModal.confirm')}
						</Button>

						<Button
							type="button"
							size="sm"
							rounded="xl"
							className="flex-1"
							onClick={() => onResolve(false)}
						>
							{t('widgets.partner.consentModal.cancel')}
						</Button>
					</div>
				</section>
			)}
		</Modal>
	)
}
