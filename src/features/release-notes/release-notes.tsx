import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { t, type MessageKey } from '@/common/i18n'
import { callEvent } from '@/common/utils/call-event'
import { cn } from '@/common/utils/cn'
import { Button, Modal } from '@/components/ui'
import { Icon, type IconName } from '@/icons'
import { MarketItemType } from '@/services/market/market.interface'

type UpdateReleaseNotesModalProps = {
	isOpen: boolean
	onClose: () => void
	counterValue?: number | null
}

interface ReleaseHighlight {
	id: string
	icon: IconName
	tileClass: string
	titleKey: MessageKey
	bodyKey: MessageKey
}

const RELEASE_HIGHLIGHTS: ReleaseHighlight[] = [
	{
		id: 'dot-calendar',
		icon: 'calendarDays',
		tileClass: 'bg-warning-fill text-warning',
		titleKey: 'releaseNotes.item.dotCalendar.title',
		bodyKey: 'releaseNotes.item.dotCalendar.body',
	},
	{
		id: 'curated-news',
		icon: 'outlineNewspaper',
		tileClass: 'bg-danger-fill text-danger',
		titleKey: 'releaseNotes.item.news.title',
		bodyKey: 'releaseNotes.item.news.body',
	},
	{
		id: 'theme-colors',
		icon: 'theme',
		tileClass: 'bg-brand-fill text-brand',
		titleKey: 'releaseNotes.item.themes.title',
		bodyKey: 'releaseNotes.item.themes.body',
	},
	{
		id: 'sticky-note',
		icon: 'notebook',
		tileClass: 'bg-success-fill text-success',
		titleKey: 'releaseNotes.item.notes.title',
		bodyKey: 'releaseNotes.item.notes.body',
	},
	{
		id: 'tidy-layout',
		icon: 'layout',
		tileClass: 'bg-info-fill text-info',
		titleKey: 'releaseNotes.item.layout.title',
		bodyKey: 'releaseNotes.item.layout.body',
	},
]

export const UpdateReleaseNotesModal = ({
	isOpen,
	onClose,
	counterValue,
}: UpdateReleaseNotesModalProps) => {
	const [counter, setCounter] = useState<number>(0)

	useEffect(() => {
		if (isOpen && counterValue) {
			setCounter(counterValue)
			const interval = setInterval(() => {
				setCounter((prev) => {
					if (prev <= 1) {
						clearInterval(interval)
						return 0
					}
					return prev - 1
				})
			}, 1000)
			return () => clearInterval(interval)
		}

		setCounter(0)
	}, [isOpen, counterValue])

	const handleClose = () => {
		Analytics.event('release_notes_closed')
		onClose()
	}

	const handleOpenPets = () => {
		Analytics.event('release_notes_link_clicked')
		handleClose()
		callEvent('openMarketModal', { filter: MarketItemType.PET })
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title={t('releaseNotes.hero.title')}
			size="xl"
			className="max-w-3xl"
			closeOnBackdropClick={false}
			closeLabel={t('ui.common.close')}
		>
			<div className="flex flex-col gap-3 select-none text-right">
				<section className="relative w-full overflow-hidden shadow-md aspect-2/1 rounded-2xl bg-fill">
					<img
						src={'https://cdn.widgetify.ir/extension/autumn.webp'}
						alt={t('releaseNotes.pets.alt')}
						className="object-cover w-full h-full"
						draggable={false}
					/>
					<div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-5 pt-16 pb-4 bg-linear-to-t from-scrim-strong to-transparent">
						<div className="flex flex-col gap-1">
							<span className="w-fit px-2.5 py-0.5 rounded-full bg-image-fill text-2xs font-bold text-image-fg">
								{t('releaseNotes.pets.badge')}
							</span>
							<h3 className="text-xl font-bold text-image-fg">
								{t('releaseNotes.pets.names')}
							</h3>
							<p className="text-xs text-image-fg-muted">
								{t('releaseNotes.pets.storeHint')}
							</p>
						</div>
						<Button
							type="button"
							size="sm"
							color="brand"
							onClick={handleOpenPets}
							className="gap-1.5 px-4 text-xs font-bold shrink-0"
							rounded="xl"
						>
							<Icon name="paw" size={14} />
							<span>{t('releaseNotes.pets.cta')}</span>
						</Button>
					</div>
				</section>

				<ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
					{RELEASE_HIGHLIGHTS.map((item, index) => (
						<li
							key={item.id}
							className={cn(
								'flex items-center gap-3 p-3 rounded-2xl bg-fill',
								index === 0 && 'sm:col-span-2'
							)}
						>
							<span
								className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${item.tileClass}`}
							>
								<Icon name={item.icon} size={20} />
							</span>
							<span className="flex flex-col gap-0.5">
								<span className="text-sm font-bold text-fg">
									{t(item.titleKey)}
								</span>
								<span className="text-xs leading-relaxed text-fg-muted">
									{t(item.bodyKey)}
								</span>
							</span>
						</li>
					))}
				</ul>

				<div className="flex justify-end pt-1">
					<Button
						type="button"
						size="sm"
						color="brand"
						onClick={handleClose}
						disabled={counter > 0}
						className="h-10 px-8 text-xs font-bold shadow-sm"
						rounded="xl"
					>
						{counter > 0
							? t('releaseNotes.wait', {
									seconds: counter.toLocaleString('fa-IR'),
								})
							: t('releaseNotes.go')}
					</Button>
				</div>
			</div>
		</Modal>
	)
}
