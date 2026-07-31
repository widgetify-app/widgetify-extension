import { useEffect, useState } from 'react'
import { Button } from './button/button'
import Modal from './modal'

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
	const videoRef = useRef<HTMLVideoElement>(null)
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

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={'🌊 موج؛ آپدیت جدید ویجتیفای'}
			size="lg"
			direction="rtl"
			closeOnBackdropClick={false}
		>
			<div className="flex flex-col max-h-[80vh]">
				<div className="pb-2 space-y-4 overflow-y-auto h-110">
					<div className="relative w-full overflow-hidden border shadow-inner rounded-2xl bg-base-300/20 border-base-300">
						<img
							src={'https://cdn.widgetify.ir/extension/mooj_update.jpg'}
							className="object-center w-full max-h-70 rounded-2xl"
						/>
					</div>

					<div className="p-2 space-y-1.5 border rounded-2xl bg-base-300/20 border-base-300/10">
						<div className="flex items-center gap-2">
							<h3 className="text-sm font-black text-content">
								موج، روان‌تر از همیشه! 🌊
							</h3>
						</div>

						<p className="text-xs leading-6 text-muted">
							این بار بیشتر از اضافه کردن قابلیت‌های جدید، تمرکزمان روی{' '}
							<span className="font-bold text-content">
								سریع‌تر، روان‌تر و لذت‌بخش‌تر شدن ویجتیفای
							</span>{' '}
							بوده تا تجربه بهتری از هر بار باز کردن تب جدید داشته باشی.
						</p>

						<p className="text-xs leading-6 text-muted">
							از حالا می‌تونی{' '}
							<span className="font-bold text-content">
								بوکمارک‌های مرورگرت رو مستقیما هنگام ساخت بوکمارک درون‌ریزی
								(import) کنی
							</span>
							؛ بدون اینکه لازم باشه دوباره همه چیز رو از اول اضافه کنی.
						</p>
						<p className="text-xs leading-6 text-muted">
							همچنین قابلیت{' '}
							<span className="font-bold text-content">حالت بهینه</span> هم
							اضافه شده که می‌تونی از بخش{' '}
							<span className="font-bold text-content">
								تنظیمات ← عمومی
							</span>{' '}
							فعال یا غیرفعالش کنی. با فعال بودن این حالت، انیمیشن‌ها و
							افکت‌ها کاهش پیدا می‌کنن تا ویجتیفای روان‌تر اجرا بشه.
						</p>

						<p className="text-xs leading-6 text-muted">
							در کنار این‌ها،{' '}
							<span className="font-bold text-content">
								بهبودهای ظاهری و بهینه‌سازی‌های متعددی
							</span>{' '}
							انجام شده تا همه چیز مثل یک موج، نرم و بدون وقفه پیش بره 😅
						</p>
					</div>
					<div className="flex items-center justify-center gap-2 py-1 text-muted">
						💙<span className="text-xs">دمت گرم که همراه مایی</span>
					</div>
				</div>

				<div className="flex items-center justify-end w-full px-4 py-2 border border-t border-base-300/10 bg-base-200/40 rounded-3xl">
					<Button
						size="sm"
						onClick={onClose}
						disabled={counter > 0}
						className="min-w-32.5 h-11 rounded-2xl! self-end font-black text-xs shadow-lg shadow-primary/10 disabled:shadow-none active:scale-90 transition-all disabled:text-base-content/30"
						isPrimary={true}
					>
						{counter > 0 ? `یه چند لحظه صبر کن (${counter})` : 'فهمیدم'}
					</Button>
				</div>
			</div>
		</Modal>
	)
}
