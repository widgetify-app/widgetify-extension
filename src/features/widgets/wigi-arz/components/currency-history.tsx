import { useMemo } from 'react'
import { type MessageKey, t } from '@/common/i18n'
import { Icon } from '@/icons'
import { Button, TabNavigation } from '@/components/ui'
import { callEvent } from '@/common/utils/call-event'
import { useAuth } from '@/context/auth.context'
import type { FetchedCurrency } from '@/services/currency/get-currency-by-code.hook'
import {
	CURRENCY_HISTORY_RANGES,
	type CurrencyHistoryRange,
	isHistoryLocked,
	useGetCurrencyHistory,
} from '@/services/currency/get-currency-history.hook'
import { buildPriceChart } from '../utils/build-price-chart'
import { getPrice } from '../utils/get-price'
import { PriceChart } from './price-chart'

interface CurrencyHistoryProps {
	code: string
	currency: FetchedCurrency
	enabled: boolean
	range: CurrencyHistoryRange
	onLeave: () => void
}

export const DEFAULT_HISTORY_RANGE: CurrencyHistoryRange = '7d'

const RANGE_LABEL_KEYS: Record<CurrencyHistoryRange, MessageKey> = {
	'24h': 'widgets.wigiArz.chart.range.24h',
	'7d': 'widgets.wigiArz.chart.range.7d',
	'30d': 'widgets.wigiArz.chart.range.30d',
}

interface HistoryRangeTabsProps {
	range: CurrencyHistoryRange
	onChange: (range: CurrencyHistoryRange) => void
}

export function HistoryRangeTabs({ range, onChange }: HistoryRangeTabsProps) {
	return (
		<TabNavigation
			tabMode="simple"
			size="sm"
			activeTab={range}
			onTabClick={onChange}
			tabs={CURRENCY_HISTORY_RANGES.map((id) => ({
				id,
				label: t(RANGE_LABEL_KEYS[id]),
			}))}
		/>
	)
}

export function CurrencyHistory({
	code,
	currency,
	enabled,
	range,
	onLeave,
}: CurrencyHistoryProps) {
	const { isAuthenticated, isVip } = useAuth()
	const { data, error, isPending, isError, refetch } = useGetCurrencyHistory(
		code,
		range,
		enabled && isVip
	)
	const isDollar = getPrice(code, currency).isDollar
	const chart = useMemo(
		() => (data ? buildPriceChart(data, isDollar) : null),
		[data, isDollar]
	)

	if (!isVip || isHistoryLocked(error)) {
		const openAccount = () => {
			onLeave()
			if (isAuthenticated) callEvent('openSettings', 'vip')
			else callEvent('openProfile')
		}

		return (
			<div className="flex flex-col items-center gap-3 px-5 py-4 text-center">
				<span
					aria-hidden="true"
					className="grid size-12 place-items-center rounded-2xl bg-vip text-on-vip shadow-sm shadow-vip-fill-2"
				>
					<Icon name="diamond" size={20} />
				</span>
				<div className="space-y-1">
					<p className="text-sm font-semibold text-fg">
						{t('widgets.wigiArz.chart.proTitle')}
					</p>
					<p className="text-xs text-fg-muted">
						{t('widgets.wigiArz.chart.proDescription')}
					</p>
				</div>
				<Button size="sm" color="vip" onClick={openAccount}>
					{isAuthenticated
						? t('widgets.wigiArz.chart.proAction')
						: t('widgets.wigiArz.chart.loginAction')}
				</Button>
			</div>
		)
	}

	return (
		<div className="flex items-center justify-center w-full min-h-38">
			{isPending && enabled ? (
				<span
					aria-hidden="true"
					className="block h-33 mx-5 grow rounded-2xl skeleton"
				/>
			) : isError ? (
				<div className="flex flex-col items-center gap-2 text-xs text-fg-muted">
					<p>{t('widgets.wigiArz.chart.loadError')}</p>
					<button
						type="button"
						onClick={() => refetch()}
						className="cursor-pointer text-brand hover:text-brand-hover focus-visible:focus-ring"
					>
						{t('widgets.wigiArz.retry')}
					</button>
				</div>
			) : chart ? (
				<PriceChart
					key={range}
					chart={chart}
					name={currency.name.fa}
					showTime={range === '24h'}
				/>
			) : (
				<p className="px-5 text-xs text-center text-fg-faint">
					{t('widgets.wigiArz.chart.empty')}
				</p>
			)}
		</div>
	)
}
