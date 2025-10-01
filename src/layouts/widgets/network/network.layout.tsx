import type { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { MdRefresh } from 'react-icons/md'
import { RequireAuth } from '@/components/auth/require-auth'
import { Button } from '@/components/button/button'
import Tooltip from '@/components/toolTip'
import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { getMainClient, safeAwait } from '@/services/api'
import { WidgetContainer } from '../widget-container'
import {
	NetworkIPCard,
	NetworkLoadingSkeleton,
	NetworkPingCard,
	NetworkSpeedCard,
	NetworkStatusCard,
} from './components'

interface NetworkInfo {
	status: 'online' | 'offline'
	ip: string | null
	ping: number | null
	speed: string
}

export function NetworkLayout() {
	const { blurMode } = useGeneralSetting()
	const { isAuthenticated } = useAuth()

	const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
		status: 'online',
		ip: null,
		ping: null,
		speed: 'به زودی..',
	})

	const [isLoading, setIsLoading] = useState(true)

	const fetchNetworkData = async () => {
		setIsLoading(true)
		try {
			const client = await getMainClient()
			const response = await client.get('/extension/@me/ip')
			setNetworkInfo((prev) => ({ ...prev, ip: response.data.ip }))
		} catch (err) {
			console.log(err)
			setNetworkInfo((prev) => ({ ...prev, ip: 'N/A' }))
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

	return (
		<WidgetContainer>
			<RequireAuth mode="preview">
				<div className="flex flex-col h-full">
					<div className="flex items-center justify-between mb-2">
						<h4 className="flex items-center gap-2 text-sm font-semibold text-content">
							شبکه
							<span className="bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary rounded-2xl">
								آزمایشی
							</span>
						</h4>

						<Tooltip content="بارگذاری مجدد">
							<Button
								onClick={fetchNetworkData}
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

					<div className="flex-1 space-y-3">
						{isLoading ? (
							<NetworkLoadingSkeleton />
						) : (
							<>
								<NetworkStatusCard status={networkInfo.status} />
								<NetworkIPCard ip={networkInfo.ip} blurMode={blurMode} />
								<NetworkPingCard ping={networkInfo.ping} />
								<NetworkSpeedCard speed={networkInfo.speed} />
							</>
						)}
					</div>
				</div>
			</RequireAuth>
		</WidgetContainer>
	)
}
