import { useState, useEffect } from 'react'
import { useAuth } from '@/context/auth.context'
import { MarketWallpaper } from './marketWallpaper'
import { MarketOtherItems } from './other-items'
import { UserCoin } from '../setting/tabs/account/components/user-coin'
import Analytics from '@/analytics'
import { TabNavigation } from '@/components/tab-navigation'
import { MarketCoins } from './market-coins'
import { listenEvent } from '@/common/utils/call-event'
import { Icon } from '@/src/icons'

const tabs = [
	{
		id: 'other',
		label: 'شخصی‌سازی',
		icon: <Icon name="brush" />,
		element: <MarketOtherItems />,
	},
	{
		id: 'wallpapers',
		label: 'تصویر زمینه‌ها',
		icon: <Icon name="photoFilm" />,
		element: <MarketWallpaper />,
	},
	{
		id: 'coins',
		label: 'خرید ویج‌‌کوین',
		icon: <Icon name="coin" />,
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
			<div className="flex flex-row items-center justify-between flex-shrink-0 w-full px-1 mb-2">
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

			<div className="relative flex-1 min-h-0 rounded-xl">
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
							<div className="h-full px-1 pb-2 overflow-x-hidden overflow-y-auto">
								{element}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	)
}
