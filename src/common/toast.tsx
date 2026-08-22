import type React from 'react'
import type { ReactNode } from 'react'
import toast from 'react-hot-toast'
import { playAlarm } from './play-alarm'
import { translateError } from '@/common/utils/translate-error'
import { Icon } from '../icons'
import { cn } from '@/common/utils/cn'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastOptions {
	duration?: number
	position?:
		| 'top-left'
		| 'top-center'
		| 'top-right'
		| 'bottom-left'
		| 'bottom-center'
		| 'bottom-right'
	alarmSound?: boolean
	sound?: boolean
	title?: string
	actionText?: string
	onAction?: () => void
}

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
	if (typeof window === 'undefined') return null
	try {
		const AudioContextClass =
			window.AudioContext ||
			(window as unknown as { webkitAudioContext: typeof AudioContext })
				.webkitAudioContext
		if (!AudioContextClass) return null
		if (!audioCtx || audioCtx.state === 'closed') {
			audioCtx = new AudioContextClass()
		}
		if (audioCtx.state === 'suspended') {
			audioCtx.resume().catch(() => {})
		}
		return audioCtx
	} catch {
		return null
	}
}

export const TOAST_SOUND_VOLUME = 0.55

export function playNativeToastSound(
	type: ToastType,
	volume: number = TOAST_SOUND_VOLUME
) {
	try {
		const ctx = getAudioContext()
		if (!ctx) return

		const now = ctx.currentTime

		if (type === 'success') {
			const osc1 = ctx.createOscillator()
			const osc2 = ctx.createOscillator()
			const gain = ctx.createGain()

			osc1.type = 'sine'
			osc2.type = 'triangle'

			osc1.frequency.setValueAtTime(523.25, now)
			osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.12)

			osc2.frequency.setValueAtTime(659.25, now)
			osc2.frequency.exponentialRampToValueAtTime(1046.5, now + 0.15)

			gain.gain.setValueAtTime(0.001, now)
			gain.gain.linearRampToValueAtTime(volume, now + 0.02)
			gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32)

			osc1.connect(gain)
			osc2.connect(gain)
			gain.connect(ctx.destination)

			osc1.start(now)
			osc2.start(now)
			osc1.stop(now + 0.32)
			osc2.stop(now + 0.32)
		} else if (type === 'error') {
			const osc = ctx.createOscillator()
			const gain = ctx.createGain()

			osc.type = 'sawtooth'
			osc.frequency.setValueAtTime(260, now)
			osc.frequency.linearRampToValueAtTime(170, now + 0.16)

			gain.gain.setValueAtTime(0.001, now)
			gain.gain.linearRampToValueAtTime(volume * 0.85, now + 0.02)
			gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24)

			osc.connect(gain)
			gain.connect(ctx.destination)

			osc.start(now)
			osc.stop(now + 0.24)
		} else if (type === 'warning') {
			const osc = ctx.createOscillator()
			const gain = ctx.createGain()

			osc.type = 'sine'
			osc.frequency.setValueAtTime(440, now)
			osc.frequency.setValueAtTime(554.37, now + 0.08)

			gain.gain.setValueAtTime(0.001, now)
			gain.gain.linearRampToValueAtTime(volume, now + 0.02)
			gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26)

			osc.connect(gain)
			gain.connect(ctx.destination)

			osc.start(now)
			osc.stop(now + 0.26)
		} else {
			const osc = ctx.createOscillator()
			const gain = ctx.createGain()

			osc.type = 'sine'
			osc.frequency.setValueAtTime(587.33, now)
			osc.frequency.exponentialRampToValueAtTime(880, now + 0.08)

			gain.gain.setValueAtTime(0.001, now)
			gain.gain.linearRampToValueAtTime(volume * 0.9, now + 0.015)
			gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22)

			osc.connect(gain)
			gain.connect(ctx.destination)

			osc.start(now)
			osc.stop(now + 0.22)
		}
	} catch {}
}

const TOAST_THEMES: Record<
	ToastType,
	{
		container: string
		icon: ReactNode
		defaultTitle: string
		defaultActionText: string
		messageClass: string
	}
