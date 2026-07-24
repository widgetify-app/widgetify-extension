import { useAppearanceSetting } from '@/context/appearance.context'
import { ContentSection } from './ui/content-section'
import { HomeContentSimplify } from './ui/home-content-simplify'
import { getFromStorage, setToStorage } from '@/common/storage'
import { ConfigKey } from '@/common/constant/config.key'
import { ExtensionInstalledModal } from '@/components/extension-installed-modal'
import { Joyride, type Step } from 'react-joyride'
import { UpdateReleaseNotesModal } from '@/components/UpdateReleaseNotesModal'
import Analytics from '@/analytics'
import { DialogChecker } from './dialog/dialog'
const steps: Step[] = [
	{
		target: '#chrome-footer',
		content: (
			<div className="flex flex-col gap-1 text-center">
				<h4 className="text-[14px] font-black text-primary italic">
					خلوت کردن فضای مرورگر
				</h4>

				<p className="text-[12px] leading-6 text-content font-medium">
					برای مخفی کردن این نوار، کافیست روی آن{' '}
					<span className="font-black text-error">راست کلیک</span> کرده و گزینه
					زیر را انتخاب کنید:
				</p>

				<div className="relative group">
					<img
						src="https://cdn.widgetify.ir/extension/how-to-disable-footer.png"
						alt="نحوه مخفی کردن نوار پایین مرورگر"
						className="object-cover w-full transition-transform duration-500 rounded-xl shadow-2xl border-2 border-primary/20 group-hover:scale-[1.02]"
					/>
					<div className="absolute inset-0 pointer-events-none rounded-xl bg-linear-to-t from-black/20 to-transparent" />
				</div>

				<div className="p-2 border border-dashed rounded-lg bg-base-100/10 border-base-100/20">
					<code className="text-[11px] font-bold text-content/60">
						"Hide footer on New Tab page"
					</code>
				</div>
			</div>
		),
		buttons: ['primary', 'back'],
		locale: {
			nextWithProgress: 'مخفی کردم / نبودش',
		},
	},
	{
		target: '#settings-button',
		content:
			'از این دکمه می‌توانید به تنظیمات عمومی افزونه و مدیریت ویجت‌ها دسترسی پیدا کنید و آن‌ها را سفارشی‌سازی کنید.',
	},
	{
		target: '#profile-and-friends-list',
		content:
			'از این بخش می‌توانید به پروفایل شخصی خود و لیست دوستان دسترسی پیدا کنید و آن‌ها را مدیریت کنید.',
	},
	{
		target: '#bookmarks',
		content:
			'این بخش به شما امکان می‌دهد بوکمارک‌ها را مدیریت کنید: بوکمارک جدید اضافه کنید، بوکمارک‌های موجود را ویرایش یا حذف کنید و تنظیمات هر بوکمارک را تغییر دهید.',
	},
	{
		target: '#widgets',
		content:
			'این محیط اصلی ویجت‌ها است. شما می‌توانید بدون محدودیت از ویجت‌ها استفاده کنید، اما برای جلوگیری از شلوغی بیش از حد، پیشنهاد می‌کنیم حداکثر ۴ ویجت را همزمان فعال نگه دارید.',
	},
]

export function HomePage() {
	const { ui } = useAppearanceSetting()
	const [showWelcomeModal, setShowWelcomeModal] = useState(false)
	const [showReleaseNotes, setShowReleaseNotes] = useState(false)
	const [showTour, setShowTour] = useState(false)
	const [appIsReady, setAppIsReady] = useState(false)

	const handleGetStarted = async () => {
		const [hasSeenTour] = await Promise.all([
			getFromStorage('hasSeenTour'),
			setToStorage('showWelcomeModal', false),
		])
		setShowWelcomeModal(false)
		if (!hasSeenTour) {
			setShowTour(true)
		}
	}

	function onDoneTour(data: any) {
		if (
			data.status === 'finished' ||
			data.status === 'skipped' ||
			data.status === 'close'
		) {
			setToStorage('hasSeenTour', true)
			setShowTour(false)
			Analytics.event(`tour_${data.status}`)
		}
	}

	const onCloseReleaseNotes = async () => {
		await setToStorage('lastVersion', ConfigKey.VERSION_NAME)
		setShowReleaseNotes(false)
	}

	useEffect(() => {
		async function displayModalIfNeeded() {
			const shouldShowWelcome = await getFromStorage('showWelcomeModal')

			if (shouldShowWelcome || shouldShowWelcome === null) {
				setShowWelcomeModal(true)
				return
			}

			const lastVersion = await getFromStorage('lastVersion')
			if (lastVersion !== ConfigKey.VERSION_NAME) {
				setShowReleaseNotes(true)
				return
			}

			setAppIsReady(true)
		}

		displayModalIfNeeded()
	}, [])

	return (
		<>
			{ui === 'ADVANCED' ? <ContentSection /> : <HomeContentSimplify />}

			{showWelcomeModal && (
				<ExtensionInstalledModal
					show={showWelcomeModal}
					onClose={() => handleGetStarted}
					onGetStarted={handleGetStarted}
				/>
			)}

			{appIsReady && <DialogChecker />}

			<Joyride
				steps={steps}
				run={showTour}
				continuous
				locale={{
					next: 'بعدی',
					back: 'قبلی',
					skip: 'رد کردن',
					last: 'پایان',
					close: 'بستن',
					nextWithProgress: 'بعدی {current}/{total}',
				}}
				options={{
					showProgress: true,
					skipBeacon: true,
					primaryColor: '#3b82f6',
					dismissKeyAction: 'close',
					buttons: ['skip', 'primary', 'back'],
				}}
				onEvent={onDoneTour}
			/>

			{showReleaseNotes && (
				<UpdateReleaseNotesModal
					isOpen={showReleaseNotes}
					onClose={() => onCloseReleaseNotes()}
					counterValue={2}
				/>
			)}
		</>
	)
}
