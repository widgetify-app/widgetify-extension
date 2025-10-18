import type { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { MdRefresh } from 'react-icons/md'
import Analytics from '@/analytics'
import { RequireAuth } from '@/components/auth/require-auth'
import { AvatarComponent } from '@/components/avatar.component'
import { Button } from '@/components/button/button'
import Tooltip from '@/components/toolTip'
import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { getMainClient, safeAwait } from '@/services/api'
import { WidgetContainer } from '../widget-container'
import { NetworkIPCard, NetworkLoadingSkeleton, NetworkPingCard } from './components'

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

export function NetworkLayout() {
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

	const [isLoading, setIsLoading] = useState(true)

	const fetchNetworkData = async () => {
		setIsLoading(true)
		try {
			const client = await getMainClient()
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
			const client = await getMainClient()
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
		setIsLoading(false)
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
		fetchNetworkData()
	}

	return (
		<WidgetContainer>
			<RequireAuth mode="preview">
				<div className="flex flex-col h-full">
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
								<MdRefresh
									size={12}
									className="text-content opacity-70 hover:opacity-100"
								/>
							</Button>
						</Tooltip>
					</div>

					<div className="flex-1 space-y-2">
						{isLoading ? (
							<NetworkLoadingSkeleton />
						) : (
							<>
								<div className="relative overflow-hidden border border-content rounded-2xl ">
									<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
									<div className="relative p-4 space-y-3">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<div
													className={`w-2 h-2 rounded-full animate-pulse ${networkInfo.status === 'online' ? 'bg-success' : 'bg-red-500'}`}
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

										<NetworkIPCard
											blurMode={blurMode}
											ip={networkInfo.ip}
										/>

										{/* Location Info */}
										{(networkInfo.city || networkInfo.country) && (
											<div className="flex items-center justify-center gap-2 text-xs flex-warp">
												{networkInfo.city && (
													<span className="px-2 py-1 font-medium text-blue-600 rounded-full bg-blue-500/10 dark:text-blue-400">
														{networkInfo.city}
													</span>
												)}
												{networkInfo.country && (
													<span className="px-2 py-1 font-medium text-purple-600 rounded-full bg-purple-500/10 dark:text-purple-400">
														{networkInfo.country}
													</span>
												)}
											</div>
										)}
									</div>
								</div>

								<NetworkPingCard ping={networkInfo.ping} />
							</>
						)}
					</div>
				</div>
			</RequireAuth>
		</WidgetContainer>
	)
}
