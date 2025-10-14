import { domAnimation, LazyMotion, m } from 'framer-motion'
import { useState } from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import keepItImage from '@/assets/keep-it.png'
import { Button } from './button/button'
import Checkbox from './checkbox'
import Modal from './modal'

interface ExtensionInstalledModalProps {
	show: boolean
	onClose: () => void
	onGetStarted: () => void
}

type Step = number

export function ExtensionInstalledModal({
	show,
	onGetStarted,
}: ExtensionInstalledModalProps) {
	const [currentStep, setCurrentStep] = useState<Step>(1)
	const totalSteps = 3

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				if (import.meta.env.FIREFOX) {
					return <StepFirefoxConsent setCurrentStep={setCurrentStep} />
				}
				return <StepOne setCurrentStep={setCurrentStep} />
			case 2:
				return <StepFooterDisable setCurrentStep={setCurrentStep} />
			case 3:
				return <StepThree onGetStarted={onGetStarted} />
			default:
				return null
		}
	}

	return (
		<Modal
			isOpen={show}
			onClose={() => {}}
			size="sm"
			direction="rtl"
			showCloseButton={false}
			closeOnBackdropClick={false}
		>
			<LazyMotion features={domAnimation}>
				<m.div
					className={'flex flex-col items-center p-2 text-center w-full'}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.4 }}
				>
					{renderStepContent()}
				</m.div>
			</LazyMotion>

			<StepIndicator
				totalSteps={totalSteps}
				currentStep={currentStep}
				setCurrentStep={setCurrentStep}
			/>
		</Modal>
	)
}
interface StepIndicatorProps {
	totalSteps: number
	currentStep: Step
	setCurrentStep: (step: Step) => void
}
const StepIndicator = ({
	totalSteps,
	currentStep,
	setCurrentStep,
}: StepIndicatorProps) => (
	<div
		className="flex items-center justify-center gap-3"
		role="progressbar"
		aria-valuenow={currentStep}
		aria-valuemin={1}
		aria-valuemax={totalSteps}
	>
		{Array.from({ length: totalSteps }).map((_, index) => (
			<button
				key={index}
				onClick={() =>
					import.meta.env.FIREFOX
						? undefined
						: setCurrentStep((index + 1) as Step)
				}
				aria-label={`رفتن به گام ${index + 1}`}
				aria-current={index + 1 === currentStep ? 'step' : undefined}
				className={`w-10 h-2 ${import.meta.env.FIREFOX ? 'cursor-default' : 'cursor-pointer'} rounded-full transition-all duration-300 ${
					index + 1 === currentStep
						? 'bg-blue-500 shadow-lg shadow-blue-500/30'
						: index + 1 < currentStep
							? 'bg-blue-600'
							: 'bg-gray-700 hover:bg-gray-600'
				}`}
			/>
		))}
	</div>
)

interface StepOneProps {
	setCurrentStep: (step: Step) => void
}
const StepOne = ({ setCurrentStep }: StepOneProps) => {
	return (
		<>
			<div className="mb-3">
				<h3 className={'mb-0 text-2xl font-bold text-content'}>
					به ویجتی‌فای خوش آمدید! 🎉
				</h3>
			</div>

			<div
				className={
					'relative p-1 mt-1 mb-3 border rounded-xl border-content bg-content'
				}
			>
				<div className="flex items-center justify-center">
					<img
						src={keepItImage}
						alt="نحوه فعالسازی افزونه"
						className="h-auto max-w-full rounded-lg shadow-xl"
						style={{ maxHeight: '220px' }}
					/>
				</div>
			</div>

			<div
				className={
					'p-3 mb-3 text-content rounded-lg border border-content  bg-content'
				}
			>
				<p className="font-bold text-muted">
					⚠️ برای فعالسازی افزونه، روی دکمه "Keep It" کلیک کنید.
				</p>
			</div>

			<button
				onClick={() => setCurrentStep(2)}
				className="px-8 py-3 font-light text-white transition-all cursor-pointer duration-300 transform bg-blue-600 bg-opacity-80 border border-blue-400/30 rounded-lg shadow-[0_8px_16px_rgba(0,0,0,0.2)] hover:bg-opacity-90 hover:shadow-xl backdrop-blur-sm"
			>
				Keep It رو زدم!
			</button>
		</>
	)
}

interface StepFooterDisableProps {
	setCurrentStep: (step: Step) => void
}
const StepFooterDisable = ({ setCurrentStep }: StepFooterDisableProps) => {
	return (
		<>
			<div className="mb-3">
				<h3 className={'mb-0 text-2xl font-bold text-content'}>
					مخفی کردن نوار پایین مرورگر
				</h3>
			</div>

			<div
				className={
					'relative p-1 mt-1 mb-3 border rounded-xl border-content bg-content'
				}
			>
				<div className="flex items-center justify-center">
					<img
						src="https://widgetify-ir.storage.c2.liara.space/extension/how-to-disable-footer.png"
						alt="نحوه مخفی کردن نوار پایین مرورگر"
						className="h-auto max-w-full rounded-lg shadow-xl"
						style={{ maxHeight: '220px' }}
					/>
				</div>
			</div>

			<div
				className={
					'p-3 mb-3 text-content rounded-lg border border-content  bg-content'
				}
			>
				<p className="font-bold text-muted">
					💡 برای زیبایی بیشتر، میتونید نوار خاکستری پایین مرورگر رو مانند این
					تصویر مخفی کنید
				</p>
			</div>

			<button
				onClick={() => setCurrentStep(3)}
				className="px-8 py-3 font-light text-white transition-all cursor-pointer duration-300 transform bg-blue-600 bg-opacity-80 border border-blue-400/30 rounded-lg shadow-[0_8px_16px_rgba(0,0,0,0.2)] hover:bg-opacity-90 hover:shadow-xl backdrop-blur-sm"
			>
				باشه
			</button>
		</>
	)
}

