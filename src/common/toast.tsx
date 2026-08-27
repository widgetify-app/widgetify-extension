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

function playTone(
	ctx: AudioContext,
	freq: number,
	start: number,
	duration: number,
	vol: number,
	type: OscillatorType = 'sine',
	endFreq?: number
) {
	const osc = ctx.createOscillator()
	const gain = ctx.createGain()

	osc.type = type
	osc.frequency.setValueAtTime(Math.max(1, freq), start)
	if (endFreq && endFreq > 0) {
		osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), start + duration)
	}

	gain.gain.setValueAtTime(0.0001, start)
	gain.gain.linearRampToValueAtTime(vol, start + 0.008)
	gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)

	osc.connect(gain)
	gain.connect(ctx.destination)

	osc.start(start)
	osc.stop(start + duration)
}

export function playNativeToastSound(
	type: ToastType,
	volume: number = TOAST_SOUND_VOLUME
) {
	try {
		const ctx = getAudioContext()
		if (!ctx) return

		const now = ctx.currentTime

		if (type === 'success') {
			playTone(ctx, 784, now, 0.28, volume * 0.65, 'sine')
			playTone(ctx, 1568, now, 0.22, volume * 0.18, 'triangle')
			playTone(ctx, 1046.5, now + 0.08, 0.38, volume * 0.8, 'sine')
			playTone(ctx, 1318.5, now + 0.08, 0.32, volume * 0.3, 'sine')
			playTone(ctx, 2093, now + 0.08, 0.26, volume * 0.18, 'triangle')
		} else if (type === 'error') {
			playTone(ctx, 200, now, 0.1, volume * 0.6, 'sine', 150)
			playTone(ctx, 150, now + 0.09, 0.14, volume * 0.7, 'sine', 100)
		} else if (type === 'warning') {
			playTone(ctx, 587.33, now, 0.18, volume * 0.55, 'sine')
			playTone(ctx, 880, now + 0.07, 0.26, volume * 0.7, 'sine')
			playTone(ctx, 1760, now + 0.07, 0.18, volume * 0.14, 'triangle')
		} else {
			playTone(ctx, 1100, now, 0.035, volume * 0.5, 'sine', 740)
			playTone(ctx, 784, now + 0.015, 0.2, volume * 0.65, 'sine')
			playTone(ctx, 1568, now + 0.015, 0.14, volume * 0.14, 'triangle')
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
			<div className="flex items-center justify-center w-8 h-8 text-white rounded-full select-none shrink-0 bg-white/10">
				<Icon name="atSign" size={15} />
			</div>
		),
		defaultTitle: 'نکته',
		defaultActionText: 'متوجه شدم',
		messageClass: 'text-neutral-300',
	},
	error: {
		container: 'bg-[#2a1317]/95 border-red-500/25 text-white',
		icon: (
			<div className="flex items-center justify-center w-8 h-8 text-white bg-red-500 rounded-full shadow-sm select-none shrink-0">
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
			<div className="flex items-center justify-center w-8 h-8 text-black rounded-full shadow-sm select-none shrink-0 bg-amber-500">
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
					<div className="flex items-center flex-1 min-w-0 gap-3">
						{theme.icon}
						<div className="flex-1 min-w-0">
							<p className="m-0 text-sm font-bold leading-tight text-white truncate">
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
				<div className="flex items-center flex-1 min-w-0 gap-3">
					<div className="flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full shrink-0 bg-primary/20 text-primary">
						<Icon name="info" size={16} />
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-[10px] text-white/50 leading-none m-0 mb-0.5">
							حالت پیش‌نمایش
						</p>
						<p className="m-0 text-sm font-bold text-white truncate">
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
