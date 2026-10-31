import { type ReactNode, useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { t, type MessageKey } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { Button, Modal } from '@/components/ui'
import lollipopArt from '@/assets/images/release-notes/lollipop.webp'

type UpdateReleaseNotesModalProps = {
	isOpen: boolean
	onClose: () => void
	counterValue?: number | null
}

interface ReleaseHighlight {
	id: string
	preview: ReactNode
	titleKey: MessageKey
	bodyKey: MessageKey
}

const LINE = 'h-1 rounded-xs bg-fill-2'
const SOFT_BLOCK = 'rounded-sm bg-brand-fill'

const RELEASE_HIGHLIGHTS: ReleaseHighlight[] = [
	{
		id: 'friends',
		preview: (
			<span className="flex items-center justify-center gap-1">
				<span className="rounded-full size-5 bg-warning ring-2 ring-brand ring-offset-2 ring-offset-surface-2" />
				<span className="flex flex-col gap-0.75">
					<span className={cn(LINE, 'w-5')} />
					<span className="w-3.5 h-1 rounded-xs bg-brand-fill-2" />
				</span>
			</span>
		),
		titleKey: 'releaseNotes.item.friends.title',
		bodyKey: 'releaseNotes.item.friends.body',
	},
	{
		id: 'partner-widgets',
		preview: (
			<span className="flex items-center w-full gap-1 px-1.5">
				<span className={cn(SOFT_BLOCK, 'size-4.5 shrink-0')} />
				<span className={cn(LINE, 'flex-1')} />
				<span className="px-1 text-3xs font-bold leading-3 rounded-full bg-brand text-on-brand">
					{t('releaseNotes.newBadge')}
				</span>
			</span>
		),
		titleKey: 'releaseNotes.item.partners.title',
		bodyKey: 'releaseNotes.item.partners.body',
	},
	{
		id: 'store',
		preview: (
			<span className="flex items-center justify-center gap-1">
				<span className={cn(SOFT_BLOCK, 'w-3 h-5')} />
				<span className="w-3 h-5 rounded-sm bg-brand" />
				<span className={cn(SOFT_BLOCK, 'w-3 h-5')} />
			</span>
		),
		titleKey: 'releaseNotes.item.store.title',
		bodyKey: 'releaseNotes.item.store.body',
	},
	{
		id: 'currency',
		preview: (
			<svg
				aria-hidden="true"
				viewBox="0 0 100 40"
				preserveAspectRatio="none"
				className="w-full h-full p-2 text-danger"
			>
				<path
					d="M0,32 C15,33 25,26 40,24 C55,22 65,14 80,13 C90,12 95,9 100,8"
					fill="none"
					stroke="currentColor"
					strokeWidth="3"
					strokeLinecap="round"
					vectorEffect="non-scaling-stroke"
				/>
			</svg>
		),
		titleKey: 'releaseNotes.item.currency.title',
		bodyKey: 'releaseNotes.item.currency.body',
	},
	{
		id: 'bigger-widgets',
		preview: (
			<span className="grid w-full h-full grid-cols-4 grid-rows-2 gap-0.75 p-1.5">
				<span className="col-span-2 row-span-2 rounded-xs bg-brand" />
				<span className="rounded-xs bg-brand-fill" />
				<span className="rounded-xs bg-brand-fill" />
				<span className="col-span-2 rounded-xs bg-brand-fill" />
			</span>
		),
		titleKey: 'releaseNotes.item.widgets.title',
		bodyKey: 'releaseNotes.item.widgets.body',
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

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size="xl"
			className="max-w-3xl"
			showCloseButton={false}
			closeOnBackdropClick={false}
			closeLabel={t('ui.common.close')}
		>
			<div className="flex flex-col gap-3.5 select-none text-right">
				<section className="relative h-50 overflow-hidden rounded-2xl bg-brand">
					<img
						src={lollipopArt}
						alt=""
						className="absolute inset-0 object-cover object-left w-full h-full"
						draggable={false}
					/>
					<div className="absolute inset-y-0 flex flex-col justify-center gap-2 right-8 w-84 max-w-[60%]">
						<span className="self-start px-2.5 py-0.5 rounded-full bg-image-fill text-2xs font-bold text-image-fg">
							{t('releaseNotes.badge')}
						</span>
						<h2 className="text-3xl font-black text-image-fg">
							{t('releaseNotes.title')}
						</h2>
						<p className="text-sm text-image-fg-muted">
							{t('releaseNotes.subtitle')}
						</p>
					</div>
				</section>

				<ul className="grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
					{RELEASE_HIGHLIGHTS.map((item, index) => (
						<li
							key={item.id}
							className={cn(
								'flex items-center gap-3 p-2',
								index === RELEASE_HIGHLIGHTS.length - 1 && 'sm:col-span-2'
							)}
						>
							<span
								aria-hidden="true"
								className="flex items-center justify-center w-16 h-11 overflow-hidden border shrink-0 rounded-xl bg-surface-2 border-surface-3"
							>
								{item.preview}
							</span>
							<span className="flex flex-col gap-0.5">
								<span className="text-sm font-bold text-fg-strong">
									{t(item.titleKey)}
								</span>
								<span className="text-xs leading-relaxed text-fg-muted">
									{t(item.bodyKey)}
								</span>
							</span>
						</li>
					))}
				</ul>

				<div className="flex justify-end pt-2.5 border-t border-line">
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
