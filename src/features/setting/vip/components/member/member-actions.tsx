import { useId } from 'react'
import { type MessageKey, t } from '@/common/i18n'
import { callEvent } from '@/common/utils/call-event'
import { Icon, type IconName } from '@/icons'
import { SectionHeading } from '../section-heading'

const openWidgets = () =>
	callEvent('openAddCustomWidgetModal', { returnToSettings: true })

const ACTIONS: {
	icon: IconName
	title: MessageKey
	body: MessageKey
	link: MessageKey
	run: () => void
}[] = [
	{
		icon: 'currency',
		title: 'setting.vip.actionCurrencyTitle',
		body: 'setting.vip.actionCurrencyBody',
		link: 'setting.tab.widgetsManage',
		run: openWidgets,
	},
	{
		icon: 'outlineSquares2X2',
		title: 'setting.vip.actionDesignTitle',
		body: 'setting.vip.actionDesignBody',
		link: 'setting.vip.actionDesignLink',
		run: openWidgets,
	},
	{
		icon: 'videoCamera',
		title: 'setting.vip.actionVideoTitle',
		body: 'setting.vip.actionVideoBody',
		link: 'setting.tab.wallpapers',
		run: () => callEvent('openSettings', 'wallpapers'),
	},
	{
		icon: 'user',
		title: 'setting.vip.actionAvatarTitle',
		body: 'setting.vip.actionAvatarBody',
		link: 'setting.tab.profile',
		run: () => callEvent('openSettings', 'profile'),
	},
]

export function MemberActions() {
	const titleId = useId()

	return (
		<section aria-labelledby={titleId} className="flex flex-col gap-4">
			<SectionHeading
				id={titleId}
				title={t('setting.vip.actionsTitle')}
				description={t('setting.vip.actionsBody')}
			/>
			<ul className="grid gap-3 @lg:grid-cols-2">
				{ACTIONS.map((action) => (
					<li key={action.title}>
						<button
							type="button"
							onClick={action.run}
							className="flex flex-col items-start w-full h-full gap-2.5 p-4 border cursor-pointer text-start min-h-42 rounded-2xl bg-surface-2 border-surface-3 transition-ui duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-vip-fill-2 focus-visible:focus-ring"
						>
							<span className="grid rounded-xl size-10.5 place-items-center bg-vip-fill text-vip">
								<Icon name={action.icon} size={20} />
							</span>
							<span className="text-sm font-extrabold text-fg-strong">
								{t(action.title)}
							</span>
							<span className="text-xs leading-relaxed text-fg-muted">
								{t(action.body)}
							</span>
							<span className="inline-flex items-center gap-1 mt-auto text-xs font-extrabold text-vip">
								{t(action.link)}
								<Icon name="arrowLeft" size={14} />
							</span>
						</button>
					</li>
				))}
			</ul>
		</section>
	)
}
