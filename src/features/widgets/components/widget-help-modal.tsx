import { memo, useState } from 'react'
import { Modal, Button } from '@/components/ui'
import { Icon } from '@/icons'
import { cn } from '@/common/utils/cn'
import { t, type MessageKey } from '@/common/i18n'

interface WidgetHelpModalProps {
	isOpen: boolean
	onClose: () => void
}

type TabType = 'move' | 'styles' | 'add' | 'presets'

interface HelpTabItem {
	id: TabType
	labelKey: MessageKey
	icon: 'move' | 'viewGridAdd' | 'plus' | 'squares2X2'
	videoUrl: string
	badgeKey: MessageKey
	titleKey: MessageKey
	descriptionKey: MessageKey
	tipKeys: MessageKey[]
}

const CDN_BASE_URL = 'https://cdn.widgetify.ir/extension/help_videos/'

const HELP_TABS: HelpTabItem[] = [
	{
		id: 'move',
		labelKey: 'widgets.help.tab.move.label',
		icon: 'move',
		videoUrl: `${CDN_BASE_URL}JABEJAIE-WIDGET-HA.webm`,
		badgeKey: 'widgets.help.tab.move.badge',
		titleKey: 'widgets.help.tab.move.title',
		descriptionKey: 'widgets.help.tab.move.description',
		tipKeys: [
			'widgets.help.tab.move.tipEnterEdit',
			'widgets.help.tab.move.tipDrag',
			'widgets.help.tab.move.tipFinish',
		],
	},
	{
		id: 'styles',
		labelKey: 'widgets.help.tab.styles.label',
		icon: 'viewGridAdd',
		videoUrl: `${CDN_BASE_URL}WIDGET-STYLES.webm`,
		badgeKey: 'widgets.help.tab.styles.badge',
		titleKey: 'widgets.help.tab.styles.title',
		descriptionKey: 'widgets.help.tab.styles.description',
		tipKeys: [
			'widgets.help.tab.styles.tipRightClick',
			'widgets.help.tab.styles.tipPickSize',
			'widgets.help.tab.styles.tipChangeStyle',
		],
	},
	{
		id: 'add',
		labelKey: 'widgets.help.tab.add.label',
		icon: 'plus',
		videoUrl: `${CDN_BASE_URL}ADD-NEW-ITEM-AND-NEW-LIST.webm`,
		badgeKey: 'widgets.help.tab.add.badge',
		titleKey: 'widgets.help.tab.add.title',
		descriptionKey: 'widgets.help.tab.add.description',
		tipKeys: [
			'widgets.help.tab.add.tipOpenAdd',
			'widgets.help.tab.add.tipPickWidget',
			'widgets.help.tab.add.tipMultiple',
		],
	},
	{
		id: 'presets',
		labelKey: 'widgets.help.tab.presets.label',
		icon: 'squares2X2',
		videoUrl: `${CDN_BASE_URL}CHANGE-PREPARED-ITEMS-2.webm`,
		badgeKey: 'widgets.help.tab.presets.badge',
		titleKey: 'widgets.help.tab.presets.title',
		descriptionKey: 'widgets.help.tab.presets.description',
		tipKeys: [
			'widgets.help.tab.presets.tipOpenPresets',
			'widgets.help.tab.presets.tipPreview',
			'widgets.help.tab.presets.tipApply',
		],
	},
]

function WidgetHelpModalComponent({ isOpen, onClose }: WidgetHelpModalProps) {
	const [activeTabId, setActiveTabId] = useState<TabType>('move')
	const activeTab = HELP_TABS.find((tab) => tab.id === activeTabId) ?? HELP_TABS[0]

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={t('widgets.help.modalTitle')}
			size="lg"
			closeOnBackdropClick
			closeLabel={t('ui.common.close')}
		>
			<div className="flex flex-col gap-4 p-1 select-none text-right" dir="rtl">
				<div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 border-b border-line">
					{HELP_TABS.map((tab) => {
						const isCurrent = tab.id === activeTabId
						return (
							<button
								key={tab.id}
								type="button"
								onClick={() => setActiveTabId(tab.id)}
								className={cn(
									'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-ui cursor-pointer font-medium',
									isCurrent
										? 'bg-brand text-on-brand font-bold shadow-sm'
										: 'bg-fill-2 hover:bg-surface-3 text-fg-muted'
								)}
							>
								<Icon name={tab.icon} size={14} />
								<span>{t(tab.labelKey)}</span>
							</button>
						)
					})}
				</div>

				<div className="relative flex items-center justify-center w-full overflow-hidden border shadow-sm aspect-video max-h-56 rounded-2xl border-line bg-fill shrink-0">
					<video
						key={activeTab.videoUrl}
						src={activeTab.videoUrl}
						autoPlay
						loop
						muted
						playsInline
						className="object-cover w-full h-full"
					/>
					<div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-surface-veil backdrop-blur-md border border-line text-2xs font-bold text-fg shadow-sm">
						{t(activeTab.badgeKey)}
					</div>
				</div>

				<div className="flex items-start gap-3 p-3.5 rounded-2xl bg-fill-2 border border-line transition-ui">
					<div className="w-9 h-9 rounded-xl bg-brand-fill text-brand flex items-center justify-center shrink-0 mt-0.5">
						<Icon name={activeTab.icon} size={16} />
					</div>
					<div className="flex flex-col gap-1 justify-center">
						<span className="text-xs font-bold text-fg">
							{t(activeTab.titleKey)}
						</span>
						<p className="text-2xs leading-relaxed text-fg-muted">
							{t(activeTab.descriptionKey)}
						</p>
					</div>
				</div>

				<div className="flex flex-col gap-2 p-3 border bg-fill rounded-2xl border-line">
					{activeTab.tipKeys.map((tipKey, idx) => (
						<div key={tipKey} className="flex items-start gap-2.5">
							<span className="w-5 h-5 rounded-full bg-brand-fill text-brand flex items-center justify-center text-3xs font-bold shrink-0 mt-0.5">
								{idx + 1}
							</span>
							<p className="text-xs leading-relaxed text-fg">{t(tipKey)}</p>
						</div>
					))}
				</div>

				<div className="flex justify-end pt-2 border-t border-line">
					<Button
						type="button"
						onClick={onClose}
						color="brand"
						size="sm"
						rounded="xl"
						className="px-6 text-xs font-bold"
					>
						{t('widgets.help.gotIt')}
					</Button>
				</div>
			</div>
		</Modal>
	)
}

export const WidgetHelpModal = memo(WidgetHelpModalComponent)
