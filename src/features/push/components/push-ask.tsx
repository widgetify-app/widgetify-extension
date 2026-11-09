import { useEffect } from 'react'
import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { Motion as motion } from '@/common/motion'
import { setToStorage } from '@/common/storage'
import { Button } from '@/components/ui'
import { Icon } from '@/icons'

interface Props {
	onAccept: () => void
	onLater: () => void
}

export function PushAsk({ onAccept, onLater }: Props) {
	useEffect(() => {
		Analytics.event('push_ask_view')
	}, [])

	const remember = () => setToStorage('pushAskedAt', Date.now())

	const accept = () => {
		remember()
		Analytics.event('push_ask_accept')
		onAccept()
	}

	const later = () => {
		remember()
		Analytics.event('push_ask_later')
		onLater()
	}

	return (
		<motion.div
			initial={{ y: -96, opacity: 0, scale: 0.9 }}
			animate={{ y: 0, opacity: 1, scale: 1 }}
			transition={{ type: 'spring', stiffness: 420, damping: 32 }}
			className="fixed inset-x-0 top-4 z-popover flex justify-center px-4 pointer-events-none"
		>
			<div
				role="status"
				className="flex items-center max-w-full gap-4 py-2 border rounded-full shadow-lg pointer-events-auto ps-2 pe-6 border-line bg-glass-surface-2"
			>
				<span className="grid rounded-full size-10 shrink-0 place-items-center bg-brand-fill text-brand">
					<Icon name="notification" size={20} aria-hidden="true" />
				</span>
				<span className="flex flex-col min-w-0">
					<span className="text-sm font-bold text-fg-strong">
						{t('push.ask.title')}
					</span>
					<span className="text-xs text-fg-muted">{t('push.ask.text')}</span>
				</span>
				<span className="flex gap-2 shrink-0">
					<Button size="sm" color="brand" rounded="full" onClick={accept}>
						{t('push.ask.accept')}
					</Button>
					<Button size="sm" variant="ghost" rounded="full" onClick={later}>
						{t('push.ask.later')}
					</Button>
				</span>
			</div>
		</motion.div>
	)
}
