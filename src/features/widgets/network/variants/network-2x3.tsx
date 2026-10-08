import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { Button } from '@/components/ui'
import { Icon } from '@/icons'
import {
	WidgetHeader,
	WidgetHeaderButton,
} from '@/features/widgets/components/widget-header'
import { RequireAuth } from '@/features/widgets/components/require-auth'
import { WidgetError } from '@/features/widgets/components/widget-error'
import { CountryFlag, NetworkStatus, PingSignal } from '../components/network-parts'
import { NetworkLoadingSkeleton } from '../components/network-loading-skeleton'
import type { NetworkViewProps } from '../types'
import { cleanIspName } from '../utils/clean-isp-name'
import { copyIpToClipboard } from '../utils/copy-ip'

export function Network2x3({
	info,
	isOnline,
	isAuthenticated,
	isInitialLoading,
	isLoading,
	hasError,
	blurMode,
	onRefresh,
	onRetryOffline,
}: NetworkViewProps) {
	const place = [info.city, info.country].filter(Boolean).join(t('ui.date.headingSep'))

	return (
		<section
			aria-label={t('widgets.network.aria')}
			className="flex flex-col w-full h-full min-h-0 gap-2"
		>
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

			<RequireAuth mode="preview">
				{!isOnline ? (
					<div className="flex flex-col items-center justify-center flex-1 gap-2 px-2.5 text-center">
						<span className="grid mb-0.5 rounded-xl size-11 place-items-center bg-fill text-danger">
							<Icon name="wifiOff" size={20} aria-hidden="true" />
						</span>
						<p className="text-xs font-bold text-fg-strong">
							{t('widgets.network.offlineTitle')}
						</p>
						<p className="leading-relaxed text-2xs text-fg-muted">
							{t('widgets.network.offlineHint')}
						</p>
						<Button
							size="sm"
							color="base"
							rounded="lg"
							className="mt-1"
							onClick={onRetryOffline}
						>
							{t('widgets.network.retryFull')}
						</Button>
					</div>
				) : isInitialLoading ? (
					<NetworkLoadingSkeleton />
				) : hasError ? (
					<WidgetError
						message={t('widgets.network.loadError')}
						onRetry={onRefresh}
					/>
				) : (
					<div className="flex flex-col flex-1 min-h-0">
						<div className="flex items-center gap-2.5 px-1 py-2.5">
							<CountryFlag src={info.countryIcon} />
							<div className="flex flex-col flex-1 min-w-0">
								<span className="text-xs font-semibold truncate text-fg">
									{place || t('widgets.network.placeUnknown')}
								</span>
								<span className="truncate text-3xs text-fg-faint">
									{info.isp
										? cleanIspName(info.isp)
										: t('widgets.network.ispUnknown')}
								</span>
							</div>
						</div>

						<dl className="flex flex-col gap-1 px-1 py-2.5 border-t border-line">
							<dt className="font-semibold text-3xs text-fg-faint">
								{t('widgets.network.ipLabel')}
							</dt>
							<dd className="flex items-center justify-between gap-2">
								<span
									dir="ltr"
									className={cn(
										'font-mono text-sm font-semibold truncate text-fg-strong',
										blurMode ? 'blur-mode' : 'disabled-blur-mode'
									)}
								>
									{info.ip || '—'}
								</span>
								{info.ip && (
									<WidgetHeaderButton
										label={t('widgets.network.copyIp')}
										icon="copy"
										onClick={() => copyIpToClipboard(info.ip)}
									/>
								)}
							</dd>
						</dl>

						<dl className="flex flex-col gap-1 px-1 py-2.5 border-t border-line">
							<dt className="font-semibold text-3xs text-fg-faint">
								{t('widgets.network.ping')}
							</dt>
							<dd className="flex items-center justify-between gap-2">
								<span className="flex items-baseline gap-1">
									<span className="text-2xl font-extrabold leading-none tracking-tight tabular-nums text-fg-strong">
										{info.ping ?? '--'}
									</span>
									<span className="font-medium text-3xs text-fg-faint">
										{t('widgets.network.ms')}
									</span>
								</span>
								<PingSignal ping={info.ping} />
							</dd>
						</dl>
					</div>
				)}
			</RequireAuth>
		</section>
	)
}
