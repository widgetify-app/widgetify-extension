import Analytics from '@/analytics'
import type React from 'react'
import { useEffect, useState } from 'react'
import { FaGear } from 'react-icons/fa6'
import { FiCheckCircle, FiCoffee, FiPause, FiPlay, FiRefreshCw } from 'react-icons/fi'
import { ControlButton } from './components/control-button'
import { ModeButton } from './components/mode-button'
import { PomodoroSettingsPanel } from './components/settings-panel'
import { TimerDisplay } from './components/timer-display'
import { modeColors } from './constants'
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
	})

	const getMaxTime = () => {
		switch (mode) {
			case 'work':
				return settings.workTime * 60
			case 'short-break':
				return settings.shortBreakTime * 60
			case 'long-break':
				return settings.longBreakTime * 60
		}
	}

	const progress = (timeLeft / getMaxTime()) * 100

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
			new Notification('تایمر پومودورو', {
				body: `تایمر ${
					mode === 'work'
						? 'کار'
						: mode === 'short-break'
							? 'استراحت کوتاه'
							: 'استراحت بلند'
				} به پایان رسید!`,
			})
		}

		if (mode === 'work') {
			const newCycles = cycles + 1
			setCycles(newCycles)

			if (newCycles % settings.cyclesBeforeLongBreak === 0) {
				setMode('long-break')
				setTimeLeft(settings.longBreakTime * 60)
			} else {
				setMode('short-break')
				setTimeLeft(settings.shortBreakTime * 60)
			}
		} else {
			setMode('work')
			setTimeLeft(settings.workTime * 60)
		}
	}

	const handleStart = () => {
		if (
			Notification.permission !== 'granted' &&
			Notification.permission !== 'denied'
		) {
			Notification.requestPermission()
		}
		setIsRunning(true)

		Analytics.featureUsed(
			'pomodoro_timer',
			{
				action: 'start',
				mode,
				remaining_time: timeLeft,
			},
			'click'
		)
	}

	const handlePause = () => {
		setIsRunning(false)

		Analytics.featureUsed(
			'pomodoro_timer',
			{
				action: 'pause',
				mode,
				remaining_time: timeLeft,
			},
			'click'
		)
	}

	const handleReset = () => {
		setIsRunning(false)
		setTimeLeft(getMaxTime())

		Analytics.featureUsed(
			'pomodoro_timer',
			{
				action: 'reset',
				mode,
				cycles_completed: cycles,
			},
			'click'
		)
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
			case 'long-break':
				setTimeLeft(settings.longBreakTime * 60)
				break
		}

		Analytics.featureUsed(
			'pomodoro_timer',
			{
				action: 'mode_change',
				previous_mode: mode,
				new_mode: newMode,
			},
			'click'
		)
	}

	const handleUpdateSettings = (newSettings: PomodoroSettings) => {
		setSettings(newSettings)

		if (mode === 'work') {
			setTimeLeft(newSettings.workTime * 60)
		} else if (mode === 'short-break') {
			setTimeLeft(newSettings.shortBreakTime * 60)
		} else if (mode === 'long-break') {
			setTimeLeft(newSettings.longBreakTime * 60)
		}
	}

	const getProgressColor = () => {
		return modeColors[mode]
	}
	return (
		<div className="relative p-1 overflow-hidden duration-300 rounded-xl animate-in fade-in-0 slide-in-from-bottom-24">
			{/* Mode Selection */}
			<div className="relative flex items-center justify-between mb-4">
				<div className="flex items-center gap-x-1.5">
					<ModeButton
						mode="work"
						currentMode={mode}
						onClick={() => handleModeChange('work')}
					/>
					<ModeButton
						mode="short-break"
						currentMode={mode}
						onClick={() => handleModeChange('short-break')}
					/>
					<ModeButton
						mode="long-break"
						currentMode={mode}
						onClick={() => handleModeChange('long-break')}
					/>
				</div>

				<button
					className="p-1 transition-transform duration-150 ease-in-out rounded-full cursor-pointer hover:bg-gray-500/10 hover:scale-110 active:scale-90"
					onClick={() => setShowSettings(!showSettings)}
				>
					<FaGear className="w-3 h-3 opacity-70 hover:opacity-100" />
				</button>
			</div>
			{/* Timer Display */}
			<div className="relative mt-3">
				<TimerDisplay
					timeLeft={timeLeft}
					progress={progress}
					mode={mode}
					getProgressColor={getProgressColor}
					cycles={cycles}
					cyclesBeforeLongBreak={settings.cyclesBeforeLongBreak}
				/>

				{/* Control buttons */}
				<div className="flex justify-center gap-x-4 mt-7">
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
			</div>{' '}
			{/* Settings panel */}
			<PomodoroSettingsPanel
				isOpen={showSettings}
				onClose={() => setShowSettings(false)}
				settings={settings}
				onUpdateSettings={handleUpdateSettings}
				onReset={handleReset}
			/>
		</div>
	)
}
