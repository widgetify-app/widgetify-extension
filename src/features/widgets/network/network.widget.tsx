import { useCallback, useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { PopoverMenuItem } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { Icon } from '@/icons'
import { getIpInfo, measurePing } from '@/services/network/get-network-info'
import type { WidgetSize } from '../utils/layout-engine/types'
import { WidgetContainer } from '../components/widget-container'
import { useWidgetMenuActions } from '../widget-menu.context'
import type { NetworkInfo, NetworkViewProps } from './types'
import { copyIpToClipboard } from './utils/copy-ip'
import { NetworkCompactSquare } from './variants/network-1x1'
import { NetworkCompactRow } from './variants/network-2x1'
import { Network2x3 } from './variants/network-2x3'
import { t } from '@/common/i18n'

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

		const [ipData, ping] = await Promise.all([getIpInfo(), measurePing()])

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
		if (isAuthenticated && isOnline) {
			fetchNetworkData()
		}
	}, [isAuthenticated, isOnline, fetchNetworkData])

	const handleRefresh = useCallback(() => {
		Analytics.event('refresh_network_data')
		fetchNetworkData(true)
	}, [fetchNetworkData])

	const handleRetryOffline = () => {
		setIsOnline(navigator.onLine)
	}

	const isLoading = loadingState !== NetworkLoadingState.IDLE

	useWidgetMenuActions(
		isAuthenticated && isOnline && (
			<>
				{networkInfo.ip && (
					<PopoverMenuItem
						icon={<Icon name="copy" size={14} />}
						label={t('widgets.network.copyIp')}
						onClick={() => copyIpToClipboard(networkInfo.ip)}
					/>
				)}
				<PopoverMenuItem
					icon={<Icon name="refresh" size={14} />}
					label={t('widgets.network.refresh')}
					onClick={handleRefresh}
					disabled={isLoading}
				/>
			</>
		)
	)

	const viewProps: NetworkViewProps = {
		info: networkInfo,
		isOnline,
		isAuthenticated,
		isInitialLoading: loadingState === NetworkLoadingState.INITIAL,
		isLoading,
		hasError: hasError && !isLoading,
		blurMode,
		onRefresh: handleRefresh,
		onRetryOffline: handleRetryOffline,
	}

	if (size.w === 1 && size.h === 1) {
		return (
			<WidgetContainer contentClassName="px-3 py-2.5">
				<NetworkCompactSquare {...viewProps} />
			</WidgetContainer>
		)
	}

	if (size.h === 1) {
		return (
			<WidgetContainer contentClassName="px-3 py-2.5 gap-1.5">
				<NetworkCompactRow {...viewProps} />
			</WidgetContainer>
		)
	}

	return (
		<WidgetContainer contentClassName="p-3 gap-2">
			<Network2x3 {...viewProps} />
		</WidgetContainer>
	)
}
