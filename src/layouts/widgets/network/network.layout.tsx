import type { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { RequireAuth } from '@/components/auth/require-auth'
import { AvatarComponent, Button } from '@/components/ui'
import { Tooltip } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { getMainClient, safeAwait } from '@/services/api'
import { WidgetContainer } from '../widget-container'
import { NetworkIPCard, NetworkPingCard } from './components'
import { NetworkCompactSquare } from './variants/network-1x1'
import { NetworkCompactRow } from './variants/network-2x1'
import { Icon } from '@/src/icons'
import type { WidgetSize } from '../layout-engine/types'

interface NetworkInfo {
	status: 'online' | 'offline'
	ip: string | null
	country: string | null
	countryIcon: string | null
	city: string | null
	isp: string | null
	ping: number | null
	speed: string
}

export enum NetworkLoadingState {
	IDLE = 'IDLE',
	INITIAL = 'INITIAL',
	REFRESHING = 'REFRESHING',
}

interface Prop {
	inComboWidget: boolean
	enableBackground: boolean
	size?: WidgetSize
}
export function NetworkLayout({
	enableBackground,
	inComboWidget,
	size = { w: 2, h: 2 },
}: Prop) {
	const { blurMode } = useGeneralSetting()
	const { isAuthenticated } = useAuth()

	const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
		status: 'online',
		ip: null,
		country: null,
		countryIcon: null,
		city: null,
		isp: null,
		ping: null,
		speed: 'به زودی..',
	})

	const [loadingState, setLoadingState] = useState<NetworkLoadingState>(
		NetworkLoadingState.INITIAL
	)

	const fetchNetworkData = async (isRefresh = false) => {
		setLoadingState(
			isRefresh ? NetworkLoadingState.REFRESHING : NetworkLoadingState.INITIAL
		)
		try {
			const client = getMainClient()
			const response = await client.get('/extension/@me/ip')
			const data = response.data
			setNetworkInfo((prev) => ({
				...prev,
				ip: data.ip,
				country: data.country,
				countryIcon: data.countryIcon,
				city: data.city,
				isp: data.isp,
			}))
		} catch {
			setNetworkInfo((prev) => ({
				...prev,
				ip: 'N/A',
				country: null,
				countryIcon: null,
				city: null,
				isp: null,
			}))
		}

		try {
			const client = getMainClient()
			const start = Date.now()
			const [err, _ok] = await safeAwait<AxiosError, any>(client.get('/'))
			if (err) {
				if (!err.status) {
					throw err
				}
			}
			const end = Date.now()
			setNetworkInfo((prev) => ({ ...prev, ping: end - start }))
		} catch {
			setNetworkInfo((prev) => ({ ...prev, ping: null }))
		}
		setLoadingState(NetworkLoadingState.IDLE)
	}

	useEffect(() => {
		window.addEventListener('offline', () => {
			setNetworkInfo((prev) => ({
				...prev,
				status: 'offline',
			}))
		})
		window.addEventListener('online', () => {
			setNetworkInfo((prev) => ({
				...prev,
				status: 'online',
			}))
		})

		if (isAuthenticated) {
			fetchNetworkData()
		}
	}, [isAuthenticated])

	function handleRefresh() {
		Analytics.event('refresh_network_data')
		fetchNetworkData(true)
	}

	const isInitialLoading = loadingState === NetworkLoadingState.INITIAL
	const isRefreshing = loadingState === NetworkLoadingState.REFRESHING
	const isLoading = loadingState !== NetworkLoadingState.IDLE

	if (!inComboWidget) {
		if (size.w === 1 && size.h === 1) {
			return (
				<WidgetContainer background={enableBackground}>
					<NetworkCompactSquare
						status={networkInfo.status}
						ping={networkInfo.ping}
						isInitialLoading={isInitialLoading}
						isRefreshing={isRefreshing}
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
				<WidgetContainer background={enableBackground}>
					<NetworkCompactRow
						status={networkInfo.status}
						ip={networkInfo.ip}
						countryIcon={networkInfo.countryIcon}
						city={networkInfo.city}
						isp={networkInfo.isp}
						ping={networkInfo.ping}
						isLoading={isLoading}
						blurMode={blurMode}
					/>
				</WidgetContainer>
			)
		}
	}

	return (
		<WidgetContainer
			className={`${inComboWidget ? 'h-52! max-h-52! min-h-52! mt-1' : ''}`}
			background={enableBackground}
		>
			<RequireAuth mode="preview">
				<div className="flex flex-col h-full">
					{!inComboWidget && (
						<div className="flex items-center justify-between mb-2">
							<h4 className="flex items-center gap-2 text-sm font-semibold text-content">
								شبکه
							</h4>

							<Tooltip content="بارگذاری مجدد">
								<Button
									onClick={handleRefresh}
									size="xs"
									className="h-6 w-6 p-0 flex items-center justify-center rounded-full !border-none !shadow-none"
								>
									<Icon
										name="refresh"
										size={12}
										className="text-content opacity-70 hover:opacity-100"
									/>
								</Button>
							</Tooltip>
						</div>
					)}

					<div className="flex-1 space-y-2">
						<div className="relative overflow-hidden border border-content rounded-2xl">
							<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
							<div className="relative p-2 space-y-3 max-h-32 min-h-32">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div
											className={`w-2 h-2 rounded-full animate-pulse ${networkInfo.status === 'online' ? 'bg-success' : 'bg-error'}`}
										></div>
										<span className="text-xs font-medium text-muted">
											{networkInfo.status === 'online'
												? 'متصل'
												: 'قطع شده'}
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

								<NetworkIPCard blurMode={blurMode} ip={networkInfo.ip} />

								{/* Location Info */}
								{(networkInfo.city || networkInfo.country) && (
									<div className="flex items-center justify-center gap-2 text-xs flex-warp">
										{networkInfo.city && (
											<span className="px-2 py-1 font-medium text-primary rounded-full bg-primary/10">
												{networkInfo.city}
											</span>
										)}
										{networkInfo.country && (
											<span className="px-2 py-1 font-medium text-secondary rounded-full bg-secondary/10">
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
							className="w-full h-fit py-3.5"
							rounded={'2xl'}
							variant={'default'}
							onClick={handleRefresh}
							disabled={isLoading}
						>
							<Icon
								name="refresh"
								size={14}
								className={isLoading ? 'animate-spin' : ''}
							/>
							به‌روزرسانی شبکه
						</Button>
					</div>
				</div>
			</RequireAuth>
		</WidgetContainer>
	)
}
