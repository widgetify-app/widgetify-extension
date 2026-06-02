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

export function showToast(
	message: React.ReactNode | string,
	type: ToastType,
	options?: ToastOptions
) {
	const tt = TT[type]

	toast.custom(
		(t) => (
			<div
				className={`
  flex items-center gap-3
  bg-base-100 border  border-base-300 border-r-4
  ${tt.borderColor} bg-glass shadow-md
  rounded-xl px-3.5 py-3 w-[320px]
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
