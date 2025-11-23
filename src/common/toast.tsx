import type React from 'react'
import toast from 'react-hot-toast'

type ToastType = 'success' | 'error' | 'info'
interface ToastOptions {
	duration?: number
}
export function showToast(
	message: React.ReactNode | string,
	type: ToastType,
	options?: ToastOptions
) {
	if (typeof message === 'string') {
		if (type === 'success') {
			toast.success(message, {
				duration: options?.duration ?? 5000,
				style: { maxWidth: '400px', fontFamily: 'inherit' },
				className: '!bg-success !text-success-content !font-bold',
			})
		} else if (type === 'error') {
			toast.error(message, {
				duration: options?.duration ?? 5000,
				style: { maxWidth: '400px', fontFamily: 'inherit' },
				className: '!bg-error !text-error-content !font-bold',
			})
		} else if (type === 'info') {
			toast(message)
		}
	} else {
		toast.custom((t) => (
			<div
				className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
			>
				<div className="flex-1 w-0 p-4">
					<div className="flex items-start">
						<div className="flex-1 ml-3">{message}</div>
					</div>
				</div>
			</div>
		))
	}
}
