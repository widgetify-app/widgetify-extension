import { HomeContentCustom } from './ui/home-content-custom'
import { getFromStorage, setToStorage } from '@/common/storage'
import { ConfigKey } from '@/common/constant/config.key'
import { ExtensionInstalledModal } from '@/components/extension-installed-modal'
import { Joyride, type Step } from 'react-joyride'
import { UpdateReleaseNotesModal } from '@/components/update-release-notes-modal'
import Analytics from '@/analytics'
import { DialogChecker } from './dialog/dialog'
import { TourTooltip } from '@/components/tour/tour-tooltip'

const steps: Step[] = [
	{
		target: '#chrome-footer',
		content: (
			<div className="flex flex-col gap-2 text-center">
				<h4 className="text-[13px] font-black text-primary">
					خلوت کردن فضای مرورگر
				</h4>

				<p className="text-[12px] leading-5 text-base-content/80 font-medium">
					برای مخفی کردن این نوار، کافیه روش{' '}
					<span className="font-black text-error">راست‌کلیک</span> کنی و این
					گزینه رو بزنی:
				</p>

				<div className="relative overflow-hidden border rounded-xl border-base-content/10">
					<img
						src="https://cdn.widgetify.ir/extension/how-to-disable-footer.png"
						alt="نحوه مخفی کردن نوار پایین مرورگر"
						className="object-cover w-full shadow-md rounded-xl"
					/>
				</div>

				<div className="p-1.5 border border-dashed rounded-lg bg-base-300/40 border-base-content/15">
					<code className="text-[11px] font-bold text-base-content/70">
						"Hide footer on New Tab page"
					</code>
				</div>
			</div>
		),
	},
	{
		target: '.widget-outer',
		content:
			'برای تغییر اندازه، جابه‌جایی، تغییر استایل، کپی یا حذف هر ویجت، کافیه روش راست‌کلیک کنی تا منوی اختصاصی اون باز بشه',
	},
	{
		target: '#settings-button',
		content:
			'از این دکمه می‌تونی به تنظیمات عمومی، تصاویر زمینه و اضافه کردن ویجت‌ها دسترسی داشته باشی',
	},
	{
		target: '#profile-and-friends-list',
		content: 'از این بخش می‌تونی پروفایلت رو ببینی و با دوستات در ارتباط باشی',
	},
]

export function HomePage() {
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
			<HomeContentCustom />

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
				tooltipComponent={TourTooltip}
				options={{
					showProgress: true,
					skipBeacon: true,
					primaryColor: '#536dfe',
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
