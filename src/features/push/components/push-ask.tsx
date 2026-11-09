import { useEffect } from 'react'
import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { Motion as motion } from '@/common/motion'
import { setToStorage } from '@/common/storage'
import { playAlarm } from '@/common/utils/play-alarm'
import bellArt from '@/assets/images/push/bell.svg'
import { Button } from '@/components/ui'

interface Props {
	onAccept: () => void
	onLater: () => void
}

export function PushAsk({ onAccept, onLater }: Props) {
	useEffect(() => {
		Analytics.event('push_ask_view')
		playAlarm('island').catch(() => {})
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
				className="flex items-center max-w-md gap-3 py-2 border shadow-xl pointer-events-auto rounded-full ps-3 pe-4 border-line bg-glass-modal"
			>
				<img src={bellArt} alt="" className="size-10 shrink-0" />
				<span className="flex flex-col min-w-0">
					<span className="text-sm font-bold text-fg-strong">
						{t('push.ask.title')}
					</span>
					<span className="text-xs leading-control text-fg">
						{t('push.ask.text')}
					</span>
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
