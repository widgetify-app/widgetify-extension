import { useId } from 'react'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { useGeneralSetting } from '@/context/general-setting.context'
import { PAUSED_LOOPS_CLASS } from '../../constants'
import { useInView } from '../../hooks/use-in-view'
import { usePreviewAutoplay } from '../../hooks/use-preview-autoplay'
import { formatNumber } from '../../utils/format'
import { Mascot } from '../mascot'
import { FreeProToggle } from './free-pro-toggle'
import { NewTabPreview } from './new-tab-preview'

interface ProHeroProps {
	dailyPriceCeiling: number | null
}

export function ProHero({ dailyPriceCeiling }: ProHeroProps) {
	const titleId = useId()
	const { isOptimalMode } = useGeneralSetting()
	const [sectionRef, inView] = useInView<HTMLElement>()
	const { isPro, isWiping, choose, setIsHovered } = usePreviewAutoplay(
		inView && !isOptimalMode
	)

	return (
		<section
			ref={sectionRef}
			aria-labelledby={titleId}
			className={cn(
				'relative overflow-hidden border rounded-widget border-vip-fill-2 bg-vip-fill p-4 @lg:p-6',
				!inView && PAUSED_LOOPS_CLASS
			)}
		>
			<div
				aria-hidden="true"
				className="absolute inset-0 opacity-70 bg-[radial-gradient(circle,var(--color-vip-fill-2)_1.1px,transparent_1.5px)] bg-size-[20px_20px]"
			/>

			<div className="relative z-20 flex items-end gap-4">
				<div className="flex-1 min-w-0 pb-5">
					<h3
						id={titleId}
						className="text-3xl font-black @2xl:text-4xl text-fg-strong"
					>
						{t('setting.vip.heroTitleLead')}
						<br />
						<span className="relative inline-block text-vip">
							{t('setting.vip.heroTitleAccent')}
							<svg
								aria-hidden="true"
								viewBox="0 0 120 16"
								preserveAspectRatio="none"
								className="absolute -left-1.5 -bottom-1 h-3.5 w-[112%] overflow-visible"
							>
								<path
									d="M3 10C25 4 48 3 70 6S105 11 117 5"
									strokeWidth="5"
									strokeLinecap="round"
									strokeDasharray="220"
									fill="none"
									className="stroke-warning animate-pro-draw"
								/>
							</svg>
						</span>{' '}
						{t('setting.vip.heroTitleTail')}
					</h3>
					<p className="max-w-md mt-3 text-sm font-medium leading-loose text-fg-muted">
						{t('setting.vip.heroBody')}
					</p>
					<div className="flex flex-wrap items-center mt-5 gap-x-4 gap-y-2">
						<FreeProToggle isPro={isPro} onChoose={choose} />
						{dailyPriceCeiling !== null && (
							<span className="text-xs font-semibold text-fg-muted">
								{t('setting.vip.dailyPriceLead')}{' '}
								<b className="font-black text-fg-strong">
									{t('setting.vip.dailyPriceAmount', {
										price: formatNumber(dailyPriceCeiling),
									})}
								</b>
							</span>
						)}
					</div>
				</div>

				<div
					aria-hidden="true"
					className="relative hidden h-48 w-72 shrink-0 @2xl:block"
				>
					<div className="absolute top-3 right-0 w-38 p-3 text-xs font-extrabold border shadow-lg rounded-2xl leading-relaxed bg-surface border-line text-fg-strong">
						<span className="absolute -left-2 top-7 size-3.5 rotate-45 border-b border-l bg-surface border-line" />
						<span
							key={isPro ? 'pro' : 'free'}
							className="relative block animate-pro-pop"
						>
							{isPro
								? t('setting.vip.guidePro')
								: t('setting.vip.guideFree')}
						</span>
					</div>
					<Mascot
						pose={isPro ? 'cheer' : 'wave'}
						className="absolute left-0 -bottom-3.5 w-36"
					/>
				</div>
			</div>

			<NewTabPreview
				isPro={isPro}
				isWiping={isWiping}
				onHoverChange={setIsHovered}
			/>
		</section>
	)
}
