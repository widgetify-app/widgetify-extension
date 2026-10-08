import type { ReactNode } from 'react'
import { PopoverMenuItem } from '@/components/ui'
import { useCurrencyStore } from '@/features/widgets/currency.context'
import { useOptionalFreeWidgets } from '@/features/widgets/widgets.context'
import { Icon } from '@/icons'
import { useRefreshCurrencies } from '@/services/currency/get-currency-by-code.hook'
import type { WidgetSize } from '../utils/layout-engine/types'
import { WidgetContainer } from '../components/widget-container'
import { useWidgetMenuActions, useWidgetSettingsSummary } from '../widget-menu.context'
import type { WigiArzMeta } from './types'
import { ownsCurrencyList } from './utils/owns-currency-list'
import { CurrencyCompactSquare } from './variants/wigi-arz-1x1'
import { WigiArz2x3 } from './variants/wigi-arz-2x3'
import { t } from '@/common/i18n'

interface WigiArzLayoutProps {
	size?: WidgetSize
	instanceId?: string
	meta?: WigiArzMeta
}

export function WigiArzLayout({
	size = { w: 2, h: 3 },
	instanceId,
	meta,
}: WigiArzLayoutProps) {
	const { selectedCurrencies, reorderCurrencies } = useCurrencyStore()
	const freeWidgets = useOptionalFreeWidgets()

	const targetWidget = instanceId
		? freeWidgets?.runtimeLayout.find((w) => w.instanceId === instanceId)
		: null
	const ownsList = ownsCurrencyList(targetWidget)

	const effectiveCurrencies = ownsList
		? Array.isArray(meta?.currencies)
			? meta.currencies
			: Array.isArray(targetWidget?.meta?.currencies)
				? targetWidget.meta.currencies
				: []
		: selectedCurrencies

	const isCompact = size.w === 1 && size.h === 1
	const compactCode =
		meta?.currencyCode || (!instanceId ? selectedCurrencies[0] : undefined)
	useWidgetSettingsSummary(
		isCompact
			? compactCode
				? t('widgets.wigiArz.summary.compact', { code: compactCode })
				: t('widgets.wigiArz.summary.none')
			: effectiveCurrencies.length
				? t('widgets.wigiArz.summary.count', {
						count: effectiveCurrencies.length.toLocaleString('fa-IR'),
					})
				: t('widgets.wigiArz.summary.none')
	)

	const { refresh } = useRefreshCurrencies()
	const hasPrices = isCompact ? Boolean(compactCode) : effectiveCurrencies.length > 0
	useWidgetMenuActions(
		hasPrices && (
			<PopoverMenuItem
				icon={<Icon name="refresh" size={14} />}
				label={t('widgets.wigiArz.refresh')}
				onClick={refresh}
			/>
		)
	)

	const handleReorder = (reordered: string[]) => {
		if (ownsList && instanceId) {
			freeWidgets?.updateWidgetSettings(instanceId, {
				...meta,
				currencies: reordered,
			})
			return
		}

		reorderCurrencies(reordered)
	}

	if (isCompact) {
		return (
			<WidgetContainer contentClassName="px-3 py-2.5">
				<CurrencyCompactSquare
					key={compactCode}
					defaultCode={compactCode}
					instanceId={instanceId}
					meta={meta}
				/>
			</WidgetContainer>
		)
	}

	return (
		<WidgetContainer contentClassName="p-3 gap-2">
			<WigiArz2x3
				currencies={effectiveCurrencies}
				onReorder={handleReorder}
				instanceId={ownsList ? instanceId : undefined}
			/>
		</WidgetContainer>
	)
}

export function WigiArzComboView({ tabs }: { tabs: ReactNode }) {
	const { selectedCurrencies, reorderCurrencies } = useCurrencyStore()

	return (
		<WigiArz2x3
			currencies={selectedCurrencies}
			onReorder={reorderCurrencies}
			tabs={tabs}
		/>
	)
}
