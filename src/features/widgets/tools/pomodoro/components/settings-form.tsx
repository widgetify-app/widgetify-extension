import type { ReactNode } from 'react'
import { ToggleSwitch } from '@/components/ui'
import { Icon } from '@/icons'
import { stepDuration } from '../../utils/pomodoro-time'
import type { PomodoroSettings } from '../types'

interface PomodoroSettingsFormProps {
	settings: PomodoroSettings
	onChange: (settings: PomodoroSettings) => void
}

export function PomodoroSettingsForm({ settings, onChange }: PomodoroSettingsFormProps) {
	const update = (next: Partial<PomodoroSettings>) => onChange({ ...settings, ...next })

	return (
		<ul className="flex flex-col divide-y rounded-2xl bg-fill divide-line">
			<SettingRow label="زمان کار">
				<DurationStepper
					label="زمان کار"
					value={settings.workTime}
					min={5}
					max={90}
					step={5}
					onChange={(workTime) => update({ workTime })}
				/>
			</SettingRow>
			<SettingRow label="استراحت">
				<DurationStepper
					label="زمان استراحت"
					value={settings.shortBreakTime}
					min={1}
					max={30}
					step={1}
					onChange={(shortBreakTime) => update({ shortBreakTime })}
				/>
			</SettingRow>
			<SettingRow label="هشدار صوتی" description="آخر هر دور کار یه صدا پخش می‌شه">
				<ToggleSwitch
					label="هشدار صوتی"
					enabled={settings.alarmEnabled}
					onToggle={() => update({ alarmEnabled: !settings.alarmEnabled })}
				/>
			</SettingRow>
		</ul>
	)
}

interface SettingRowProps {
	label: string
	description?: string
	children: ReactNode
}

function SettingRow({ label, description, children }: SettingRowProps) {
	return (
		<li className="flex items-center gap-3 px-3 py-2 min-h-12">
			<span className="flex flex-col flex-1 min-w-0 leading-control">
				<span className="text-xs font-semibold text-fg-strong">{label}</span>
				{description && (
					<span className="text-3xs text-fg-muted">{description}</span>
				)}
			</span>
			{children}
		</li>
	)
}

interface DurationStepperProps {
	label: string
	value: number
	min: number
	max: number
	step: number
	onChange: (value: number) => void
}

function DurationStepper({
	label,
	value,
	min,
	max,
	step,
	onChange,
}: DurationStepperProps) {
	const change = (direction: 1 | -1) =>
		onChange(stepDuration(value, direction * step, min, max))

	return (
		<span className="flex items-center gap-1 shrink-0">
			<StepButton
				icon="plus"
				label={`بیشتر کردن ${label}`}
				disabled={value >= max}
				onClick={() => change(1)}
			/>
			<output
				aria-live="polite"
				aria-label={`${label}: ${value} دقیقه`}
				className="w-14 text-xs font-bold text-center tabular-nums text-fg-strong"
			>
				{value} دقیقه
			</output>
			<StepButton
				icon="minus"
				label={`کمتر کردن ${label}`}
				disabled={value <= min}
				onClick={() => change(-1)}
			/>
		</span>
	)
}

interface StepButtonProps {
	icon: 'plus' | 'minus'
	label: string
	disabled: boolean
	onClick: () => void
}

function StepButton({ icon, label, disabled, onClick }: StepButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-label={label}
			className="grid rounded-lg cursor-pointer place-items-center size-7 bg-surface text-fg-muted transition-ui hover:text-fg-strong active:scale-95 focus-visible:focus-ring disabled:cursor-default disabled:opacity-40 disabled:active:scale-100"
		>
			<Icon name={icon} size={14} aria-hidden="true" />
		</button>
	)
}
