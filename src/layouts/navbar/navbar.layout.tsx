import { listenEvent } from '@/common/utils/call-event'
import Tooltip from '@/components/toolTip'
import { useWidgetVisibility } from '@/context/widget-visibility.context'
import { type JSX, useEffect, useState } from 'react'
import { TbApps } from 'react-icons/tb'
import { VscSettings } from 'react-icons/vsc'
import { SettingModal } from '../setting/setting-modal'
import { FriendsList } from './friends-list/friends'
import { SyncButton } from './sync/sync'

export interface PageLink {
	name: string
	to: string
}

export function NavbarLayout(): JSX.Element {
	const [showSettings, setShowSettings] = useState(false)
	const { openWidgetSettings } = useWidgetVisibility()
	const [tab, setTab] = useState<string | null>(null)
	useEffect(() => {
		const handleOpenSettings = (tab: any) => {
			if (tab) {
				setTab(tab)
			}
			setShowSettings(true)
		}

		const openSettingEvent = listenEvent('openSettings', handleOpenSettings)

		return () => {
			openSettingEvent()
		}
	}, [])

	return (
		<>
			<nav className="flex items-center justify-between px-4 py-2">
				<div className="flex items-center">
					<h1 className="text-2xl text-gray-100">ویجتی‌فای</h1>
				</div>
				<div className="flex items-center gap-2">
					<FriendsList />

					<SyncButton />
					<Tooltip content="مدیریت ویجت‌ها">
						<button
							className={
								'flex items-center justify-center cursor-pointer w-10 h-10 text-content transition-all border border-content shadow-lg rounded-xl hover:text-gray-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 bg-content'
							}
							onClick={() => openWidgetSettings()}
							aria-label="Widgets"
						>
							<TbApps size={22} />
						</button>
					</Tooltip>
					<Tooltip content="تنظیمات">
						<button
							className={
								'flex items-center justify-center cursor-pointer w-10 h-10 text-content transition-all border border-content shadow-lg rounded-xl hover:text-gray-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 bg-content'
							}
							onClick={() => setShowSettings(true)}
							aria-label="Settings"
						>
							<VscSettings size={22} />
						</button>
					</Tooltip>
				</div>
			</nav>
			<SettingModal
				isOpen={showSettings}
				onClose={() => setShowSettings(false)}
				selectedTab={tab}
			/>
		</>
	)
}
