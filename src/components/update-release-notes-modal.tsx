import { useEffect, useRef, useState } from 'react'
import { Button, Modal } from '@/components/ui'
import { Icon } from '@/src/icons'
import { ConfigKey } from '@/common/constant/config.key'
import { useFreeWidgets } from '@/context/free-widget/free-widget.context'

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
	const { setCanvasMode } = useFreeWidgets()

	useEffect(() => {
		if (isOpen && counterValue !== null) {
			setCounter(counterValue === null ? 5 : counterValue)
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
			title={`آپدیت ${ConfigKey.VERSION_NAME}؛ چیدمان آزاد و نامحدود`}
			size="lg"
			direction="rtl"
			closeOnBackdropClick={false}
		>
			<div className="flex flex-col gap-3 max-h-[80vh] select-none text-right">
				<div className="flex flex-col gap-2.5 overflow-y-auto pb-1">
					<div className="relative flex items-center justify-center w-full overflow-hidden border max-h-48 aspect-video rounded-2xl border-base-content/10 bg-base-300/30 shrink-0">
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

					<div className="flex flex-col gap-2 p-2.5 rounded-2xl bg-base-200/60 border border-base-content/10">
						<div className="flex items-start gap-2.5">
							<div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
								<Icon name="check" size={12} />
							</div>
							<p className="text-xs leading-relaxed text-content">
								<span className="font-bold">خیالت راحت!</span> چیدمان و
								ویجت‌های قبلی‌ت دقیقا سر جاشون حفظ شدن و چیزی پاک نشده
							</p>
						</div>

						<div className="flex items-start gap-2.5">
							<div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
								<Icon name="outlineDrag" size={12} />
							</div>
							<p className="text-xs leading-relaxed text-content">
								با کلیک راست روی صفحه و انتخاب «ویرایش ویجت‌ها»، می‌تونی
								ویجت‌ها رو جابه‌جا کنی یا با کلیک راست روی هر ویجت اندازه‌ش
								رو عوض کنی
							</p>
						</div>

						<div className="flex items-start gap-2.5">
							<div className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 mt-0.5">
								<Icon name="squares2X2" size={12} />
							</div>
							<p className="text-xs leading-relaxed text-content">
								اگه وقت چیدمان نداری، از بخش «چیدمان‌های آماده» با یک کلیک
								صفحه رو بچین
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2.5 p-3 rounded-2xl bg-base-200/40 border border-dashed border-base-content/15 text-xs text-muted">
						<span className="text-base">📸</span>
						<p className="leading-relaxed">
							صفحه جدیدت رو بچین و اسکرین‌شاتش رو برامون بفرست
						</p>
					</div>
				</div>

				<div className="flex items-center justify-between gap-2 pt-2 border-t border-base-content/10">
					<Button
						type="button"
						size="sm"
						variant="ghost"
						onClick={onClose}
						disabled={counter > 0}
						className="px-3 text-xs font-bold text-muted hover:text-content"
						rounded="xl"
					>
						<span>ورود به ویجتیفای</span>
					</Button>

					<Button
						type="button"
						size="sm"
						variant="primary"
						onClick={handlePersonalize}
						disabled={counter > 0}
						className="h-10 px-4 text-xs font-bold flex items-center gap-1.5 shadow-sm"
						rounded="xl"
					>
						<Icon name="outlineDrag" size={14} />
						<span>
							{counter > 0
								? `یه چند لحظه صبر کن (${counter})`
								: 'شخصی‌سازی صفحه‌ام'}
						</span>
					</Button>
				</div>
			</div>
		</Modal>
	)
}
