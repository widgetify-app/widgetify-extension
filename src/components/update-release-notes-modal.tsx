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

interface ReleaseStep {
	id: string
	title: string
	badge: string
	description: string
	videoUrl: string
	icon: 'outlineDrag' | 'viewGridAdd' | 'plus' | 'squares2X2'
}

const CDN_BASE_URL = 'https://cdn.widgetify.ir/extension/help_videos/'

const RELEASE_STEPS: ReleaseStep[] = [
	{
		id: 'drag-and-drop',
		title: 'جابجایی آزاد در صفحه',
		badge: 'مرحله ۱ از ۴',
		description:
			'ویجت‌ها رو با درگ و دراپ به هر جای صفحه ببر و چیدمان دلخواهت رو بساز',
		videoUrl: `${CDN_BASE_URL}JABEJAIE-WIDGET-HA.webm`,
		icon: 'outlineDrag',
	},
	{
		id: 'widget-styles',
		title: 'تنوع اندازه و ظاهر ویجت‌ها',
		badge: 'مرحله ۲ از ۴',
		description:
			'با کلیک‌راست روی هر ویجت اندازه‌ش رو تغییر بده و از مدل‌های مختلف استفاده کن',
		videoUrl: `${CDN_BASE_URL}WIDGET-STYLES.webm`,
		icon: 'viewGridAdd',
	},
	{
		id: 'add-new-item',
		title: 'افزودن ویجت‌های جدید',
		badge: 'مرحله ۳ از ۴',
		description:
			'از منوی افزودن ویجت، ویجت‌های دلخواهت رو به صفحه اضافه کن و حتی از یکی چند نسخه بساز',
		videoUrl: `${CDN_BASE_URL}ADD-NEW-ITEM-AND-NEW-LIST.webm`,
		icon: 'plus',
	},
	{
		id: 'prepared-items',
		title: 'چیدمان‌های آماده با ۱ کلیک',
		badge: 'مرحله ۴ از ۴',
		description:
			'اگه دوست داری سریع شروع کنی، از قالب‌ها و چیدمان‌های آماده استفاده کن',
		videoUrl: `${CDN_BASE_URL}CHANGE-PREPARED-ITEMS-2.webm`,
		icon: 'squares2X2',
	},
]

