import React, { ReactNode } from 'react'
import toast from 'react-hot-toast'
import { playAlarm } from './playAlarm'
import { translateError } from '@/utils/translate-error'
import { TfiAlert, TfiCheck } from 'react-icons/tfi'
import { TiInfo } from 'react-icons/ti'
import { LuX } from 'react-icons/lu'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastOptions {
	duration?: number
	position?:
		| 'top-left'
		| 'top-center'
		| 'top-right'
		| 'bottom-left'
		| 'bottom-center'
		| 'bottom-right'
	alarmSound?: boolean
	title?: string
}

const TT: Record<
	ToastType,
	{ borderColor: string; iconBg: string; iconColor: string; icon: ReactNode }
> = {
	success: {
		borderColor: 'border-r-success border-br-success',
		iconBg: 'bg-success/10',
		iconColor: 'text-success',
		icon: <TfiCheck />,
	},
	error: {
		borderColor: 'border-r-error',
		iconBg: 'bg-error/10',
		iconColor: 'text-error',
		icon: <TfiAlert />,
	},
	info: {
		borderColor: 'border-r-info',
		iconBg: 'bg-info/10',
		iconColor: 'text-info',
		icon: <TiInfo />,
	},
	warning: {
		borderColor: 'border-r-warning',
		iconBg: 'bg-warning/10',
		iconColor: 'text-warning',
		icon: <TfiAlert />,
	},
}

export function showToast(message: string, type: ToastType, options?: ToastOptions) {
	const tt = TT[type]

	const myToast = toast.custom(
		(t) => (
			<div
				className={`
  flex items-center gap-3
  bg-base-100 border  border-base-300 border-r-4
  ${tt.borderColor} bg-glass shadow-md
  rounded-2xl px-3.5 py-3 w-[320px]
  ${t.visible ? 'animate-enter' : 'animate-leave'}
`}
			>
				<div
					className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-sm ${tt.iconBg} ${tt.iconColor}`}
				>
					{tt.icon}
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-[13px] font-medium text-base-content m-0">
						{options?.title}
					</p>
					<p className="text-[12px] text-base-content/60 m-0">{message}</p>
				</div>
				<button
					onClick={() => toast.remove(t.id, t.toasterId)}
					className="rounded-full btn text-base-content/80 btn-xs btn-ghost"
				>
					<LuX size={15} className="" />
				</button>
			</div>
		),
		{ duration: options?.duration ?? 5000, position: options?.position }
	)

	if (options?.alarmSound) playAlarm('success')

	return myToast
}

export function showCustomToast(
	message: React.ReactNode | string,
	options?: ToastOptions
) {
	const myToast = toast.custom(() => <>{message}</>, {
		duration: options?.duration ?? 5000,
		position: options?.position,
	})

	if (options?.alarmSound) playAlarm('success')

	return myToast
}

export function showPreviewToast(itemName: string, onCancel: () => void): string {
	const id = `preview-${Date.now()}`

	toast.custom(
		(t) => (
			<div
				dir="rtl"
				className={`flex items-center justify-between gap-3 px-4 py-3 border shadow-xl rounded-2xl bg-glass bg-base-100/90 border-base-content/10 backdrop-blur-md ${t.visible ? 'animate-enter' : 'animate-leave'}`}
			>
				<div className="flex items-center gap-1.5 min-w-0">
					<div className="relative flex items-center justify-center w-6 h-6 rounded-xl bg-primary/10 shrink-0">
						<TiInfo className="text-base text-primary" />
						<span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
							<span className="absolute inline-flex w-full h-full rounded-full animate-ping bg-primary opacity-60" />
							<span className="relative inline-flex w-2 h-2 rounded-full bg-primary" />
						</span>
					</div>
					<div className="min-w-0">
						<p className="text-[10px] text-base-content/40 m-0 leading-none mb-0.5">
							حالت پیش‌نمایش
						</p>
						<p className="text-[13px] font-semibold text-base-content m-0 truncate max-w-[140px]">
							{itemName}
						</p>
					</div>
				</div>
				<button
					onClick={() => {
						toast.remove(id)
						onCancel()
					}}
					className="shrink-0 flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-xl bg-base-200 hover:bg-error/10 hover:text-error text-base-content/60 transition-all duration-150 cursor-pointer border border-base-content/8 active:scale-95"
				>
					<LuX size={11} />
					بازگشت
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
