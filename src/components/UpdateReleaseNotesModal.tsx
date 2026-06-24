import { useEffect, useState } from 'react'
import { RiCheckboxCircleLine, RiThumbUpLine } from 'react-icons/ri'
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
			title={'🥳 نسخه جدید، آمادست!'}
			size="lg"
			direction="rtl"
			closeOnBackdropClick={false}
		>
			<div className="flex flex-col max-h-[80vh]">
				<div className="flex items-center justify-between px-1 pb-1">
					<div className="flex flex-col">
						<p className="mt-1 text-xs font-medium text-muted">
							آپدیت جدید، با ویجت جدید رسید! (نسخه آزمایشی)
						</p>
					</div>
				</div>

				<div className="pb-2 space-y-4 overflow-y-auto h-110">
					<div className="relative w-full overflow-hidden border shadow-inner rounded-2xl bg-base-300/20 border-base-300">
						<img
							src={'https://cdn.widgetify.ir/extension/habit_tracker.png'}
							className="object-center w-full max-h-70 rounded-2xl"
						/>
					</div>

					<div className="p-2 space-y-3 border rounded-2xl bg-base-300/20 border-base-300/10">
						<div className="flex items-center gap-2">
							<h3 className="text-sm font-black text-content">
								ویجت عادت‌ها (Habit Tracker) اضافه شد!
							</h3>
						</div>

						<p className="text-xs leading-6 text-muted">
							از امروز می‌تونی{' '}
							<span className="font-bold text-content">
								عادت‌های روزانه‌ات رو ثبت و دنبال کنی
							</span>
							. هر روز که به هدفت پایبند باشی، زنجیره عادتت کامل‌تر میشه و
							پیشرفتت همیشه جلوی چشمت خواهد بود.
						</p>

						<ul className="space-y-1">
							{[
								'ثبت و پیگیری عادت‌های روزانه',
								'مشاهده میزان پایبندی و استریک‌ها',
								'اضافه کردن چندین عادت در یک ویجت',
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
					</div>

					<div className="flex items-center justify-center gap-2 py-1 text-muted">
						<RiThumbUpLine size={14} />
						<span className="text-xs">دمت گرم که همراه مایی</span>
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
