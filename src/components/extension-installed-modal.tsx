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
export function ExtensionInstalledModal({
	show,
	onGetStarted,
}: ExtensionInstalledModalProps) {
	return (
		<Modal
			isOpen={show}
			onClose={() => {}}
			size="sm"
			direction="rtl"
			showCloseButton={false}
			closeOnBackdropClick={false}
		>
			{import.meta.env.FIREFOX ? (
				<StepFirefoxConsent onGetStarted={onGetStarted} />
			) : (
				<StepOne onGetStarted={onGetStarted} />
			)}
		</Modal>
	)
}
interface StepOneProps {
	onGetStarted: () => void
}
const StepOne = ({ onGetStarted }: StepOneProps) => {
	return (
		<>
			<div className="mb-3">
				<h3 className={'mb-0 text-2xl font-bold text-content'}>
					به ویجتیفای خوش آمدید! 🎉
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
					'p-3 mb-2 text-content rounded-lg border border-content  bg-content'
				}
			>
				<p className="font-bold text-muted">
					⚠️ برای فعالسازی افزونه، روی دکمه "Keep It" کلیک کنید.
				</p>
			</div>

			<Button
				size="md"
				onClick={onGetStarted}
				className="w-full text-base font-light shadow-sm rounded-2xl shadow-primary outline-none!"
				isPrimary={true}
			>
				شروع کنید
			</Button>
		</>
	)
}

interface StepFirefoxConsentProps {
	onGetStarted: () => void
}
const StepFirefoxConsent = ({ onGetStarted }: StepFirefoxConsentProps) => {
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
			<p className="mb-2 font-semibold">خلاصه سیاست حریم خصوصی ویجتیفای:</p>
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
					<li>ویجتیفای متن‌باز است و کد آن روی GitHub قابل بررسی است.</li>
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
						با سیاست حریم خصوصی ویجتیفای موافقم.
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
					onClick={onGetStarted}
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
