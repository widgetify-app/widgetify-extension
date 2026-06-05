import React, { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { createRoot } from 'react-dom/client'
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

// ─── Preview Banner ────────────────────────────────────────────────────────────
// از react-hot-toast فقط برای مدیریت id و lifecycle استفاده می‌کنیم.
// UI کاملاً مستقل است و از طریق Portal مستقیماً به body mount می‌شود.

const PREVIEW_PORTAL_ID = 'preview-banner-portal'

function getOrCreatePortalRoot(): HTMLElement {
	let el = document.getElementById(PREVIEW_PORTAL_ID)
	if (!el) {
		el = document.createElement('div')
		el.id = PREVIEW_PORTAL_ID
		// خارج از stack ترتیب DOM، همیشه روی همه چیز
		el.style.cssText =
			'position:fixed;bottom:0;left:0;right:0;z-index:9999;pointer-events:none'
		document.body.appendChild(el)
	}
	return el
}

interface PreviewBannerProps {
	itemName: string
	onCancel: () => void
	visible: boolean
}

function PreviewBanner({ itemName, onCancel, visible }: PreviewBannerProps) {
	return createPortal(
		<div
			dir="rtl"
			style={{
				pointerEvents: 'auto',
				transition: 'transform 0.35s cubic-bezier(.4,0,.2,1), opacity 0.25s ease',
				transform: visible ? 'translateY(0)' : 'translateY(110%)',
				opacity: visible ? 1 : 0,
			}}
			className="flex items-center justify-between max-w-sm gap-3 px-4 py-3 mx-auto mb-5 border shadow-xl w-fit rounded-2xl bg-base-100/90 border-base-content/10 backdrop-blur-md"
		>
			{/* نشانگر پیشنمایش */}
			<div className="flex items-center gap-2.5 min-w-0">
				<div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 shrink-0">
					<TiInfo className="text-base text-primary" />
					{/* نقطه چشمک‌زن */}
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

			{/* دکمه بازگشت */}
			<button
				onClick={onCancel}
				className="shrink-0 flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-xl bg-base-200 hover:bg-error/10 hover:text-error text-base-content/60 transition-all duration-150 cursor-pointer border border-base-content/8 active:scale-95"
			>
				<LuX size={11} />
				بازگشت
			</button>
		</div>,
		getOrCreatePortalRoot()
	)
}

// رندر/آنمونت بنر به صورت imperative (چون showPreviewToast تابع است، نه کامپوننت)
let previewBannerRoot: ReturnType<typeof createRoot> | null = null

function mountPreviewBanner(itemName: string, onCancel: () => void): void {
	const container = getOrCreatePortalRoot()
	if (!previewBannerRoot) {
		previewBannerRoot = createRoot(container)
	}

	// اول visible=false برای trigger انیمیشن ورود
	previewBannerRoot.render(
		<PreviewBanner itemName={itemName} onCancel={onCancel} visible={false} />
	)
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			previewBannerRoot?.render(
				<PreviewBanner itemName={itemName} onCancel={onCancel} visible={true} />
			)
		})
	})
}

function unmountPreviewBanner(): void {
	if (!previewBannerRoot) return
	// انیمیشن خروج، بعد unmount
	const container = document.getElementById(PREVIEW_PORTAL_ID)
	if (container) {
		previewBannerRoot.render(
			<PreviewBanner itemName="" onCancel={() => {}} visible={false} />
		)
		setTimeout(() => {
			previewBannerRoot?.unmount()
			previewBannerRoot = null
			container.remove()
		}, 380)
	}
}

export function showPreviewToast(itemName: string, onCancel: () => void): string {
	// یک id ساختگی می‌سازیم تا usePreviewHandler بتواند آن را مدیریت کند
	const id = `preview-${Date.now()}`

	const handleCancel = () => {
		unmountPreviewBanner()
		onCancel()
	}

	mountPreviewBanner(itemName, handleCancel)

	// یک toast نامرئی فقط برای نگه‌داشتن id در state
	toast.custom(() => <></>, { id, duration: Infinity })

	return id
}

// override toast.remove تا بنر را هم پاک کند
const originalToastRemove = toast.remove.bind(toast)
toast.remove = ((...args: Parameters<typeof toast.remove>) => {
	const [id] = args
	if (typeof id === 'string' && id.startsWith('preview-')) {
		unmountPreviewBanner()
	}
	return originalToastRemove(...args)
}) as typeof toast.remove

export function autoFormatErrorToast(err: any) {
	const message = translateError(err)
	showToast(
		typeof message === 'string'
			? message
			: `${Object.keys(message)[0]}: ${Object.values(message)[0]}`,
		'error'
	)
}
