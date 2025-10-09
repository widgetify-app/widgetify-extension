import { useState } from 'react'
import { TbApps, TbLayoutGrid } from 'react-icons/tb'
import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import Tooltip from '@/components/toolTip'

interface FloatingWidgetButtonProps {
	currentPage: 'home' | 'wigi-page'
}

export function FloatingWidgetButton({ currentPage }: FloatingWidgetButtonProps) {
	const [isHovered, setIsHovered] = useState(false)

	const handleClick = () => {
		if (currentPage === 'home') {
			callEvent('switchToWigiPage', null)
			Analytics.event('navigate_to_explorer_page_from_fab')
		} else {
			callEvent('switchToHomePage', null)
			Analytics.event('navigate_to_home_from_fab')
		}
	}

	return (
		<div className="fixed z-50 bottom-6 left-6">
			<Tooltip content={currentPage === 'home' ? 'ویجی پیج' : 'صفحه اصلی'}>
				<button
					onClick={handleClick}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
					className="flex items-center justify-center text-white transition-all duration-200 transform rounded-full shadow-lg w-14 h-14 bg-primary hover:shadow-xl hover:scale-105 backdrop-blur-sm"
				>
					{currentPage === 'home' ? (
						<TbLayoutGrid
							size={24}
							className={`transition-transform ${isHovered ? 'scale-110' : ''}`}
						/>
					) : (
						<TbApps
							size={24}
							className={`transition-transform ${isHovered ? 'scale-110' : ''}`}
						/>
					)}
				</button>
			</Tooltip>
		</div>
	)
}
