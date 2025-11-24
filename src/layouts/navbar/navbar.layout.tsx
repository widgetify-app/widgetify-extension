import { type JSX, useCallback, useEffect, useState } from 'react'
import { HiHome } from 'react-icons/hi'
import { getFromStorage, setToStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import { useAuth } from '@/context/auth.context'
import { getConfigData } from '@/services/config-data/config_data-api'
import { SettingModal } from '../setting/setting-modal'
import { NavButton } from './components/navButton'
import { SettingsDropdown } from './components/settingsDropdown'
import { FriendsList } from './friends-list/friends'
import { MarketButton } from './market/market-button'
import { ProfileNav } from './profile/profile'
import { SyncButton } from './sync/sync'

export interface PageLink {
	name: string
	to: string
}

interface LogoData {
	logoUrl: string | null
	content: string | null
}

const DEFAULT_LOGO_DATA: LogoData = {
	logoUrl: null,
	content: '<h1 class="text-xl text-gray-100">ویجتی‌فای</h1>',
}

const WIDGETIFY_URLS = {
	website: 'https://widgetify.ir',
} as const

export function NavbarLayout(): JSX.Element {
	const [showSettings, setShowSettings] = useState(false)
	const [tab, setTab] = useState<string | null>(null)
	const [logoData, setLogoData] = useState<LogoData>(DEFAULT_LOGO_DATA)
	const { isAuthenticated } = useAuth()

	const handleOpenSettings = useCallback((tabName: 'account' | 'wallpapers' | null) => {
		if (tabName) setTab(tabName)
		setShowSettings(true)
	}, [])

	const settingsModalCloseHandler = () => setShowSettings(false)

	const sanitizeAndUpdateLogo = useCallback(
		(logoUrl: string | null, logoId: string, storeData: any) => {
			const newLogoData = { content: '', logoUrl }

			setLogoData(newLogoData)

			return setToStorage('configData', {
				...storeData,
				logo: { id: logoId, content: '', logoUrl: logoUrl },
			})
		},
		[]
	)

	const loadConfig = useCallback(async () => {
		try {
			const storeData = await getFromStorage('configData')

			if (storeData?.logo) {
				setLogoData({
					content: storeData.logo.content,
					logoUrl: storeData.logo.logoUrl,
				})
			}

			const data = await getConfigData()
			if (data.logo) {
				if (data.logo?.logoUrl) {
					await sanitizeAndUpdateLogo(
						data.logo?.logoUrl,
						data.logo?.id,
						storeData
					)
				}
			}
		} catch {}
	}, [])

	useEffect(() => {
		const openSettingEvent = listenEvent('openSettings', handleOpenSettings)
		loadConfig()
		return () => {
			openSettingEvent()
		}
	}, [handleOpenSettings, loadConfig])

	const w = isAuthenticated ? 'w-48 md:w-[11.2rem]' : 'w-42 md:w-[9.2rem]'
	return (
		<>
			<nav
				className={`mt-0.5 px-1 gap-x-1 md:px-4 md:mt-1 w-full  transition-all duration-100  flex justify-end`}
				data-tour="navbar"
			>
				<MarketButton />
				<SyncButton />

				<div
					className={`relative flex flex-row-reverse items-center h-full px-1 overflow-hidden bg-content bg-glass rounded-xl ${w}`}
				>
					{logoData.logoUrl && (
						<div className="flex items-center justify-center border-r border-content min-w-8 max-w-8">
							<a
								href={WIDGETIFY_URLS.website}
								target="_blank"
								rel="noopener noreferrer"
							>
								<img
									src={logoData.logoUrl || ''}
									alt={logoData.content || 'ویجتی‌فای'}
									className="w-5 h-5 rounded"
								/>
							</a>
						</div>
					)}
					<div className="flex items-center justify-end gap-1 transition-all rounded-xl">
						<ProfileNav />
						<FriendsList />
						<SettingsDropdown setShowSettings={setShowSettings} />
						<NavButton
							onClick={() => {}}
							icon={
								<HiHome
									size={20}
									className="text-muted group-hover:text-primary !text-primary/80"
								/>
							}
							id="home-button"
						/>
					</div>
				</div>
			</nav>

			<SettingModal
				isOpen={showSettings}
				onClose={settingsModalCloseHandler}
				selectedTab={tab}
			/>
		</>
	)
}