> = {
	info: {
		container: 'bg-[#18181b]/95 border-white/10 text-white',
		icon: (
			<div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white/10 text-white select-none">
				<Icon name="atSign" size={15} />
			</div>
		),
		defaultTitle: 'اطلاعات',
		defaultActionText: 'متوجه شدم',
		messageClass: 'text-neutral-300',
	},
	error: {
		container: 'bg-[#2a1317]/95 border-red-500/25 text-white',
		icon: (
			<div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-red-500 text-white shadow-sm select-none">
				<Icon name="exclamation" size={13} />
			</div>
		),
		defaultTitle: 'خطا',
		defaultActionText: 'تلاش مجدد',
		messageClass: 'text-red-200/85',
	},
	success: {
		container: 'bg-[#142618]/95 border-emerald-500/25 text-white',
		icon: (
			<div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#22c55e] text-black shadow-sm select-none">
				<Icon name="check" size={15} className="stroke-[3]" />
			</div>
		),
		defaultTitle: 'موفقیت آمیز',
		defaultActionText: 'تایید',
		messageClass: 'text-emerald-200/85',
	},
	warning: {
		container: 'bg-[#2b2210]/95 border-amber-500/25 text-white',
		icon: (
			<div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-amber-500 text-black shadow-sm select-none">
				<Icon name="exclamation" size={13} />
			</div>
		),
		defaultTitle: 'هشدار',
		defaultActionText: 'متوجه شدم',
		messageClass: 'text-amber-200/85',
	},
}

export function showToast(
	message: string,
	type: ToastType = 'info',
	options?: ToastOptions
) {
	const theme = TOAST_THEMES[type] || TOAST_THEMES.info
	const title = options?.title ?? theme.defaultTitle
	const actionText = options?.actionText ?? theme.defaultActionText

	if (options?.sound !== false) {
		playNativeToastSound(type)
	}

	if (options?.alarmSound) {
		playAlarm('success')
	}

	return toast.custom(
		(t) => {
			const handleAction = () => {
				toast.remove(t.id, t.toasterId)
				if (options?.onAction) {
					options.onAction()
				}
			}

			return (
				<div
					dir="rtl"
					className={cn(
						'w-full max-w-[390px] min-w-[320px] rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xl backdrop-blur-xl border select-none transition-all duration-200',
						theme.container,
						t.visible ? 'animate-enter' : 'animate-leave'
					)}
				>
					<div className="flex items-center gap-3 min-w-0 flex-1">
						{theme.icon}
						<div className="min-w-0 flex-1">
							<p className="text-sm font-bold text-white leading-tight m-0 truncate">
								{title}
							</p>
							{message && (
								<p
									className={cn(
										'text-xs font-normal leading-relaxed m-0 mt-0.5 break-words line-clamp-2',
										theme.messageClass
									)}
								>
									{message}
								</p>
							)}
						</div>
					</div>

					<button
						type="button"
						onClick={handleAction}
						className="shrink-0 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold text-white transition-all cursor-pointer select-none"
					>
						{actionText}
					</button>
				</div>
			)
		},
		{
			duration: options?.duration ?? 5000,
			position: options?.position ?? 'top-center',
		}
	)
}

export function showCustomToast(
	message: React.ReactNode | string,
	options?: ToastOptions
) {
	if (options?.sound !== false) {
		playNativeToastSound('info')
	}
	if (options?.alarmSound) {
		playAlarm('success')
	}

	return toast.custom(() => <>{message}</>, {
		duration: options?.duration ?? 5000,
		position: options?.position ?? 'top-center',
	})
}

export function showPreviewToast(itemName: string, onCancel: () => void): string {
	const id = `preview-${Date.now()}`

	playNativeToastSound('info')

	toast.custom(
		(t) => (
			<div
				className={cn(
					' rounded-2xl p-2.5 flex items-center justify-between gap-3 shadow-2xl backdrop-blur-xl border border-white/15 bg-[#18181b]/95 text-white select-none transition-all duration-200',
					t.visible ? 'animate-enter' : 'animate-leave'
				)}
			>
				<div className="flex items-center gap-3 min-w-0 flex-1">
					<div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary/20 text-primary font-bold text-sm">
						<Icon name="info" size={16} />
					</div>
					<div className="min-w-0 flex-1">
						<p className="text-[10px] text-white/50 leading-none m-0 mb-0.5">
							حالت پیش‌نمایش
						</p>
						<p className="text-sm font-bold text-white m-0 truncate">
							{itemName}
						</p>
					</div>
				</div>

				<button
					type="button"
					onClick={() => {
						toast.remove(id)
						onCancel()
					}}
					className="shrink-0 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-300 active:scale-95 text-xs font-semibold text-white transition-all cursor-pointer select-none flex items-center gap-1"
				>
					<Icon name="close" size={11} />
					<span>بازگشت</span>
				</button>
			</div>
		),
		{ id, duration: Infinity, position: 'top-left' }
	)

	return id
}

export function autoFormatErrorToast(err: any) {
	const message = translateError(err)
	showToast(
		typeof message === 'string'
			? message
			: `${Object.keys(message)[0]}: ${Object.values(message)[0]}`,
		'error'
	)
}
