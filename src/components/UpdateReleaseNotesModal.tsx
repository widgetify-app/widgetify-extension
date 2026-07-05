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
			title={'🪁 بادبادک؛ نسخه جدید ویجتیفای'}
			size="lg"
			direction="rtl"
			closeOnBackdropClick={false}
		>
			<div className="flex flex-col max-h-[80vh]">
				<div className="pb-2 space-y-4 overflow-y-auto h-110">
					<div className="relative w-full overflow-hidden border shadow-inner rounded-2xl bg-base-300/20 border-base-300">
						<img
							src={'https://cdn.widgetify.ir/extension/badbodak-update.jpg'}
							className="object-center w-full max-h-70 rounded-2xl"
						/>
					</div>

					<div className="p-2 space-y-1.5 border rounded-2xl bg-base-300/20 border-base-300/10">
						<div className="flex items-center gap-2">
							<h3 className="text-sm font-black text-content">
								بادبادک، پر از بهبودهای دوست‌داشتنی! 🪁
							</h3>
						</div>

						<p className="text-xs leading-6 text-muted">
							از این نسخه می‌تونی{' '}
							<span className="font-bold text-content">
								والپیپرهای دلخواهت رو کاملا رایگان از بین عکس‌های خودت
							</span>
							؛ بدون هیچ محدودیتی انتخاب کنی!
						</p>

						<p className="text-xs leading-6 text-muted">
							همچنین{' '}
							<span className="font-bold text-content">
								ظاهر ویجت عادت‌ها (Habit Tracker)
							</span>{' '}
							بازطراحی شده، ظاهر ساده ویجتیفای بهبود پیدا کرده و عملکرد کلی
							افزونه هم روان‌تر شده.
						</p>

						<p className="text-xs leading-6 text-muted">
							علاوه بر این، مشکل نمایش{' '}
							<span className="font-bold text-content">
								عنوان بوکمارک‌ها
							</span>{' '}
							هم برطرف شده تا تجربه بهتری داشته باشی.
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
