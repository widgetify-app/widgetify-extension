import React from 'react'
import toast from 'react-hot-toast'
import { playAlarm } from './playAlarm'
import { TfiCheck, TfiInfo } from 'react-icons/tfi'
import { LuX } from 'react-icons/lu'
import { MdError } from 'react-icons/md'

type ToastType = 'success' | 'error' | 'info'
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
}

const TT: Record<ToastType, any> = {
	success: {
		container: 'bg-success/90 outline-success/20',
		message: 'text-white/80',
		closeButton: 'text-white/80 bg-green-100/15',
		iconDiv: 'bg-success-content/10',
		icon: <TfiCheck size={18} />,
	},
	error: {
		container: 'bg-error outline-error/20 shadow-xl',
		message: 'text-white/80',
		closeButton: 'text-red-100 bg-red-100/15',
		iconDiv: 'bg-error-content/10 text-error-content',
		icon: <MdError size={18} />,
	},
	info: {
		container: 'bg-info/90 outline-info/20 shadow',
		message: 'text-white/80',
		closeButton: 'text-white/80 bg-green-100/15',
		iconDiv: 'bg-info-content/10',
		icon: <TfiInfo size={18} />,
	},
}
export function showToast(
	message: React.ReactNode | string,
	type: ToastType,
	options?: ToastOptions
) {
	if (typeof message === 'string' && type) {
		toast.custom(
			(t) => (
				<div
					className={`${
						t.visible ? 'animate-enter' : 'animate-leave'
					} ${TT[type].container}  shadow-lg rounded-4xl flex items-center w-80 gap-2.5 p-3 outline-2 outline-offset-1 max-w-sm backdrop-blur-xs`}
				>
					<div
						className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0  ${TT[type].iconDiv}`}
					>
						{TT[type].icon}
					</div>
					<p className={`flex-1 text-xs font-medium ${TT[type].message}`}>
						{message}
					</p>
					<button
						onClick={() => toast.remove(t.id, t.toasterId)}
						className={`flex-shrink-0 ${TT[type].closeButton} p-1.5 mr-2 transition-opacity rounded-full cursor-pointer  hover:opacity-80`}
					>
						<LuX size={18} className="" />
					</button>
				</div>
			),
			{
				duration: options?.duration ?? 5000,
				position: options?.position,
			}
		)
	} else {
		if (React.isValidElement(message))
			toast.custom(
				(t) => (
					<div
						className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full`}
					>
						{message}
					</div>
				),
				options
			)
	}

	if (options?.alarmSound) {
		playAlarm('success')
	}
}
