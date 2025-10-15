import { type JSX, useCallback, useEffect, useState } from 'react'
import { HiHome, HiViewGrid } from 'react-icons/hi'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import Tooltip from '@/components/toolTip'
import { useAuth } from '@/context/auth.context'
import { getConfigData } from '@/services/config-data/config_data-api'
import { SettingModal } from '../setting/setting-modal'
import { NavButton } from './components/navButton'
import { SettingsDropdown } from './components/settingsDropdown'
import { FriendsList } from './friends-list/friends'
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
	const [page, setPage] = useState<any>('home')
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

	const onClickNavButton = (page: string) => {
		setPage(page)
		if (page === 'wigi') callEvent('switchToWigiPage')
		else callEvent('switchToHomePage')
	}

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
				const shouldUpdateLogo =
					(storeData?.logo && storeData.logo.id !== data.logo.id) ||
					!storeData?.logo

				if (shouldUpdateLogo) {
					await sanitizeAndUpdateLogo(
						data.logo.logoUrl,
						data.logo.id,
						storeData
					)
				}
			}
		} catch {}

		const listenHomeEvent = listenEvent('switchToHomePage', () => setPage('home'))
		const listenWigiEvent = listenEvent('switchToWigiPage', () => setPage('wigi'))
		return () => {
			listenHomeEvent()
			listenWigiEvent()
		}
	}, [])

	useEffect(() => {
		const openSettingEvent = listenEvent('openSettings', handleOpenSettings)
		loadConfig()
		return () => {
			openSettingEvent()
		}
	}, [handleOpenSettings, loadConfig])

	const w = isAuthenticated ? 'w-48 md:w-[13.5rem]' : 'w-42 md:w-[13.5rem]'
	return (
		<>
			<nav
				className={`mt-0.5 px-2 md:px-4 md:mt-1 mr-auto h-8 transition-all duration-100 ${w}`}
				data-tour="navbar"
			>
				<div className="relative flex flex-row-reverse items-center h-full px-1 overflow-hidden bg-content bg-glass rounded-xl">
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
						<SyncButton />
						<SettingsDropdown setShowSettings={setShowSettings} />
						<Tooltip content="صفحه ویجت‌ها">
							<NavButton
								onClick={() => onClickNavButton('wigi')}
								icon={<HiViewGrid size={20} />}
								id="wigiPage-button"
								isActive={page === 'wigi'}
							/>
						</Tooltip>
						<Tooltip content="صفحه اصلی">
							<NavButton
								onClick={() => onClickNavButton('home')}
								icon={<HiHome size={20} />}
								id="home-button"
								isActive={page === 'home'}
							/>
						</Tooltip>
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
