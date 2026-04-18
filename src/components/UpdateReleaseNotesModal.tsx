import { useEffect, useState } from 'react'
import {
	RiCheckboxCircleLine,
	RiThumbUpLine,
	RiLayoutLine,
	RiSparklingLine,
	RiInformationLine,
} from 'react-icons/ri'
import { Button } from './button/button'
import Modal from './modal'
import { ConfigKey } from '@/common/constant/config.key'
import { callEvent } from '@/common/utils/call-event'
import { useAuth } from '@/context/auth.context'
import Analytics from '@/analytics'
import { BiMessageDetail } from 'react-icons/bi'
type MediaContent = {
	type: 'image' | 'video'
	url: string
	caption?: string
}

type ReleaseNote = {
	type: 'feature' | 'bugfix' | 'improvement' | 'info'
	title: string
	description: string
	media?: MediaContent[]
}

const VERSION_NAME = ConfigKey.VERSION_NAME
// ignore for this update
const releaseNotes: ReleaseNote[] = []

type UpdateReleaseNotesModalProps = {
	isOpen: boolean
	onClose: () => void
	counterValue: number | null
}

export const UpdateReleaseNotesModal = ({
	isOpen,
	onClose,
	counterValue,
}: UpdateReleaseNotesModalProps) => {
	const [counter, setCounter] = useState<number>(0)
	const [activated, setActivated] = useState<boolean>(false)
	const videoRef = useRef<HTMLVideoElement>(null)
	const { isAuthenticated } = useAuth()
	useEffect(() => {
		if (isOpen && counterValue !== null) {
			setCounter(counterValue === null ? 10 : counterValue)
			const interval = setInterval(() => {
				setCounter((prev) => {
					if (prev <= 1) {
						clearInterval(interval)
						return 0
					}
					return prev - 1
				})
			}, 1000)
			return () => clearInterval(interval)
		} else {
			setCounter(0)
		}
	}, [isOpen])

	useEffect(() => {
		if (isOpen && videoRef.current) {
			videoRef.current.play().catch(() => {})
		}
	}, [isOpen])

	const handleActivate = () => {
		callEvent('ui_change', 'SIMPLE')
		setActivated(true)
		Analytics.event('release_modal_active_ui')
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={'🥳 نسخه جدید، آمادست!'}
			size="lg"
			direction="rtl"
			closeOnBackdropClick={false}
		>
			<div className="flex flex-col max-h-[50vh]">
				<div className="flex items-center justify-between px-1 pb-2 border-b border-base-200">
					<div className="flex flex-col gap-1">
						<p className="text-xs font-medium text-content">
							{VERSION_NAME}، آپدیت جدید از دل سختی‌ها رسید...
						</p>
					</div>
				</div>

				<div className="pb-2 mt-4 space-y-4 overflow-y-auto h-110">
					<div className="p-4 space-y-3 border rounded-2xl bg-base-300/20 border-base-300/30">
						<div className="flex items-center gap-2">
							<BiMessageDetail className="text-primary" size={18} />
							<h3 className="text-sm font-black">ویژگی‌های جدید</h3>
						</div>

						<div className="flex flex-wrap gap-2">
							{[
								'موتورهای جستجوگر قابل تغییر',
								'برنامه‌های داخلی',
								'خرید ویج‌کوین',
								'بهبود ظاهری',
								'تم یخی بهتر شده',
								'بهبود عملکرد',
								'بهبود صفحه کاوش',
							].map((item, i) => (
								<span
									key={i}
									className="px-2 py-1 text-[11px] rounded-lg bg-base-300/40 text-base-content/90 border border-base-300/20"
								>
									{item}
								</span>
							))}
						</div>
					</div>

					<div className="p-4 space-y-2 border rounded-2xl bg-primary/5 border-primary/10">
						<div className="flex items-center gap-2">
							<RiInformationLine className="text-primary" size={18} />
							<h3 className="text-sm font-black">نکته مهم این آپدیت</h3>
						</div>

						<p className="text-xs leading-6 text-muted">
							این نسخه در شرایط سخت و با محدودیت‌های زیاد توسعه داده شده.
							ممکنه در بعضی بخش‌ها بهینه‌سازی‌های بعدی هم اضافه بشه.
						</p>
					</div>

					<div className="flex items-center justify-center gap-2 py-1 text-muted">
						<RiThumbUpLine size={14} />
						<span className="text-xs">دمت گرم که همراه مایی</span>
					</div>
				</div>

				<div className="flex items-center justify-between px-4 py-2 border border-t border-base-300/10 bg-base-200/40 rounded-3xl">
					<a
						href="https://feedback.widgetify.ir"
						target="_blank"
						rel="noreferrer"
						className="text-[10px] font-black text-muted hover:text-content transition-all underline decoration-dotted underline-offset-4"
					>
						پیشنهاد یا گزارش مشکل
					</a>

					<Button
						size="sm"
						onClick={onClose}
						disabled={counter > 0}
						className="min-w-[130px] h-11 !rounded-2xl font-black text-xs"
						isPrimary
					>
						{counter > 0 ? `یه چند لحظه صبر کن (${counter})` : 'فهمیدم'}
					</Button>
				</div>
			</div>
		</Modal>
	)
}
