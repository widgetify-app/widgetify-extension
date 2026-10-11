import { useSyncExternalStore } from 'react'
import { t } from '@/common/i18n'
import { Spinner } from '@/components/ui'
import { WidgetContainer } from './widget-container'
import { WidgetEmpty } from './widget-empty'
import { WidgetHeader } from './widget-header'
import { useFreeWidgetActions } from '@/features/widgets/widgets.context'
import { partnerCatalogStore } from '../utils/partner-catalog/partner-catalog-store'

export function WidgetUnavailable({ instanceId }: { instanceId: string }) {
	const { removeWidget } = useFreeWidgetActions()

	const ready = useSyncExternalStore(
		partnerCatalogStore.subscribe,
		() => partnerCatalogStore.get().ready
	)

	if (!ready) {
		return (
			<div className="flex items-center justify-center w-full h-full">
				<Spinner size="sm" aria-hidden="true" />
			</div>
		)
	}

	return (
		<WidgetEmpty
			art="unavailable"
			title={t('widgets.partner.unavailable.title')}
			description={t('widgets.partner.unavailable.body')}
			action={{
				label: t('widgets.partner.unavailable.remove'),
				onClick: () => removeWidget(instanceId),
			}}
		/>
	)
}

export function WidgetUnavailableTile({ instanceId }: { instanceId: string }) {
	return (
		<WidgetContainer contentClassName="p-3 gap-2">
			<WidgetHeader title={t('widgets.registry.unavailable.label')} />

			<div className="flex-1 min-h-0">
				<WidgetUnavailable instanceId={instanceId} />
			</div>
		</WidgetContainer>
	)
}
