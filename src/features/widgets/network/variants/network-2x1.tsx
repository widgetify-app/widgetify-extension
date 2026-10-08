import { t } from '@/common/i18n'
import { callEvent } from '@/common/utils/call-event'
import { cn } from '@/common/utils/cn'
import { WidgetCompactEmpty } from '@/features/widgets/components/widget-compact-empty'
import { WidgetError } from '@/features/widgets/components/widget-error'
import {
	WidgetHeader,
	WidgetHeaderButton,
} from '@/features/widgets/components/widget-header'
import { CountryFlag, NetworkStatus } from '../components/network-parts'
import type { NetworkViewProps } from '../types'
import { copyIpToClipboard } from '../utils/copy-ip'
import { getPingLabel, getPingTextClass } from '../utils/ping-quality'
import { getPlaceLabel } from '../utils/place-label'

export function NetworkCompactRow(props: NetworkViewProps) {
	const { isOnline, isAuthenticated, isLoading, onRefresh } = props

	return (
		<>
			<WidgetHeader
				title={t('widgets.network.title')}
				info={<NetworkStatus isOnline={isOnline} />}
				actions={
					isAuthenticated &&
					isOnline && (
						<WidgetHeaderButton
							label={t('widgets.network.refresh')}
							icon="refresh"
							onClick={onRefresh}
							disabled={isLoading}
						/>
					)
				}
			/>
			<div className="flex-1 min-h-0">
				<NetworkRowBody {...props} />
			</div>
		</>
	)
}

function NetworkRowBody({
	info,
	isOnline,
	isAuthenticated,
	isLoading,
	hasError,
	blurMode,
	onRefresh,
	onRetryOffline,
}: NetworkViewProps) {
	if (!isAuthenticated) {
		return (
			<WidgetCompactEmpty
				icon="wifi"
				title={t('widgets.network.authTitle')}
				description={t('widgets.network.authDescription')}
				action={{
					label: t('widgets.network.login'),
					onClick: () => callEvent('openProfile'),
				}}
			/>
		)
	}

	if (!isOnline) {
		return (
			<WidgetCompactEmpty
				icon="wifiOff"
				title={t('widgets.network.offlineTitle')}
				description={t('widgets.network.offlineDescription')}
				action={{ label: t('widgets.network.retry'), onClick: onRetryOffline }}
			/>
		)
	}

	if (isLoading) {
		return (
			<div aria-hidden="true" className="flex items-center h-full gap-2.5 px-1">
				<div className="flex-none rounded-full size-6.5 skeleton" />
				<div className="flex flex-col flex-1 gap-1.5">
					<div className="w-24 h-3 rounded-sm skeleton" />
					<div className="w-20 h-2.5 rounded-sm skeleton" />
				</div>
				<div className="w-10 h-6 rounded-sm skeleton" />
			</div>
		)
	}

	if (hasError) {
		return (
			<WidgetError
				message={t('widgets.network.loadError')}
				compact
				onRetry={onRefresh}
			/>
		)
	}

	return (
		<div className="flex items-center h-full min-w-0 gap-2.5 px-1 select-none">
			<CountryFlag src={info.countryIcon} />
			<div className="flex flex-col flex-1 min-w-0">
				<span className="text-xs font-semibold truncate text-fg">
					{getPlaceLabel(info.city, info.isp) ||
						t('widgets.network.placeUnknown')}
				</span>
				<button
					type="button"
					onClick={() => copyIpToClipboard(info.ip)}
					disabled={!info.ip}
					aria-label={
						info.ip
							? t('widgets.network.copyIpValue', { ip: info.ip })
							: t('widgets.network.noIp')
					}
					dir="ltr"
					className={cn(
						'font-mono truncate text-3xs text-end text-fg-faint rounded-sm transition-ui focus-visible:focus-ring',
						info.ip ? 'cursor-pointer hover:text-brand' : 'cursor-default',
						blurMode ? 'blur-mode' : 'disabled-blur-mode'
					)}
				>
					{info.ip || '—'}
				</button>
			</div>
			<span className="flex flex-col items-end flex-none gap-0.5">
				<span className="flex items-baseline gap-0.5">
					<span className="text-[30cqh] font-extrabold leading-none tracking-tight tabular-nums text-fg-strong">
						{info.ping ?? '--'}
					</span>
					<span className="font-medium text-3xs text-fg-faint">ms</span>
				</span>
				<span
					className={cn(
						'font-semibold leading-tight text-3xs',
						getPingTextClass(info.ping)
					)}
				>
					{getPingLabel(info.ping)}
				</span>
			</span>
		</div>
	)
}
