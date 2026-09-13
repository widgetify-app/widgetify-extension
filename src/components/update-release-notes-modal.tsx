import { useEffect, useRef, useState } from 'react'
import { Button, Modal } from '@/components/ui'
import { Icon } from '@/icons'
import { ConfigKey } from '@/common/constants/config.key'
import { useFreeWidgets } from '@/context/free-widget/free-widget.context'

type UpdateReleaseNotesModalProps = {
	isOpen: boolean
	onClose: () => void
	counterValue?: number | null
}

export const UpdateReleaseNotesModal = ({
	isOpen,
	onClose,
	counterValue,
}: UpdateReleaseNotesModalProps) => {
	const [counter, setCounter] = useState<number>(0)
	const videoRef = useRef<HTMLVideoElement>(null)
	const { setCanvasMode } = useFreeWidgets()

	useEffect(() => {
		if (isOpen && counterValue) {
			setCounter(counterValue)
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
		}

		setCounter(0)
	}, [isOpen, counterValue])

	useEffect(() => {
		if (isOpen && videoRef.current) {
			videoRef.current.play().catch(() => {})
		}
	}, [isOpen])

	const handlePersonalize = () => {
		onClose()
		setCanvasMode('edit')
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={`آپدیت جدید ${ConfigKey.VERSION_NAME}`}
			size="lg"
			direction="rtl"
			closeOnBackdropClick={false}
		>
			<div className="flex flex-col gap-4 select-none text-right">
				<div className="relative flex items-center justify-center w-full overflow-hidden border shadow-sm aspect-video max-h-48 sm:max-h-52 rounded-2xl border-base-content/10 bg-base-300/30 shrink-0">
					<video
						ref={videoRef}
						src="https://cdn.widgetify.ir/extension/WidgetDrag-b.mp4"
						autoPlay
						loop
						muted
						playsInline
						className="object-cover w-full h-full"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<div className="flex items-start gap-3 p-2.5 rounded-2xl bg-base-200/50 border border-base-content/10">
						<div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
							<Icon name="outlineDrag" size={16} />
						</div>
						<div className="flex flex-col gap-0.5">
							<span className="text-xs font-bold text-content">
								جابجایی آزاد در صفحه
							</span>
							<span className="text-[11px] leading-relaxed text-muted">
								ویجت‌ها رو با درگ و دراپ به هر جای صفحه ببر و چیدمان
								دلخواهت رو بساز
							</span>
						</div>
					</div>

					<div className="flex items-start gap-3 p-2.5 rounded-2xl bg-base-200/50 border border-base-content/10">
						<div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
							<Icon name="viewGridAdd" size={16} />
						</div>
						<div className="flex flex-col gap-0.5">
							<span className="text-xs font-bold text-content">
								تنوع اندازه ویجت‌ها
							</span>
							<span className="text-[11px] leading-relaxed text-muted">
								با کلیک‌راست روی هر ویجت اندازه‌ش رو تغییر بده و از مدل‌های
								مختلف استفاده کن
							</span>
						</div>
					</div>

					<div className="flex items-start gap-3 p-2.5 rounded-2xl bg-base-200/50 border border-base-content/10">
						<div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
							<Icon name="squares2X2" size={16} />
						</div>
						<div className="flex flex-col gap-0.5">
							<span className="text-xs font-bold text-content">
								چیدمان‌های آماده با ۱ کلیک
							</span>
							<span className="text-[11px] leading-relaxed text-muted">
								اگه دوست داری سریع شروع کنی، از قالب‌ها و چیدمان‌های آماده
								استفاده کن
							</span>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-success/20 border border-success/20 text-success-content text-[11px]">
					<Icon name="check" size={14} className="shrink-0" />
					<span className="font-medium">
						خیالت راحت باشه، همه ویجت‌ها و اطلاعات قبلی‌ت دست‌نخورده حفظ شدن
					</span>
				</div>

				<div className="flex items-center justify-between gap-2 pt-2 border-t border-base-content/10">
					<Button
						type="button"
						size="sm"
						variant="ghost"
						onClick={onClose}
						className="px-3 text-xs font-medium text-muted hover:text-content"
						rounded="xl"
					>
						<span>بعدا</span>
					</Button>

					<Button
						type="button"
						size="sm"
						color="primary"
						onClick={handlePersonalize}
						disabled={counter > 0}
						className="h-10 px-5 text-xs font-bold flex items-center gap-2 shadow-sm"
						rounded="xl"
					>
						<Icon name="outlineDrag" size={15} />
						<span>
							{counter > 0
								? `یه لحظه صبر کن (${counter})`
								: 'شخصی‌سازی صفحه'}
						</span>
					</Button>
				</div>
			</div>
		</Modal>
	)
}