export const UpdateReleaseNotesModal = ({
	isOpen,
	onClose,
	counterValue,
}: UpdateReleaseNotesModalProps) => {
	const [activeStepIndex, setActiveStepIndex] = useState<number>(0)
	const [counter, setCounter] = useState<number>(0)
	const videoRef = useRef<HTMLVideoElement>(null)
	const { setCanvasMode } = useFreeWidgets()

	const currentStep = RELEASE_STEPS[activeStepIndex]
	const isLastStep = activeStepIndex === RELEASE_STEPS.length - 1

	useEffect(() => {
		if (isOpen) {
			setActiveStepIndex(0)
		}
	}, [isOpen])

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
			videoRef.current.load()
			videoRef.current.play().catch(() => {})
		}
	}, [isOpen, activeStepIndex])

	const handleNextStep = () => {
		if (!isLastStep) {
			setActiveStepIndex((prev) => prev + 1)
		} else {
			handleEnterEditMode()
		}
	}

	const handlePrevStep = () => {
		if (activeStepIndex > 0) {
			setActiveStepIndex((prev) => prev - 1)
		}
	}

	const handleEnterEditMode = () => {
		onClose()
		setCanvasMode('edit')
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={'نسخه 2 ویجتیفای با کلی تغییرات منتشر شد!!'}
			size="lg"
			direction="rtl"
			closeOnBackdropClick={false}
			className="min-h-[500px]"
		>
			<div className="flex flex-col gap-4 select-none text-right">
				{/* Step Stepper Indicator */}
				<div className="flex items-center justify-between gap-1 px-1">
					{RELEASE_STEPS.map((step, index) => {
						const isCurrent = index === activeStepIndex
						const isCompleted = index < activeStepIndex

						return (
							<button
								key={step.id}
								type="button"
								onClick={() => setActiveStepIndex(index)}
								className={`flex-1 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
									isCurrent
										? 'bg-primary'
										: isCompleted
											? 'bg-brand-strong'
											: 'bg-hovered hover:bg-strong'
								}`}
								aria-label={step.title}
							/>
						)
					})}
				</div>

				{/* Video Preview Container */}
				<div className="relative flex items-center justify-center w-full overflow-hidden border shadow-sm aspect-video max-h-56 rounded-2xl border-subtle bg-raised-subtle shrink-0">
					<video
						key={currentStep.videoUrl}
						ref={videoRef}
						src={currentStep.videoUrl}
						autoPlay
						loop
						muted
						playsInline
						className="object-cover w-full h-full"
					/>
					<div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-widget-strong backdrop-blur-md border border-subtle text-[11px] font-bold text-content shadow-xs">
						{currentStep.badge}
					</div>
				</div>

				{/* Active Step Content Card */}
				<div className="flex flex-col justify-center min-h-[128px]">
					{activeStepIndex === 0 ? (
						<div className="flex flex-col justify-between h-full gap-2">
							<div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-primary">
								<span className="text-sm">💣</span>
								<span className="text-lg font-bold leading-normal">
									بزرگ‌ترین تحول: چیدمان کاملا آزاد و بی‌نهایت
								</span>
							</div>

							<div className="flex items-start gap-3 p-3 rounded-2xl bg-content-muted border border-subtle transition-all">
								<div className="w-8 h-8 rounded-xl bg-brand-subtle text-primary flex items-center justify-center shrink-0 mt-0.5">
									<Icon name={currentStep.icon} size={16} />
								</div>
								<div className="flex flex-col gap-0.5">
									<span className="text-xs font-bold text-content">
										{currentStep.title}
									</span>
									<span className="text-[11px] leading-relaxed text-muted">
										{currentStep.description}
									</span>
								</div>
							</div>

							<div className="flex items-center gap-1.5 px-2 text-[11px] font-medium text-muted">
								<span>
									دیگه خبری از محدودیت ستون‌های ثابت نیست؛ صفحه تماما در
									اختیارته!
								</span>
							</div>
						</div>
					) : (
						<div className="flex flex-col justify-between h-full gap-2">
							<div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-content-muted border border-subtle transition-all">
								<div className="w-9 h-9 rounded-xl bg-brand-subtle text-primary flex items-center justify-center shrink-0 mt-0.5">
									<Icon name={currentStep.icon} size={18} />
								</div>
								<div className="flex flex-col gap-1 justify-center">
									<div className="flex items-center gap-2">
										<span className="text-sm font-bold text-content">
											{currentStep.title}
										</span>
									</div>
									<p className="text-xs leading-relaxed text-muted">
										{currentStep.description}
									</p>
								</div>
							</div>

							{isLastStep ? (
								<div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-brand-subtle border border-brand-muted text-content">
									<div className="flex items-center gap-2">
										<span className="text-base">📸</span>
										<span className="text-xs font-bold text-primary">
											مشتاقیم چیدمان‌های خلاقانه‌ت رو ببینیم!
										</span>
									</div>
									<span className="text-[11px] font-medium text-muted">
										عکس تب قشنگت رو با ما به اشتراک بذار
									</span>
								</div>
							) : (
								<div className="flex items-center gap-1.5 px-2 text-[11px] font-medium text-muted">
									<span>
										{activeStepIndex === 1
											? 'هر ویجت رو می‌تونی با اندازه و مدل اختصاصی تنظیم کنی'
											: 'می‌تونی از ویجت‌های محبوبت چند نسخه با تنظیمات مجزا بسازی'}
									</span>
								</div>
							)}
						</div>
					)}
				</div>

				{/* Footer Controls & Actions */}
				<div className="flex items-center justify-between gap-2 pt-2 border-t border-subtle">
					<div className="flex items-center gap-1.5">
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

						{activeStepIndex > 0 && (
							<Button
								type="button"
								size="sm"
								variant="ghost"
								onClick={handlePrevStep}
								className="px-2.5 text-xs font-bold flex items-center gap-1 text-content"
								rounded="xl"
							>
								<Icon name="chevronRight" size={14} />
								<span>قبلی</span>
							</Button>
						)}
					</div>

					<div className="flex items-center gap-2">
						{!isLastStep ? (
							<Button
								type="button"
								size="sm"
								color="primary"
								onClick={handleNextStep}
								className="h-10 px-5 text-xs font-bold flex items-center gap-1.5 shadow-sm"
								rounded="xl"
							>
								<span>مرحله بعد</span>
								<Icon name="chevronLeft" size={14} />
							</Button>
						) : (
							<Button
								type="button"
								size="sm"
								color="primary"
								onClick={handleEnterEditMode}
								disabled={counter > 0}
								className="h-10 px-5 text-xs font-bold flex items-center gap-2 shadow-sm animate-pulse"
								rounded="xl"
							>
								<Icon name="edit" size={15} />
								<span>
									{counter > 0
										? `یه لحظه صبر کن (${counter})`
										: 'ورود به حالت ویرایش و چیدمان'}
								</span>
							</Button>
						)}
					</div>
				</div>
			</div>
		</Modal>
	)
}
