import { useEffect, useRef, useState } from 'react'
import { TbApps, TbLayoutGrid, TbSettings } from 'react-icons/tb'
import Analytics from '@/analytics'
import { setToStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import Tooltip from '@/components/toolTip'

interface WidgetMenuProps {
	showNewBadge: boolean
}

export function WidgetMenu({ showNewBadge }: WidgetMenuProps) {
	const [isOpen, setIsOpen] = useState(false)
	const menuRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isOpen])

	const handleWidgetSettings = () => {
		setToStorage('seenWidgetSettings_1', true)
		callEvent('openWidgetsSettings', { tab: null })
		setIsOpen(false)
	}

	const handleWigiPage = () => {
		callEvent('switchToWigiPage', null)
		Analytics.event('navigate_to_explorer_page_from_menu')
		setIsOpen(false)
	}

	return (
		<div className="relative" ref={menuRef}>
			<Tooltip content={isOpen ? '' : 'ویجت‌ها'}>
				<div
					className="relative flex items-center justify-center w-8 h-8 gap-2 transition-all border cursor-pointer border-content rounded-xl bg-content backdrop-blur-sm hover:opacity-80"
					onClick={() => setIsOpen(!isOpen)}
					id="widget-menu-button"
				>
					<TbApps size={20} className="text-muted" />
					{showNewBadge && (
						<span className="absolute w-2 h-2 rounded-full left-4 -bottom-0.5 bg-error animate-pulse"></span>
					)}
				</div>
			</Tooltip>

			{isOpen && (
				<div className="absolute left-0 z-50 w-48 border shadow-lg top-10 rounded-xl bg-content border-content backdrop-blur-sm">
					<div className="p-2 space-y-1">
						<button
							onClick={handleWidgetSettings}
							className="flex items-center w-full gap-3 px-3 py-2 text-sm transition-colors rounded-lg text-muted hover:bg-base-300 hover:text-primary"
						>
							<TbSettings size={16} />
							<span>مدیریت ویجت‌ها</span>
						</button>
						<button
							onClick={handleWigiPage}
							className="flex items-center w-full gap-3 px-3 py-2 text-sm transition-colors rounded-lg text-muted hover:bg-base-300 hover:text-primary"
						>
							<TbLayoutGrid size={16} />
							<span>ویجی پیج</span>
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
