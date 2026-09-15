import type { AxiosError } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { cn } from '@/common/utils/cn'
import { RequireAuth } from '@/components/auth/require-auth'
import { AvatarComponent, Button, Tooltip } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { Icon } from '@/icons'
import { getMainClient, safeAwait } from '@/services/api'
import type { WidgetSize } from '../layout-engine/types'
import { WidgetContainer } from '../widget-container'
import {
	NetworkError,
	NetworkIPCard,
	NetworkLoadingSkeleton,
	NetworkPingCard,
} from './components'
import { NetworkCompactSquare } from './variants/network-1x1'
import { NetworkCompactRow } from './variants/network-2x1'

interface NetworkInfo {
	ip: string | null
	country: string | null
	countryIcon: string | null
	city: string | null
	isp: string | null
	ping: number | null
}

const EMPTY_NETWORK_INFO: NetworkInfo = {
	ip: null,
	country: null,
	countryIcon: null,
	city: null,
	isp: null,
	ping: null,
}

enum NetworkLoadingState {
	IDLE = 'IDLE',
	INITIAL = 'INITIAL',
	REFRESHING = 'REFRESHING',
}

interface Prop {
	size?: WidgetSize
}

export function NetworkLayout({ size = { w: 2, h: 3 } }: Prop) {
	const { blurMode } = useGeneralSetting()
	const { isAuthenticated } = useAuth()

	const [isOnline, setIsOnline] = useState(() => navigator.onLine)
	const [networkInfo, setNetworkInfo] = useState<NetworkInfo>(EMPTY_NETWORK_INFO)
	const [hasError, setHasError] = useState(false)
	const [loadingState, setLoadingState] = useState<NetworkLoadingState>(
		NetworkLoadingState.IDLE
	)

	const fetchNetworkData = useCallback(async (isRefresh = false) => {
		setLoadingState(
			isRefresh ? NetworkLoadingState.REFRESHING : NetworkLoadingState.INITIAL
		)

		const client = getMainClient()

		const fetchIp = async () => {
			const [error, response] = await safeAwait<AxiosError, { data: NetworkInfo }>(
				client.get('/extension/@me/ip')
			)
			if (error || !response) return null

			const data = response.data
			return {
				ip: data.ip,
				country: data.country,
				countryIcon: data.countryIcon,
				city: data.city,
				isp: data.isp,
			}
		}

		const fetchPing = async () => {
			const start = Date.now()
			const [error] = await safeAwait<AxiosError, unknown>(client.get('/'))
			if (error && !error.status) return null

			return Date.now() - start
		}

		const [ipData, ping] = await Promise.all([fetchIp(), fetchPing()])

		if (ipData) {
			setNetworkInfo({ ...ipData, ping })
			setHasError(false)
		} else {
			setNetworkInfo({ ...EMPTY_NETWORK_INFO, ping })
			setHasError(true)
		}

		setLoadingState(NetworkLoadingState.IDLE)
	}, [])

	useEffect(() => {
		const handleOffline = () => setIsOnline(false)
		const handleOnline = () => setIsOnline(true)

		window.addEventListener('offline', handleOffline)
		window.addEventListener('online', handleOnline)

		return () => {
			window.removeEventListener('offline', handleOffline)
			window.removeEventListener('online', handleOnline)
		}
	}, [])

	useEffect(() => {
		if (isAuthenticated) {
			fetchNetworkData()
		}
	}, [isAuthenticated, fetchNetworkData])

	const handleRefresh = useCallback(() => {
		Analytics.event('refresh_network_data')
		fetchNetworkData(true)
	}, [fetchNetworkData])

	const status = isOnline ? 'online' : 'offline'
	const isInitialLoading = loadingState === NetworkLoadingState.INITIAL
	const isRefreshing = loadingState === NetworkLoadingState.REFRESHING
	const isLoading = loadingState !== NetworkLoadingState.IDLE
	const showError = hasError && !isLoading

	if (size.w === 1 && size.h === 1) {
		return (
			<WidgetContainer>
				<NetworkCompactSquare
					status={status}
					ping={networkInfo.ping}
					isAuthenticated={isAuthenticated}
					isInitialLoading={isInitialLoading}
					isRefreshing={isRefreshing}
					hasError={showError}
					blurMode={blurMode}
					countryIcon={networkInfo.countryIcon}
					ip={networkInfo.ip}
					isp={networkInfo.isp}
					city={networkInfo.city}
					onRefresh={handleRefresh}
				/>
			</WidgetContainer>
		)
	}

	if (size.w === 2 && size.h === 1) {
		return (
			<WidgetContainer>
				<NetworkCompactRow
					status={status}
					ip={networkInfo.ip}
					countryIcon={networkInfo.countryIcon}
					city={networkInfo.city}
					isp={networkInfo.isp}
					ping={networkInfo.ping}
					isAuthenticated={isAuthenticated}
					isLoading={isLoading}
					hasError={showError}
					blurMode={blurMode}
					onRefresh={handleRefresh}
				/>
			</WidgetContainer>
		)
	}

	return (
		<WidgetContainer>
			<RequireAuth mode="preview">
				<section aria-label="شبکه" className="flex flex-col h-full">
					<header className="flex items-center justify-between mb-2">
						<h3 className="flex items-center gap-2 text-sm font-semibold text-content">
							شبکه
						</h3>

						<Tooltip content="بارگذاری مجدد">
							<Button
								onClick={handleRefresh}
								size="xs"
								disabled={isLoading}
								aria-label="بارگذاری مجدد"
								className="flex items-center justify-center w-6 h-6 p-0 rounded-full border-none! shadow-none!"
							>
								<Icon
									name="refresh"
									size={12}
									aria-hidden="true"
									className={cn(
										'text-content opacity-70 hover:opacity-100',
										isLoading && 'animate-spin'
									)}
								/>
							</Button>
						</Tooltip>
					</header>

					{isInitialLoading ? (
						<NetworkLoadingSkeleton />
					) : showError ? (
						<NetworkError onRetry={handleRefresh} />
					) : (
						<div className="flex-1 space-y-2">
							<div className="relative overflow-hidden border border-content rounded-2xl">
								<div
									aria-hidden="true"
									className="absolute inset-0 bg-linear-to-br from-base-content/5 to-transparent"
								/>
								<div className="relative p-2 space-y-3 max-h-32 min-h-32">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<span
												aria-hidden="true"
												className={cn(
													'w-2 h-2 rounded-full',
													isOnline
														? 'bg-success animate-pulse'
														: 'bg-error'
												)}
											/>
											<span className="text-xs font-medium text-muted">
												{isOnline ? 'متصل' : 'قطع شده'}
											</span>
										</div>
										{networkInfo.countryIcon && (
											<Tooltip
												content={
													networkInfo.isp ||
													'ارائه‌دهنده خدمات اینترنتی نامشخص'
												}
											>
												<AvatarComponent
													url={networkInfo.countryIcon}
													placeholder="flag"
													className="rounded-sm shadow-sm"
													size="xs"
												/>
											</Tooltip>
										)}
									</div>

									<NetworkIPCard
										blurMode={blurMode}
										ip={networkInfo.ip}
									/>

									{(networkInfo.city || networkInfo.country) && (
										<div className="flex flex-wrap items-center justify-center gap-2 text-xs">
											{networkInfo.city && (
												<span className="px-2 py-1 font-medium rounded-full text-primary bg-primary/10">
													{networkInfo.city}
												</span>
											)}
											{networkInfo.country && (
												<span className="px-2 py-1 font-medium rounded-full text-secondary bg-secondary/10">
													{networkInfo.country}
												</span>
											)}
										</div>
									)}
								</div>
							</div>

							<NetworkPingCard ping={networkInfo.ping} />

							<Button
								size="md"
								type="button"
								className="w-full h-fit py-2.5"
								rounded={'2xl'}
								onClick={handleRefresh}
								disabled={isLoading}
							>
								<Icon
									name="refresh"
									size={12}
									aria-hidden="true"
									className={cn(isLoading && 'animate-spin')}
								/>
								به‌روزرسانی شبکه
							</Button>
						</div>
					)}
				</section>
			</RequireAuth>
		</WidgetContainer>
	)
}
