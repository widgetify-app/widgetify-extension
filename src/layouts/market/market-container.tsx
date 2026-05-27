import { useState, useEffect } from 'react'
import { FaCoins, FaPaintBrush } from 'react-icons/fa'
import { FaPhotoFilm } from 'react-icons/fa6'
import { useAuth } from '@/context/auth.context'
import { MarketWallpaper } from './marketWallpaper'
import { MarketOtherItems } from './other-items'
import { UserCoin } from '../setting/tabs/account/components/user-coin'
import Analytics from '@/analytics'
import { TabNavigation } from '@/components/tab-navigation'
import { MarketCoins } from './market-coins'
import { listenEvent } from '@/common/utils/call-event'

const tabs = [
	{
		id: 'other',
		label: 'شخصی‌سازی',
		icon: <FaPaintBrush />,
		element: <MarketOtherItems />,
	},
	{
		id: 'wallpapers',
		label: 'تصویر زمینه‌ها',
		icon: <FaPhotoFilm />,
		element: <MarketWallpaper />,
	},
	{
		id: 'coins',
		label: 'خرید ویج‌‌کوین',
		icon: <FaCoins />,
		element: <MarketCoins />,
	},
]

export function MarketContainer() {
	const { isAuthenticated, user } = useAuth()
	const [activeTab, setActiveTab] = useState('other')

	const handleTabChange = (tabValue: string) => {
		setActiveTab(tabValue)
		Analytics.event(`market_select_tab_${tabValue}`)
	}

	useEffect(() => {
		const listen = listenEvent('market_change_tab', (tab) => {
			setActiveTab(tab)
		})
		return () => {
			listen()
		}
	}, [])

	return (
		<div dir="rtl" className="flex flex-col h-[80vh] overflow-hidden">
			<div className="flex flex-row items-center justify-between w-full px-1 mb-4">
				<TabNavigation
					activeTab={activeTab}
					onTabClick={(va) => handleTabChange(va)}
					tabs={tabs}
					tabMode="simple"
					size="medium"
				/>

				{isAuthenticated && (
					<div className="flex items-center">
						<UserCoin coins={user?.coins || 0} title="موجودی ویج‌کوین" />
					</div>
				)}
			</div>

			<div className="relative flex-1 overflow-x-hidden overflow-y-auto rounded-xl custom-scrollbar">
				{tabs.map(({ id, element }) => (
					<div
						key={id}
						className={`absolute inset-0 transition-all duration-300 ease-out ${
							activeTab === id
								? 'opacity-100 translate-y-0 z-10'
								: 'opacity-0 translate-y-4 z-0 pointer-events-none'
						}`}
					>
						{activeTab === id && (
							<div className="h-full px-1 pb-2">{element}</div>
						)}
					</div>
				))}
			</div>
		</div>
	)
}
