import { t } from '@/common/i18n'
import type React from 'react'
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, removeFromStorage, setToStorage } from '@/common/storage'
import { PopoverMenuItem, TabNavigation } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { useCreatePomodoroSession } from '@/services/pomodoro/create-session.hook'
import { TopUsersType } from '@/services/pomodoro/get-top-users.hook'
import { ControlButton } from './components/control-button'
import { RequestNotificationModal } from './components/request-notification-modal'
import { PomodoroSettingsForm } from './components/settings-form'
import { PomodoroSettingsPanel } from './components/settings-panel'
import { TimerDisplay } from './components/timer-display'
import { TopUsersTab } from './top-users/top-users'
import { ALARM_SOUND_URL, modeFullLabels } from './constants'
import type { PomodoroSettings, TimerMode } from './types'

export type { PomodoroSession, PomodoroSettings } from './types'
import { Icon } from '@/icons'
import {
	WidgetBackButton,
	WidgetHeaderButton,
} from '@/features/widgets/components/widget-header'
import { useWidgetMenuActions } from '@/features/widgets/widget-menu.context'
import { ToolHeader } from '../components/tool-header'

interface PomodoroTimerProps {
	tabs?: ReactNode
	onComplete?: () => void
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ tabs, onComplete }) => {
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

		if (settings.alarmEnabled && mode === 'work' && !import.meta.env.FIREFOX) {
			const audio = new Audio(ALARM_SOUND_URL)
			audio.autoplay = true
			audio.play().catch(() => {})
		}

		if (Notification.permission === 'granted') {
			const textList: Record<TimerMode, string> = {
				work: t('widgets.pomodoro.notify.workDone'),
				'short-break': t('widgets.pomodoro.notify.breakDone'),
			}

			new Notification(t('widgets.tools.tab.pomodoroTitle'), {
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
		setToStorage('pomodoro_settings', newSettings)

		const minutesFor = (value: PomodoroSettings) =>
			mode === 'work' ? value.workTime : value.shortBreakTime
		if (minutesFor(newSettings) === minutesFor(settings)) return

		const newTimeLeft = minutesFor(newSettings) * 60
		setIsRunning(false)
		setTimeLeft(newTimeLeft)
		setToStorage('pomodoro_session', {
			startTime: Date.now(),
			mode,
			initialTimeLeft: newTimeLeft,
			maxTime: newTimeLeft,
			cycles,
			isRunning: false,
		})
	}

	const onChangeTopUsersType = (val: TopUsersType) => {
		setTopUsersType(val)
		Analytics.event(`${val}_top_users_view`)
	}

	const settingsSummary = t('widgets.pomodoro.timer.sessionSummary', {
		p0: settings.workTime,
		p1: settings.shortBreakTime,
	})
	const openSettings = () => setShowSettings(true)

	useWidgetMenuActions(
		<PopoverMenuItem
			icon={<Icon name="timer" size={14} />}
			label={t('widgets.pomodoro.settings.panelTitle')}
			description={settingsSummary}
			onClick={openSettings}
		/>
	)

	const isBreak = mode === 'short-break'
	const isInModal = !tabs
	const timerLabel = isRunning
		? isBreak
			? t('widgets.pomodoro.timer.untilWork')
			: t('widgets.pomodoro.timer.untilBreak')
		: modeFullLabels[mode]

	const timerView = (
		<div className="flex flex-col items-center justify-center flex-1 min-w-0 min-h-0 gap-2.5">
			<TabNavigation
				tabMode="simple"
				activeTab={mode}
				onTabClick={(value) => handleModeChange(value)}
				tabs={[
					{ label: t('widgets.pomodoro.timer.work'), id: 'work' as const },
					{
						label: t('widgets.pomodoro.settings.break'),
						id: 'short-break' as const,
					},
				]}
				size="sm"
				className="h-7 p-0.5 border-none rounded-xl w-37.5 bg-fill"
				activeBgClass="bg-surface rounded-lg shadow-sm"
				activeTextClass="text-fg-strong"
			/>

			<TimerDisplay
				timeLeft={timeLeft}
				progress={progress}
				mode={mode}
				label={timerLabel}
				isLarge={isInModal}
			/>

			<div className="flex items-center gap-4.5">
				<ControlButton
					icon="reload"
					label={t('widgets.pomodoro.timer.reset')}
					onClick={handleReset}
				/>
				{isRunning ? (
					<ControlButton
						icon="pause"
						label={t('widgets.pomodoro.timer.pause')}
						onClick={handlePause}
						isPrimary
					/>
				) : (
					<ControlButton
						icon="play"
						label={t('widgets.pomodoro.timer.start')}
						onClick={handleStart}
						isPrimary
					/>
				)}
				{isBreak ? (
					<ControlButton
						icon="check"
						label={t('widgets.pomodoro.timer.goToWork')}
						onClick={() => handleModeChange('work')}
					/>
				) : (
					<ControlButton
						icon="coffee"
						label={t('widgets.pomodoro.timer.goToBreak')}
						onClick={() => handleModeChange('short-break')}
					/>
				)}
			</div>
		</div>
	)

	return (
		<>
			{currentTab === 'top-users' ? (
				<>
					<ToolHeader
						tabs={tabs}
						title={t('widgets.pomodoro.leaderboard.open')}
						leading={
							<WidgetBackButton
								label={t('widgets.pomodoro.leaderboard.back')}
								onClick={() => setCurrentTab('timer')}
							/>
						}
					/>
					<TabNavigation
						tabMode="simple"
						activeTab={topUsersType}
						onTabClick={onChangeTopUsersType}
						tabs={[
							{
								label: t('widgets.pomodoro.leaderboard.today'),
								id: TopUsersType.DAILY,
							},
							{
								label: t('widgets.pomodoro.leaderboard.thisWeek'),
								id: TopUsersType.WEEKLY,
							},
							{
								label: t('widgets.pomodoro.leaderboard.all'),
								id: TopUsersType.ALL_TIME,
							},
						]}
						size="sm"
						className="h-7 p-0.5 border-none rounded-xl shrink-0 bg-fill"
						activeBgClass="bg-surface rounded-lg shadow-sm"
						activeTextClass="text-fg-strong"
					/>
					<TopUsersTab type={topUsersType} />
				</>
			) : isInModal ? (
				<div className="flex flex-1 min-h-0 gap-5">
					{timerView}
					<aside
						aria-label={t('widgets.pomodoro.settings.panelTitle')}
						className="flex flex-col w-60 gap-2.5 shrink-0 border-s border-line ps-5"
					>
						<h4 className="text-xs font-bold text-fg-strong">
							{t('widgets.pomodoro.settings.open')}
						</h4>
						<PomodoroSettingsForm
							settings={settings}
							onChange={handleUpdateSettings}
						/>
						<button
							type="button"
							onClick={() => setCurrentTab('top-users')}
							className="flex items-center h-10 gap-2 px-3 mt-auto text-xs font-semibold cursor-pointer rounded-xl bg-fill text-fg transition-ui hover:bg-fill-2 focus-visible:focus-ring"
						>
							<Icon
								name="crown"
								size={14}
								aria-hidden="true"
								className="text-warning"
							/>
							{t('widgets.pomodoro.leaderboard.open')}
							<Icon
								name="chevronLeft"
								size={14}
								aria-hidden="true"
								className="ms-auto text-fg-faint"
							/>
						</button>
					</aside>
				</div>
			) : (
				<>
					<ToolHeader
						tabs={tabs}
						actions={
							<WidgetHeaderButton
								label={t('widgets.pomodoro.leaderboard.open')}
								icon="crown"
								onClick={() => setCurrentTab('top-users')}
							/>
						}
					/>
					{timerView}
				</>
			)}
			<PomodoroSettingsPanel
				isOpen={showSettings}
				onClose={() => setShowSettings(false)}
				settings={settings}
				onUpdateSettings={handleUpdateSettings}
			/>
			<RequestNotificationModal
				setShowRequireNotificationModal={setShowRequireNotificationModal}
				showRequireNotificationModal={showRequireNotificationModal}
				startPomodoro={handleStart}
			/>
		</>
	)
}
