import { useState } from 'react'
import { FaPaintBrush } from 'react-icons/fa'
import { FaPhotoFilm } from 'react-icons/fa6'
import { useAuth } from '@/context/auth.context'
import { MarketWallpaper } from './marketWallpaper'
import { MarketOtherItems } from './other-items'
import { UserCoin } from '../setting/tabs/account/components/user-coin'
import Analytics from '@/analytics'

export function MarketContainer() {
	const { isAuthenticated, user } = useAuth()
	const [activeTab, setActiveTab] = useState('other')

	const tabs = [
		{
			label: 'شخصی‌سازی',
			value: 'other',
			icon: <FaPaintBrush />,
			element: <MarketOtherItems />,
		},
		{
			label: 'تصویر زمینه‌ها',
			value: 'wallpapers',
			icon: <FaPhotoFilm />,
			element: <MarketWallpaper />,
		},
	]

	const handleTabChange = (tabValue: string) => {
		setActiveTab(tabValue)
		Analytics.event(`market_select_tab_${tabValue}`)
	}

	const getTabButtonStyle = (isActive: boolean) => {
		return isActive ? 'text-primary bg-primary/15' : 'text-muted hover:bg-base-300'
	}

	const getTabIconStyle = (isActive: boolean) => {
		return isActive ? 'text-primary' : 'text-muted'
	}

	return (
		<div className="flex flex-col gap-2">
			<div dir="rtl" className="flex flex-col gap-1 h-[80vh] overflow-hidden">
				<div className="flex flex-row justify-between w-full">
					<div className="flex gap-2 p-2 overflow-x-auto rounded-lg shrink-0 md:overflow-y-auto">
						{tabs.map(({ label, value, icon }) => (
							<button
								key={value}
								onClick={() => handleTabChange(value)}
								className={`relative flex items-center gap-3 px-4 py-3  rounded-full transition-all duration-200 ease-in-out justify-start cursor-pointer whitespace-nowrap active:scale-[0.98] ${getTabButtonStyle(activeTab === value)}`}
							>
								<span
									className={`relative ${getTabIconStyle(activeTab === value)}`}
								>
									{icon}
								</span>
								<span className="text-sm">{label}</span>
							</button>
						))}
					</div>
					{
						<div className="flex items-center justify-center pl-2">
							{isAuthenticated && (
								<UserCoin
									coins={user?.coins || 0}
									title="موجودی ویج‌کوین شما"
								/>
							)}
						</div>
					}
				</div>
				<div className="relative flex-1 overflow-x-hidden overflow-y-auto rounded-lg">
					{tabs.map(({ value, element }) => (
						<div
							key={value}
							className={`absolute inset-0 p-1 rounded-lg transition-all duration-200 ease-in-out ${
								activeTab === value
									? 'opacity-100 translate-x-0 z-10'
									: 'opacity-0 translate-x-5 z-0 pointer-events-none'
							}`}
						>
							{activeTab === value && element}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
