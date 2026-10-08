import type { ReactNode } from 'react'
import { t } from '@/common/i18n'
import { callEvent } from '@/common/utils/call-event'
import {
	WidgetHeader,
	WidgetHeaderButton,
} from '@/features/widgets/components/widget-header'
import { WidgetTabKeys } from '@/features/widgets/types'
import { formatUpdatedAt } from '@/features/widgets/utils/updated-at'
import {
	useCurrenciesUpdatedAt,
	useRefreshCurrencies,
} from '@/services/currency/get-currency-by-code.hook'
import { CurrencyEmpty } from '../components/currency-empty'
import { CurrencyList } from '../components/currency-list'

interface WigiArz2x3Props {
	currencies: string[]
	onReorder: (currencies: string[]) => void
	instanceId?: string
	tabs?: ReactNode
}

export function WigiArz2x3({ currencies, onReorder, instanceId, tabs }: WigiArz2x3Props) {
	const updatedAt = useCurrenciesUpdatedAt(currencies)
	const { isRefreshing } = useRefreshCurrencies()

	return (
		<>
			<WidgetHeader
				title={tabs ?? t('widgets.wigiArz.title')}
				badge={
					isRefreshing &&
					updatedAt > 0 && (
						<span className="font-medium text-3xs text-fg-faint whitespace-nowrap">
							{t('widgets.wigiArz.updating')}
						</span>
					)
				}
				info={formatUpdatedAt(updatedAt)}
				actions={
					!tabs && (
						<WidgetHeaderButton
							label={t('widgets.wigiArz.add')}
							icon="plus"
							onClick={() =>
								callEvent('openWidgetsSettings', {
									tab: WidgetTabKeys.wigiArz,
									instanceId,
								})
							}
						/>
					)
				}
			/>

			{currencies.length === 0 ? (
				<CurrencyEmpty instanceId={instanceId} />
			) : (
				<CurrencyList
					currencies={currencies}
					onReorder={onReorder}
					className="flex flex-col flex-1 min-h-0 gap-0.5 overflow-x-hidden overflow-y-auto -ms-2.5 ps-2.5 scrollbar-none"
				/>
			)}
		</>
	)
}
