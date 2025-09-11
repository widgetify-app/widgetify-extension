import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { FaChartSimple, FaGear } from 'react-icons/fa6'
import { FiCheckCircle, FiCoffee, FiPause, FiPlay, FiRefreshCw } from 'react-icons/fi'
import Analytics from '@/analytics'
import { getFromStorage, removeFromStorage, setToStorage } from '@/common/storage'
import { SelectBox } from '@/components/selectbox/selectbox'
import Tooltip from '@/components/toolTip'
import { useAuth } from '@/context/auth.context'
import { useCreatePomodoroSession } from '@/services/hooks/pomodoro/createSession.hook'
import { TopUsersType } from '@/services/hooks/pomodoro/getTopUsers.hook'
import { ControlButton } from './components/control-button'
import { ModeButton } from './components/mode-button'
import { RequestNotificationModal } from './components/requestNotification-modal'
import { PomodoroSettingsPanel } from './components/settings-panel'
import { TimerDisplay } from './components/timer-display'
import { modeLabels } from './constants'
import { TopUsersTab } from './topUsers/top-users'
import type { PomodoroSettings, TimerMode } from './types'

interface PomodoroTimerProps {
	onComplete?: () => void
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onComplete }) => {
	const [isRunning, setIsRunning] = useState(false)
	const [mode, setMode] = useState<TimerMode>('work')
	const [timeLeft, setTimeLeft] = useState(25 * 60)
	const [cycles, setCycles] = useState(0)
	const [showSettings, setShowSettings] = useState(false)
	const [settings, setSettings] = useState<PomodoroSettings>({
		workTime: 25,
		shortBreakTime: 5,
		longBreakTime: 15,
		cyclesBeforeLongBreak: 4,
		alarmEnabled: true,
	})
	const { isAuthenticated } = useAuth()
	const [currentTab, setCurrentTab] = useState<'timer' | 'top-users'>('timer')
	const [showRequireNotificationModal, setShowRequireNotificationModal] =
		useState(false)
	const [topUsersType, setTopUsersType] = useState<TopUsersType>(TopUsersType.ALL_TIME)

	const createSessionMutation = useCreatePomodoroSession()

	const getMaxTime = () => {
		switch (mode) {
			case 'work':
				return settings.workTime * 60
			case 'short-break':
				return settings.shortBreakTime * 60
		}
	}

	useEffect(() => {
		const loadSetting = async () => {
			const storedSettings = await getFromStorage('pomodoro_settings')
			if (storedSettings) {
				setSettings(storedSettings)
				setTimeLeft(storedSettings.workTime * 60)
			} else {
				setTimeLeft(settings.workTime * 60)
			}

			const storedSession = await getFromStorage('pomodoro_session')
			if (storedSession?.isRunning) {
				const {
					startTime,
					mode: sessionMode,
					initialTimeLeft,
					cycles: sessionCycles,
				} = storedSession
				const elapsed = Math.floor((Date.now() - startTime) / 1000)
				const remainingTime = Math.max(0, initialTimeLeft - elapsed)

				setMode(sessionMode)
				setTimeLeft(remainingTime)
				setCycles(sessionCycles)

				if (remainingTime > 0) {
					setIsRunning(true)
				}
			}
		}
		loadSetting()
	}, [])

	const progress = useMemo(() => {
		const maxTime = getMaxTime()
		return maxTime > 0 ? (timeLeft / maxTime) * 100 : 0
	}, [timeLeft, mode, settings])

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null

		if (isRunning && timeLeft > 0) {
			interval = setInterval(() => {
				setTimeLeft((prev) => prev - 1)
			}, 1000)
		} else if (timeLeft === 0) {
			handleTimerComplete()
		}

		return () => {
			if (interval) clearInterval(interval)
		}
	}, [isRunning, timeLeft])

	const handleTimerComplete = () => {
		if (onComplete) onComplete()

		if (Notification.permission === 'granted') {
			if (settings.alarmEnabled && mode === 'work') {
				if (import.meta.env.FIREFOX) {
					//todo: implement Firefox specific audio playback
				} else {
					const audio = new Audio(
						'https://widgetify-ir.storage.c2.liara.space/effects/alarm_1.mp3'
					)
					audio.autoplay = true
					audio.play()
				}
			}
			const textList: Record<TimerMode, string> = {
				work: 'تایمر کار تمام شد! حالا وقت یه استراحت کوتاهه.',
				'short-break': 'استراحت کوتاه تموم شد! آماده‌اید به کار ادامه بدید؟',
			}

			new Notification('تایمر پومودورو', {
				body: textList[mode],
				dir: 'rtl',
			})
		}

		if (isAuthenticated) {
			const now = new Date()
			const modeType = mode === 'work' ? 'WORK' : 'SHORT_BREAK'

			const sessionData = {
				duration:
					modeType === 'WORK' ? settings.workTime : settings.shortBreakTime,
				mode: modeType as 'WORK' | 'SHORT_BREAK',
				startTime: new Date(now.getTime() - getMaxTime() * 1000).toISOString(),
				endTime: now.toISOString(),
				status: 'COMPLETED' as const,
			}
			createSessionMutation.mutate(sessionData)
		}

		if (mode === 'work') {
			const newCycles = cycles + 1
			setCycles(newCycles)

			setMode('short-break')
			setTimeLeft(settings.shortBreakTime * 60)
			setIsRunning(true)
			setToStorage('pomodoro_session', {
				startTime: Date.now(),
				mode: 'short-break',
				initialTimeLeft: settings.shortBreakTime * 60,
				maxTime: settings.shortBreakTime * 60,
				cycles: newCycles,
				isRunning: true,
			})
		} else {
			setMode('work')
			setTimeLeft(settings.workTime * 60)
			setIsRunning(false)
			setToStorage('pomodoro_session', {
				startTime: Date.now(),
				mode: 'work',
				initialTimeLeft: settings.workTime * 60,
				maxTime: settings.workTime * 60,
				cycles,
				isRunning: false,
			})
		}
	}

	const handleStart = () => {
		if (
			Notification.permission !== 'granted' &&
			Notification.permission !== 'denied'
		) {
			setShowRequireNotificationModal(true)
			return
		}
		setIsRunning(true)

		const sessionData = {
			startTime: Date.now(),
			mode,
			initialTimeLeft: timeLeft,
			maxTime: getMaxTime(),
			cycles,
			isRunning: true,
		}
		setToStorage('pomodoro_session', sessionData)

		Analytics.event('pomodoro_start_timer', {
			mode,
			remaining_time: timeLeft,
		})
	}

	const handlePause = () => {
		setIsRunning(false)

		const sessionData = {
			startTime: Date.now(),
			mode,
			initialTimeLeft: timeLeft,
			maxTime: getMaxTime(),
			cycles,
			isRunning: false,
		}
		setToStorage('pomodoro_session', sessionData)

		Analytics.event('pomodoro_pause_timer', {
			mode,
			remaining_time: timeLeft,
		})
	}

	const handleReset = () => {
		setIsRunning(false)
		setTimeLeft(getMaxTime())
		removeFromStorage('pomodoro_session')

		Analytics.event('pomodoro_reset_timer', {
			action: 'reset',
			mode,
			cycles_completed: cycles,
		})
	}

	const handleModeChange = (newMode: TimerMode) => {
		setIsRunning(false)
		setMode(newMode)

		switch (newMode) {
			case 'work':
				setTimeLeft(settings.workTime * 60)
				break
			case 'short-break':
				setTimeLeft(settings.shortBreakTime * 60)
				break
		}
		removeFromStorage('pomodoro_session')

		Analytics.event('pomodoro_mode_change', {
			previous_mode: mode,
			new_mode: newMode,
		})
	}

	const handleUpdateSettings = (newSettings: PomodoroSettings) => {
		setSettings(newSettings)

		let newTimeLeft = timeLeft
		if (mode === 'work') {
			newTimeLeft = newSettings.workTime * 60
			setTimeLeft(newTimeLeft)
		} else {
			newTimeLeft = newSettings.shortBreakTime * 60
			setTimeLeft(newTimeLeft)
		}

		const sessionData = {
			startTime: Date.now(),
			mode,
			initialTimeLeft: newTimeLeft,
			maxTime: newTimeLeft,
			cycles,
			isRunning: false,
		}
		setToStorage('pomodoro_session', sessionData)
		setToStorage('pomodoro_settings', newSettings)
	}

	const onChangeTopUsersType = (val: string) => {
		setTopUsersType(val as TopUsersType)
		Analytics.event(`${val}_top_users_view`)
	}

	return (
		<div className="relative overflow-hidden duration-300 rounded-xl animate-in fade-in-0 slide-in-from-bottom-24">
			{/* Mode Selection */}
			<div className="relative flex items-center justify-between mb-1  py-0.5">
				<div className={`flex items-center gap-x-0.5`}>
					{currentTab === 'timer' ? (
						<>
							<ModeButton
								mode="work"
								label={modeLabels.work}
								currentMode={mode}
								onClick={() => handleModeChange('work')}
							/>
							<ModeButton
								label={modeLabels['short-break']}
								mode="short-break"
								currentMode={mode}
								onClick={() => handleModeChange('short-break')}
							/>
						</>
					) : (
						<SelectBox
							value={topUsersType}
							options={[
								{ label: 'جدول کلی', value: TopUsersType.ALL_TIME },
								{ label: 'جدول هفتگی', value: TopUsersType.WEEKLY },
								{ label: 'جدول روزانه', value: TopUsersType.DAILY },
							]}
							onChange={(val) => onChangeTopUsersType(val)}
						/>
					)}
				</div>

				<div className="flex flex-row items-center gap-x-1">
					<Tooltip
						content={
							currentTab === 'timer'
								? 'جدول برترین کاربران'
								: 'بازگشت به تایمر'
						}
					>
						<button
							className={`p-1 transition-transform duration-150 ease-in-out rounded-full cursor-pointer  hover:scale-110 active:scale-90 ${currentTab === 'top-users' && 'bg-primary text-white'}`}
							onClick={() =>
								setCurrentTab(
									currentTab === 'timer' ? 'top-users' : 'timer'
								)
							}
						>
							<FaChartSimple className="w-3 h-3 opacity-70 hover:opacity-100" />
						</button>
					</Tooltip>
					<Tooltip content="تنظیمات">
						<button
							className="p-1 transition-transform duration-150 ease-in-out rounded-full cursor-pointer hover:bg-gray-500/10 hover:scale-110 active:scale-90"
							onClick={() => setShowSettings(!showSettings)}
						>
							<FaGear className="w-3 h-3 opacity-70 hover:opacity-100" />
						</button>
					</Tooltip>
				</div>
			</div>
			{/* Timer Display */}
			{currentTab === 'timer' ? (
				<div className="relative flex flex-col justify-around mt-2 gap-y-4">
					<TimerDisplay timeLeft={timeLeft} progress={progress} mode={mode} />

					{/* Control buttons */}
					<div className="flex justify-center gap-x-4">
						<ControlButton
							mode={'reset'}
							icon={<FiRefreshCw size={16} strokeWidth={2.25} />}
							onClick={handleReset}
						/>

						{isRunning ? (
							<ControlButton
								mode={'pause'}
								icon={<FiPause size={16} strokeWidth={2.25} />}
								onClick={handlePause}
							/>
						) : (
							<ControlButton
								mode={'play'}
								icon={<FiPlay size={16} strokeWidth={2.25} />}
								onClick={handleStart}
							/>
						)}

						{mode.includes('break') && (
							<ControlButton
								mode={'check'}
								icon={<FiCheckCircle size={16} strokeWidth={2.25} />}
								onClick={() => handleModeChange('work')}
							/>
						)}

						{mode === 'work' && (
							<ControlButton
								mode={'coffee'}
								icon={<FiCoffee size={16} strokeWidth={2.25} />}
								onClick={() => handleModeChange('short-break')}
							/>
						)}
					</div>
				</div>
			) : (
				<TopUsersTab type={topUsersType} />
			)}
			{/* Settings panel */}
			<PomodoroSettingsPanel
				isOpen={showSettings}
				onClose={() => setShowSettings(false)}
				settings={settings}
				onUpdateSettings={handleUpdateSettings}
				onReset={handleReset}
			/>
			<RequestNotificationModal
				setShowRequireNotificationModal={setShowRequireNotificationModal}
				showRequireNotificationModal={showRequireNotificationModal}
				startPomodoro={handleStart}
			/>
		</div>
	)
}
