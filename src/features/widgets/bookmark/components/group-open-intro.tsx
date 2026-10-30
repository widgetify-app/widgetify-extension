import { useEffect, useRef, useState } from 'react'
import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { Button, Coachmark } from '@/components/ui'
import { FEATURE_INTRO_IDS, useFeatureIntro } from '@/context/feature-intro.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import groupOpenArt from '@/assets/images/bookmark/group-open.webp'

const INTRO_ID = FEATURE_INTRO_IDS.bookmarkGroupOpen

const HINT_CLASS =
	'inline-flex items-center h-6 px-2 text-2xs font-bold border rounded-lg border-surface-3 bg-surface-2 text-fg'

export function GroupOpenIntro({ className }: { className?: string }) {
	const { isUnseen, dismiss } = useFeatureIntro(INTRO_ID)
	const { browserTabsEnabled, setBrowserTabsEnabled } = useGeneralSetting()
	const [needsPermission] = useState(() => !browserTabsEnabled)
	const [step, setStep] = useState(needsPermission ? 0 : 1)
	const shownSent = useRef(false)

	useEffect(() => {
		if (!isUnseen || shownSent.current) return
		shownSent.current = true
		Analytics.event('feature_intro_shown', { id: INTRO_ID })
	}, [isUnseen])

	if (!isUnseen) return null

	const stepInfo = needsPermission ? { current: step, count: 2 } : undefined

	if (step === 0) {
		return (
			<Coachmark
				className={className}
				image={groupOpenArt}
				title={t('widgets.bookmark.intro.permissionTitle')}
				description={t('widgets.bookmark.intro.permissionBody')}
				step={stepInfo}
				actions={
					<>
						<Button
							size="sm"
							rounded="xl"
							onClick={() => {
								Analytics.event('feature_intro_permission_skipped', {
									id: INTRO_ID,
								})
								setStep(1)
							}}
						>
							{t('widgets.bookmark.intro.notNow')}
						</Button>
						<Button
							size="sm"
							rounded="xl"
							color="brand"
							onClick={(event) => {
								Analytics.event('feature_intro_permission_clicked', {
									id: INTRO_ID,
								})
								setBrowserTabsEnabled(true, event)
								setStep(1)
							}}
						>
							{t('widgets.bookmark.intro.allow')}
						</Button>
					</>
				}
			/>
		)
	}

	return (
		<Coachmark
			className={className}
			image={groupOpenArt}
			title={t('widgets.bookmark.intro.title')}
			description={t('widgets.bookmark.intro.body')}
			step={stepInfo}
			actions={
				<Button size="sm" rounded="xl" color="brand" onClick={dismiss}>
					{t('widgets.bookmark.intro.gotIt')}
				</Button>
			}
		>
			<span className="flex gap-1">
				<span className={HINT_CLASS}>
					{t('widgets.bookmark.intro.middleClick')}
				</span>
				<span className={HINT_CLASS}>
					{t('widgets.bookmark.intro.ctrlClick')}
				</span>
			</span>
		</Coachmark>
	)
}
