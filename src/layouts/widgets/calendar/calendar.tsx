import { getFromStorage, setToStorage } from '@/common/storage'
import { useGeneralSetting } from '@/context/general-setting.context'
import { useTheme } from '@/context/theme.context'
import type React from 'react'
import { useEffect, useState } from 'react'
import { MdMenuOpen, MdOutlineMenu } from 'react-icons/md'
import { CalendarContainer } from './components/calendar-container'
import { CalendarContent } from './components/calendar-content'
import { CalendarGrid } from './components/calendar-grid'
import { CalendarHeader } from './components/calendar-header'
import { DaySummary } from './components/day-summary'
import { getCurrentDate } from './utils'

export type TabType = 'events' | 'todos' | 'pomodoro' | 'religious-time'

interface CalendarLayoutProps {
	onDrawerToggle: (isOpen: boolean) => void
}
const CalendarLayout: React.FC<CalendarLayoutProps> = ({ onDrawerToggle }) => {
	const { theme } = useTheme()
	const { timezone } = useGeneralSetting()
	const today = getCurrentDate(timezone)
	const [currentDate, setCurrentDate] = useState(today)
	const [selectedDate, setSelectedDate] = useState(today.clone())
	const [activeTab, setActiveTab] = useState<TabType>('events')
	const [isDrawerOpen, setIsDrawerOpen] = useState(true)

	const handleTabClick = (tab: TabType) => {
		setActiveTab(tab)
		setToStorage('calendarDrawerState', true)
		setIsDrawerOpen(true)
	}

	const goToToday = () => {
		const realToday = getCurrentDate(timezone)
		setCurrentDate(realToday.clone())
		setSelectedDate(realToday.clone())
	}

	const toggleDrawer = () => {
		const newState = !isDrawerOpen
		setIsDrawerOpen(newState)
		setToStorage('calendarDrawerState', newState)
	}

	useEffect(() => {
		const loadDrawerState = async () => {
			const storedState = (await getFromStorage('calendarDrawerState')) as
				| boolean
				| undefined
			if (storedState === undefined) {
				setIsDrawerOpen(true)
			} else {
				setIsDrawerOpen(storedState)
			}
		}
		loadDrawerState()
	}, [])

	useEffect(() => {
		onDrawerToggle(isDrawerOpen)
	}, [isDrawerOpen])

	return (
		<div
			className={`transition-all duration-300 flex flex-col ${isDrawerOpen ? 'justify-center' : 'justify-start'} w-full h-full gap-3 mb-1 sm:h-80 md:flex-row`}
			dir="rtl"
		>
			<CalendarContainer
				className={`${isDrawerOpen ? 'flex flex-col w-full overflow-hidden md:w-7/12 md:flex-1' : 'flex flex-col overflow-hidden md:flex-1 min-w-64 max-w-64 md:w-7/12'} transition-all duration-300`}
				theme={theme}
			>
				<CalendarHeader
					currentDate={currentDate}
					setCurrentDate={setCurrentDate}
					selectedDate={selectedDate}
					goToToday={goToToday}
				/>

				<CalendarGrid
					currentDate={currentDate}
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
				/>

				<div className={'mt-auto flex flex-row justify-between mb-2'}>
					<div className="flex-1">
						<DaySummary selectedDate={selectedDate} onTabClick={handleTabClick} />
					</div>
					<button
						onClick={toggleDrawer}
						className={
							'flex items-center justify-center px-2 py-1 rounded-lg cursor-pointer transition-colors'
						}
					>
						{isDrawerOpen ? (
							<MdOutlineMenu className="w-3 h-3" />
						) : (
							<MdMenuOpen className="w-3 h-3" />
						)}
					</button>
				</div>
			</CalendarContainer>

			{isDrawerOpen && (
				<CalendarContainer className="w-full p-3 md:w-5/12 md:p-4" theme={theme}>
					<CalendarContent
						activeTab={activeTab}
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
						currentDate={currentDate}
						setCurrentDate={setCurrentDate}
						onTabClick={handleTabClick}
					/>
				</CalendarContainer>
			)}
		</div>
	)
}

export default CalendarLayout
