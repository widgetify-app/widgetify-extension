import { useState } from 'react'
import { FaPaintBrush } from 'react-icons/fa'
import { FaPhotoFilm } from 'react-icons/fa6'
import { useAuth } from '@/context/auth.context'
import { MarketWallpaper } from './marketWallpaper'
import { MarketOtherItems } from './other-items'
import { UserCoin } from '../setting/tabs/account/components/user-coin'
import Analytics from '@/analytics'
import { TabNavigation } from '@/components/tab-navigation'

export function MarketContainer() {
	const { isAuthenticated, user } = useAuth()
	const [activeTab, setActiveTab] = useState('other')

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
	]

	const handleTabChange = (tabValue: string) => {
		setActiveTab(tabValue)
		Analytics.event(`market_select_tab_${tabValue}`)
	}

	return (
		<div className="flex flex-col gap-4 p-1">
			{' '}
			<div dir="rtl" className="flex flex-col gap-4 h-[80vh] overflow-hidden">
				<div className="flex flex-row items-center justify-between w-full ">
					<TabNavigation
						activeTab={activeTab}
						onTabClick={(va) => handleTabChange(va)}
						tabs={tabs}
						tabMode="sample"
						size="medium"
					/>

					{isAuthenticated && (
						<div className="flex items-center ">
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
								<div className="h-full p-2">{element}</div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
