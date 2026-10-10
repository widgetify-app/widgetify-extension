import { useId } from 'react'
import { t } from '@/common/i18n'
import { callEvent } from '@/common/utils/call-event'
import { cn } from '@/common/utils/cn'
import { Button } from '@/components/ui'
import { Icon } from '@/icons'
import { PAUSED_LOOPS_CLASS } from '../../constants'
import { useInView } from '../../hooks/use-in-view'
import { Mascot } from '../mascot'

interface MemberHeroProps {
	remaining: string
	expiryDate: string
	name?: string
	onExtend: () => void
}

export function MemberHero({ remaining, expiryDate, name, onExtend }: MemberHeroProps) {
	const titleId = useId()
	const [sectionRef, inView] = useInView<HTMLElement>()

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
			<div className="relative flex flex-col gap-6 @2xl:flex-row @2xl:items-center">
				<div className="flex-1 min-w-0">
					<span className="inline-flex items-center gap-1.5 px-3 text-xs font-extrabold border rounded-full h-7.5 bg-surface border-line text-vip">
						<Icon name="sparkle" size={12} className="text-warning" />
						{t('setting.vip.memberBadge')}
					</span>
					<h3
						id={titleId}
						className="mt-3.5 text-3xl font-black @2xl:text-4xl text-fg-strong"
					>
						{t('setting.vip.memberTitleLead')}{' '}
						<span className="text-vip">{t('setting.vip.proLabel')}</span>
						{t('setting.vip.memberTitleTail')}
					</h3>
					<p className="max-w-md mt-2.5 text-sm font-medium leading-loose text-fg-muted">
						{t('setting.vip.memberBody')}
					</p>
					<div className="flex flex-wrap items-center gap-2.5 mt-5.5">
						<Button
							color="vip"
							size="lg"
							className="text-sm font-extrabold hover:-translate-y-0.5 shadow-[0_12px_26px_-12px_var(--color-vip)]"
							onClick={() =>
								callEvent('openAddCustomWidgetModal', {
									returnToSettings: true,
								})
							}
						>
							<Icon name="viewGridAdd" size={20} />
							{t('setting.vip.arrange')}
						</Button>
						<Button
							variant="outline"
							color="vip"
							size="lg"
							className="text-sm font-extrabold bg-surface border-vip-fill-2"
							onClick={onExtend}
						>
							{t('setting.vip.extend')}
						</Button>
					</div>
				</div>

				<div aria-hidden="true" className="relative w-80 h-52 mx-auto shrink-0">
					<div className="absolute top-4 right-0 flex flex-col w-64 h-40 p-5 overflow-hidden text-on-vip bg-vip rounded-widget shadow-[0_30px_50px_-26px_var(--color-vip)] [transform:rotate(-4deg)] animate-pro-pass-float">
						<svg
							aria-hidden="true"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="0.6"
							strokeLinejoin="round"
							className="absolute -left-10 -bottom-15 size-55 opacity-15"
						>
							<path d="M6.5 4h11L21 9l-9 11L3 9z" />
							<path d="M3 9h18" />
							<path d="M9.5 4L8 9l4 11 4-11-1.5-5" />
						</svg>
						<span className="absolute -inset-y-10 -right-20 w-15 bg-linear-to-r from-transparent via-image-fill to-transparent animate-pro-pass-sheen" />
						<span className="relative flex items-center justify-between text-xs font-extrabold">
							{t('setting.tab.vip')}
							<Icon name="diamond" size={20} />
						</span>
						<span className="relative flex items-baseline gap-2 mt-3">
							<span className="text-3xl font-black">
								{remaining || t('setting.vip.passActive')}
							</span>
							{remaining && (
								<span className="text-xs font-bold">
									{t('setting.vip.passLeft')}
								</span>
							)}
						</span>
						<span className="relative flex justify-between gap-2 mt-auto text-xs font-bold">
							<span className="truncate">{name}</span>
							{expiryDate && (
								<span className="shrink-0">
									{t('setting.vip.passUntil', { date: expiryDate })}
								</span>
							)}
						</span>
					</div>
					<Mascot pose="cheer" className="absolute left-0 -bottom-2 w-28" />
				</div>
			</div>
		</section>
	)
}