interface StepThreeProps {
	onGetStarted: () => void
}
const StepThree = ({ onGetStarted }: StepThreeProps) => {
	return (
		<>
			<m.div
				className="mb-6"
				initial={{ y: -20 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				<h3 className={'mb-3 text-2xl font-bold text-content'}>
					آماده شروع هستید؟
				</h3>
			</m.div>

			<m.div
				className={
					'p-3 mb-6 border rounded-lg bg-content backdrop-blur-sm border-content'
				}
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.3 }}
			>
				<p className="text-muted">
					بریم که یک تجربه جدید و جذاب را شروع کنیم! 😎
				</p>
			</m.div>

			<div className="flex flex-col w-full gap-4 mt-4 sm:flex-row">
				<button
					onClick={onGetStarted}
					className="px-6 py-3 font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 border border-blue-400/30 rounded-lg shadow-[0_8px_16px_rgba(0,0,0,0.2)] cursor-pointer hover:bg-opacity-90 hover:shadow-[0_12px_20px_rgba(0,0,0,0.25)] backdrop-blur-sm w-full sm:flex-1"
				>
					شروع کنید
				</button>
			</div>
		</>
	)
}

interface StepFirefoxConsentProps {
	setCurrentStep: (step: Step) => void
}
const StepFirefoxConsent = ({ setCurrentStep }: StepFirefoxConsentProps) => {
	const [isAccepted, setIsAccepted] = useState(false)
	const handleDecline = () => {
		if (browser.management?.uninstallSelf) {
			// @ts-expect-error
			browser.management.uninstallSelf({
				showConfirmDialog: true,
				dialogMessage:
					'⚠️ Without data permission, the extension cannot function. Do you want to uninstall it? ⚠️',
			})
		}
	}

	return (
		<div className="w-full overflow-clip">
			<h3 className="mb-3 text-2xl font-bold text-content">Privacy Notice</h3>
			<p className="mb-2 font-semibold">خلاصه سیاست حریم خصوصی ویجتی‌فای:</p>
			<div className="w-full px-2">
				<ul className="w-full h-56 space-y-1 overflow-y-auto text-xs list-disc list-inside border border-content rounded-2xl">
					<li>هیچ داده شخصی به‌طور پیش‌فرض جمع‌آوری نمی‌شود.</li>
					<li>تنظیمات فقط در دستگاه شما (Local Storage) ذخیره می‌شوند.</li>
					<li>
						اطلاعات اختیاری مثل نام و ایمیل فقط برای همگام‌سازی بین دستگاه‌ها
						استفاده می‌شوند (در صورت تمایل شما).
					</li>
					<li>
						اتصال به گوگل کاملاً اختیاری است و فقط برای نمایش رویدادهای تقویم
						(دسترسی خواندنی) استفاده می‌شود.
					</li>
					<li>
						برای نمایش آیکون بوکمارک‌ها، «دامنه‌ وب‌سایت» شما خوانده می‌شود؛ این
						داده شخصی محسوب شده و فقط در همان لحظه برای نمایش آیکون استفاده
						می‌شود و جایی ذخیره یا ارسال نمی‌گردد.
					</li>
					<li>
						اطلاعات آماری استفاده (Analytics) برای بهبود تجربه کاربری جمع‌آوری
						می‌شود. این مورد کاملاً اختیاری است و می‌توانید آن را رد کنید.
					</li>
					<li>هیچ داده‌ای با اشخاص ثالث به اشتراک گذاشته نمی‌شود.</li>
					<li>ویجتی‌فای متن‌باز است و کد آن روی GitHub قابل بررسی است.</li>
					<li>
						درخواست حذف کامل داده‌ها در هر زمان از طریق{' '}
						<a
							href="mailto:privacy@widgetify.ir"
							className="text-blue-600 underline"
						>
							privacy@widgetify.ir
						</a>{' '}
						ممکن است.
					</li>
				</ul>

				<a
					href="https://widgetify.ir/privacy"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center justify-center font-medium underline text-primary gap-0.5"
				>
					<FaExternalLinkAlt />
					مشاهده سیاست کامل حریم خصوصی
				</a>
				<p className="mt-2 text-sm text-content">
					اگر رد کنید، افزونه قادر به انجام وظایف اصلی خود نخواهد بود. در صورت
					تمایل می‌توانید افزونه را همین حالا حذف کنید.
				</p>

				<div
					className="flex items-center p-1 mt-2 text-white bg-gray-400 rounded cursor-pointer"
					onClick={() => setIsAccepted(!isAccepted)}
				>
					<Checkbox
						checked={isAccepted}
						onChange={() => setIsAccepted(!isAccepted)}
					/>
					<span className="mr-2 text-sm">
						با سیاست حریم خصوصی ویجتی‌فای موافقم.
					</span>
				</div>
			</div>

			<div className="flex gap-3 mt-4">
				<Button
					onClick={handleDecline}
					size="md"
					className="flex items-center justify-center w-40 btn btn-error rounded-xl"
				>
					🚫 حذف افزونه
				</Button>
				<Button
					onClick={() => setCurrentStep(2)}
					size="md"
					className="w-40 btn btn-success rounded-xl"
					disabled={!isAccepted}
				>
					✅ قبول می‌کنم
				</Button>
			</div>
		</div>
	)
}
