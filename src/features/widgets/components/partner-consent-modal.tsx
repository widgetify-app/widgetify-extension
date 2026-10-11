import { useRef } from 'react'
import { t } from '@/common/i18n'
import { Button, Modal } from '@/components/ui'
import { Icon, type IconName } from '@/icons'
import type { PartnerCatalogItem } from '../types'
import { consentLines } from '../utils/partner-catalog/partner-access'
import { WidgetIcon } from './widget-icon'

const LINE_ICONS: Record<string, IconName> = {
	'widgets.partner.consent.scope.profile': 'user',
	'widgets.partner.consent.scope.account': 'userCheck',
	'widgets.partner.consent.scope.phone': 'phone',
	'widgets.partner.consent.scope.email': 'mail',
}

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

					<div className="flex items-center gap-2.5">
						<span className="flex items-center justify-center rounded-xl size-10 shrink-0 bg-brand-fill text-brand">
							<WidgetIcon
								definition={{
									id: shown.widgetKey,
									icon: 'globe',
									iconUrl: shown.iconUrl,
									emoji: '',
								}}
								size={24}
							/>
						</span>

						<p className="text-sm font-bold text-fg-strong">{shown.title}</p>
					</div>

					<section className="flex flex-col gap-2">
						<h3 className="text-2xs font-bold text-fg-muted">
							{t('widgets.partner.consentModal.listTitle')}
						</h3>

						<ul className="flex flex-col gap-2">
							{consentLines(shown.scopes, shown.contactRequirement).map(
								(line) => (
									<li
										key={line}
										className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium rounded-xl bg-fill text-fg"
									>
										<span className="flex items-center justify-center rounded-lg size-7 shrink-0 bg-brand-fill text-brand">
											<Icon
												name={LINE_ICONS[line] ?? 'globe'}
												size={16}
											/>
										</span>
										{t(line)}
									</li>
								)
							)}
						</ul>
					</section>

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
