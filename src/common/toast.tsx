import type React from 'react'
import toast from 'react-hot-toast'

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
}
export function showToast(
	message: React.ReactNode | string,
	type: ToastType,
	options?: ToastOptions
) {
	if (typeof message === 'string') {
		if (type === 'success') {
			toast.custom(
				(t) => (
					<div
						className={`${
							t.visible ? 'animate-enter' : 'animate-leave'
						} bg-success text-success-content shadow-lg rounded-2xl flex items-center gap-2.5 p-3 border border-success/20 max-w-sm backdrop-blur-xs`}
					>
						<div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full bg-success-content/10">
							<svg
								className="w-5 h-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
						<p className="flex-1 text-sm font-medium">{message}</p>
						<button
							onClick={() => toast.dismiss(t.id)}
							className="flex-shrink-0 transition-opacity opacity-60 hover:opacity-100"
							aria-label="بستن"
						>
							<svg
								className="w-4 h-4"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
					</div>
				),
				{
					duration: options?.duration ?? 5000,
					position: options?.position,
				}
			)
		} else if (type === 'error') {
			toast.custom(
				(t) => (
					<div
						className={`${
							t.visible ? 'animate-enter' : 'animate-leave'
						} bg-error text-error-content shadow-lg rounded-2xl flex items-center gap-2.5 p-3 border border-error/20 max-w-sm backdrop-blur-xs`}
					>
						<div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full bg-error-content/10">
							<svg
								className="w-5 h-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
						</div>
						<p className="flex-1 text-sm font-medium">{message}</p>
						<button
							onClick={() => toast.dismiss(t.id)}
							className="flex-shrink-0 transition-opacity cursor-pointer opacity-60 hover:opacity-100"
							aria-label="بستن"
						>
							<svg
								className="w-4 h-4"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
					</div>
				),
				{
					duration: options?.duration ?? 5000,
				}
			)
		} else if (type === 'info') {
			toast.custom(
				(t) => (
					<div
						className={`${
							t.visible ? 'animate-enter' : 'animate-leave'
						} bg-info text-info-content shadow-lg rounded-lg flex items-center gap-2.5 p-3 border border-info/20 max-w-sm`}
					>
						<div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full bg-info-content/10">
							<svg
								className="w-5 h-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<p className="flex-1 text-sm font-medium">{message}</p>
						<button
							onClick={() => toast.dismiss(t.id)}
							className="flex-shrink-0 transition-opacity opacity-60 hover:opacity-100"
							aria-label="بستن"
						>
							<svg
								className="w-4 h-4"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
					</div>
				),
				{
					duration: options?.duration ?? 5000,
				}
			)
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
