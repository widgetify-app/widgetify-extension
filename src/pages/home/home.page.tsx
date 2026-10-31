import { HomeContentCustom } from './components/home-content-custom'
import { t } from '@/common/i18n'
import { getFromStorage, setToStorage } from '@/common/storage'
import { ConfigKey } from '@/common/constants/config-keys'
import { ExtensionInstalledModal } from './components/extension-installed-modal'
import { Joyride, type Step } from 'react-joyride'
import { UpdateReleaseNotesModal } from '@/features/release-notes/release-notes'
import Analytics from '@/analytics'
import { DialogChecker } from './components/dialog'
import { TourTooltip } from './components/tour-tooltip'
import { useEffect, useState } from 'react'
import footerArt from '@/assets/images/onboarding/footer.webp'
import widgetArt from '@/assets/images/onboarding/widget.webp'
import layoutArt from '@/assets/images/onboarding/layout.webp'
import profileArt from '@/assets/images/onboarding/profile.webp'

function TourArt({ src, alt = '' }: { src: string; alt?: string }) {
	return (
		<img src={src} alt={alt} className="object-cover w-full aspect-2/1 rounded-xl" />
	)
}

const steps: Step[] = [
	{
		target: '#chrome-footer',
		content: (
			<div className="flex flex-col gap-2 text-center">
				<TourArt src={footerArt} alt={t('home.tour.step1.imageAlt')} />
				<h4 className="text-sm font-black text-brand">
					{t('home.tour.step1.title')}
				</h4>

				<p className="text-xs leading-5 text-fg-muted font-medium">
					{t('home.tour.step1.bodyBefore')}{' '}
					<span className="font-black text-danger">
						{t('home.tour.step1.rightClick')}
					</span>{' '}
					{t('home.tour.step1.bodyAfter')}
				</p>

				<div className="p-1.5 border border-dashed rounded-lg bg-fill border-line">
					<code className="text-2xs font-bold text-fg-muted">
						"Hide footer on New Tab page"
					</code>
				</div>
			</div>
		),
	},
	{
		target: '[data-tour="widget"]',
		content: (
			<div className="flex flex-col gap-2.5">
				<TourArt src={widgetArt} />
				<p className="text-xs leading-relaxed text-fg font-medium">
					{t('home.tour.step2.body')}
				</p>
			</div>
		),
	},
	{
		target: '#layout-menu-button',
		content: (
			<div className="flex flex-col gap-2.5">
				<TourArt src={layoutArt} />
				<p className="text-xs leading-relaxed text-fg font-medium">
					{t('home.tour.step3.body')}
				</p>
			</div>
		),
	},
	{
		target: '#profile-button',
		content: (
			<div className="flex flex-col gap-2.5">
				<TourArt src={profileArt} />
				<p className="text-xs leading-relaxed text-fg font-medium">
					{t('home.tour.step4.body')}
				</p>
			</div>
		),
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
				locale={{
					back: t('home.tour.prev'),
					close: t('home.tour.close'),
					last: t('home.tour.finish'),
					next: t('home.tour.next'),
					nextWithProgress: t('home.tour.next'),
					skip: t('home.tour.skip'),
				}}
				options={{
					showProgress: true,
					skipBeacon: true,
					primaryColor: '#536dfe',
					dismissKeyAction: 'close',
					buttons: ['skip', 'primary', 'back'],
				}}
				onEvent={onDoneTour}
			/>

			<UpdateReleaseNotesModal
				isOpen={showReleaseNotes}
				onClose={() => onCloseReleaseNotes()}
				counterValue={2}
			/>
		</>
	)
}
