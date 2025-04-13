import Analytics from '@/analytics'
import { useTheme } from '@/context/theme.context'
import { motion } from 'framer-motion'
import type React from 'react'
import { useEffect, useState } from 'react'
import {
	FiCheckCircle,
	FiCoffee,
	FiPause,
	FiPlay,
	FiRefreshCw,
	FiSettings,
} from 'react-icons/fi'
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
	const { theme } = useTheme()
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
		if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
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
			'click',
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
			'click',
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
			'click',
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
			'click',
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

	const getTextStyle = () => {
		return theme === 'light' ? 'text-gray-700' : 'text-gray-200'
	}

	const getModeButtonStyle = (buttonMode: TimerMode) => {
		const isActive = buttonMode === mode

		if (isActive) {
			return `bg-${modeColors[buttonMode].accent} text-white shadow-sm`
		}

		return theme === 'light'
			? 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors'
			: 'bg-neutral-700/50 text-gray-300 hover:bg-neutral-700 hover:text-white transition-colors'
	}

	const getProgressColor = () => {
		return theme === 'light' ? modeColors[mode].light : modeColors[mode].dark
	}

	const getInputStyle = () => {
		switch (theme) {
			case 'light':
				return 'border-gray-200 bg-white/90 focus:border-blue-400 focus:ring focus:ring-blue-100'
			case 'dark':
				return 'border-neutral-600 bg-neutral-800/80 focus:border-blue-500 focus:ring focus:ring-blue-500/20'
			default:
				return 'border-gray-700/50 bg-gray-800/30 focus:border-blue-400 focus:ring focus:ring-blue-400/20'
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="relative p-1 overflow-hidden rounded-xl"
		>
			{/* Mode Selection */}
			<div className="relative flex items-center justify-between mb-2">
				<div className="flex items-center space-x-2">
					<ModeButton
						mode="work"
						currentMode={mode}
						onClick={() => handleModeChange('work')}
						getStyle={getModeButtonStyle}
					/>
					<ModeButton
						mode="short-break"
						currentMode={mode}
						onClick={() => handleModeChange('short-break')}
						getStyle={getModeButtonStyle}
					/>
					<ModeButton
						mode="long-break"
						currentMode={mode}
						onClick={() => handleModeChange('long-break')}
						getStyle={getModeButtonStyle}
					/>
				</div>

				<motion.button
					whileHover={{ scale: 1.1, rotate: 15 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => setShowSettings(!showSettings)}
					className={`p-2 rounded-full cursor-pointer transition-colors ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
				>
					<FiSettings className={getTextStyle()} />
				</motion.button>
			</div>

			{/* Timer Display */}
			<div className="relative mt-4">
				<TimerDisplay
					timeLeft={timeLeft}
					progress={progress}
					mode={mode}
					theme={theme}
					getProgressColor={getProgressColor}
					getTextStyle={getTextStyle}
					cycles={cycles}
					cyclesBeforeLongBreak={settings.cyclesBeforeLongBreak}
				/>

				{/* Control buttons */}
				<div className="flex justify-center space-x-4 mt-0.5">
					{isRunning ? (
						<ControlButton
							icon={<FiPause />}
							onClick={handlePause}
							color="bg-red-500 hover:bg-red-600"
						/>
					) : (
						<ControlButton
							icon={<FiPlay />}
							onClick={handleStart}
							color={`bg-${modeColors[mode].accent} hover:bg-${modeColors[mode].accent.replace('500', '600')}`}
						/>
					)}

					<ControlButton
						icon={<FiRefreshCw />}
						onClick={handleReset}
						color={
							theme === 'light'
								? 'bg-gray-800 text-gray-600 hover:bg-gray-600'
								: 'bg-gray-700 text-gray-300 hover:bg-gray-600'
						}
					/>

					{mode.includes('break') && (
						<ControlButton
							icon={<FiCheckCircle />}
							onClick={() => handleModeChange('work')}
							color="bg-blue-500 hover:bg-blue-600"
						/>
					)}

					{mode === 'work' && (
						<ControlButton
							icon={<FiCoffee />}
							onClick={() => handleModeChange('short-break')}
							color="bg-green-500 hover:bg-green-600"
						/>
					)}
				</div>
			</div>

			{/* Settings panel */}
			<PomodoroSettingsPanel
				isOpen={showSettings}
				onClose={() => setShowSettings(false)}
				settings={settings}
				onUpdateSettings={handleUpdateSettings}
				onReset={handleReset}
				getTextStyle={getTextStyle}
				getInputStyle={getInputStyle}
				theme={theme}
			/>
		</motion.div>
	)
}
