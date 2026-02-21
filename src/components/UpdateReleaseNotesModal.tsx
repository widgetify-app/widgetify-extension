import { useEffect, useState } from 'react'
import { RiCheckboxCircleLine, RiThumbUpLine, RiLayoutLine } from 'react-icons/ri'
import { Button } from './button/button'
import Modal from './modal'
import { ConfigKey } from '@/common/constant/config.key'
import { callEvent } from '@/common/utils/call-event'
import { useAuth } from '@/context/auth.context'
import Analytics from '@/analytics'
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
			<div className="flex flex-col max-h-[80vh]">
				<div className="flex items-center justify-between px-1 pb-1">
					<div className="flex flex-col">
						<p className="mt-1 text-xs font-medium text-muted">
							آپدیت جدید به مناسبت ۱ سالگی ویجتیفای 🎂
						</p>
					</div>
				</div>

				<div className="pb-2 space-y-4 overflow-y-auto h-110">
					<div className="relative w-full overflow-hidden border-2 shadow-inner rounded-2xl bg-base-300/20 border-base-300">
						<video
							ref={videoRef}
							src={'https://cdn.widgetify.ir/extension/new_ui_update.mp4'}
							autoPlay
							muted
							loop
							playsInline
							className="object-cover w-full max-h-70 rounded-2xl"
						/>
						<div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
							<span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
							<span className="text-[10px] font-bold text-white/80">
								آموزش تغییر رابط کاربری
							</span>
						</div>
					</div>

					<div className="p-4 space-y-3 border rounded-2xl bg-base-300/20 border-base-300/10">
						<div className="flex items-center gap-2">
							<RiLayoutLine className="text-primary shrink-0" size={20} />
							<h3 className="text-sm font-black text-content">
								رابط کاربری تازه از راه رسید!
							</h3>
						</div>
						<p className="text-xs leading-6 text-muted">
							یه{' '}
							<span className="font-bold text-content">
								ظاهر و چیدمان تازه
							</span>{' '}
							به ویجیتفای اضافه کردیم! رابط قبلی سر جاشه، فقط حالا می‌تونی
							بین دو سبک مختلف جابه‌جا بشی و اونی که بیشتر به کارت میاد رو
							انتخاب کنی.
						</p>
						<ul className="space-y-1">
							{[
								'رابط قبلی همچنان در دسترسه',
								'یه رابط جدید با حس‌وحال متفاوت',
								'تغییر سریع از مسیر تنظیمات ← ظاهر',
							].map((item, i) => (
								<li
									key={i}
									className="flex items-center gap-2 text-xs text-muted"
								>
									<RiCheckboxCircleLine
										className="text-green-500 shrink-0"
										size={14}
									/>
									{item}
								</li>
							))}
						</ul>

						{isAuthenticated && (
							<button
								onClick={handleActivate}
								disabled={activated}
								className={`w-full py-2.5 rounded-xl cursor-pointer text-xs font-black transition-all active:scale-95 border ${
									activated
										? 'bg-green-500/10 border-green-500/30 text-green-500 cursor-default'
										: 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20'
								}`}
							>
								{activated ? (
									<span className="flex items-center justify-center gap-2">
										<RiCheckboxCircleLine size={14} />
										رابط جدید فعاله!
									</span>
								) : (
									<span className="flex items-center justify-center gap-2">
										همین الان امتحانش کن
									</span>
								)}
							</button>
						)}
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
						className="min-w-[130px] h-11 !rounded-2xl font-black text-xs shadow-lg shadow-primary/10 disabled:shadow-none active:scale-90 transition-all disabled:text-base-content/30"
						isPrimary={true}
					>
						{counter > 0 ? `یه چند لحظه صبر کن (${counter})` : 'فهمیدم'}
					</Button>
				</div>
			</div>
		</Modal>
	)
}
