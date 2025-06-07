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
<<<<<<< HEAD
			<nav className="flex items-center justify-between px-4 py-0.5 mt-4">
=======
			<nav className="navbar-layout flex items-center justify-between px-4 py-2">
>>>>>>> c6d9a541c508f834068ac3fc29dd3277a17f91b2
				<div className="flex items-center">
					<h1 className="text-xl text-gray-100">ویجتی‌فای</h1>
				</div>
				<div className="flex items-center gap-2">
					<FriendsList />

					<SyncButton/>
					<Tooltip content="مدیریت ویجت‌ها">
						<div
							className="flex items-center w-8 h-8 gap-2 px-2 overflow-hidden transition-all border cursor-pointer border-content rounded-xl bg-content backdrop-blur-sm hover:opacity-80 hover:scale-105"
							onClick={() => openWidgetSettings()}
						>
							<TbApps size={18} className="text-muted" />
						</div>
					</Tooltip>
					<Tooltip content="تنظیمات">
						<div
							className="flex items-center w-8 h-8 gap-2 px-2 overflow-hidden transition-all border cursor-pointer border-content rounded-xl bg-content backdrop-blur-sm hover:opacity-80 hover:scale-105"
							onClick={() => setShowSettings(true)}
						>
							<VscSettings size={18} className="text-muted" />
						</div>
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
