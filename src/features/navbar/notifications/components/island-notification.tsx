import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { Motion as motion, Presence } from '@/common/motion'
import { callEvent } from '@/common/utils/call-event'
import { useAuth } from '@/context/auth.context'
import { Icon } from '@/icons'
import { safeAwait } from '@/services/api'
import {
	useGetNotifications,
	useNotifyAsSeen,
} from '@/services/extension/get-notifications.hook'
import { resolveIslandAction } from '../../utils/island-action'

const SHOW_DELAY_MS = 1000
const VISIBLE_MS = 10_000

export function IslandNotification() {
	const { isAuthenticated } = useAuth()
	const { data } = useGetNotifications()
	const { mutateAsync: asSeen } = useNotifyAsSeen()
	const [visible, setVisible] = useState(false)

	const island = isAuthenticated ? data?.island : null
	const id = island?.id

	useEffect(() => {
		if (!id) {
			setVisible(false)
			return
		}

		const show = setTimeout(() => setVisible(true), SHOW_DELAY_MS)
		const hide = setTimeout(() => setVisible(false), SHOW_DELAY_MS + VISIBLE_MS)

		return () => {
			clearTimeout(show)
			clearTimeout(hide)
		}
	}, [id])

	if (!island) return null

	const finish = () => {
		setVisible(false)
		safeAwait(asSeen(island.id))
	}

	const open = () => {
		const action = resolveIslandAction(island)

		if (action?.kind === 'link') {
			window.open(action.url, '_blank', 'noopener,noreferrer')
		} else if (action?.kind === 'page') {
			callEvent('go_to_page', action.goTo as any)
		} else if (action?.kind === 'action') {
			callEvent(action.goTo as any, action.target as any)
		}

		Analytics.event('island_open')
		finish()
	}

	const close = () => {
		Analytics.event('island_close')
		finish()
	}

	return (
		<Presence>
			{visible && (
				<motion.div
					key={island.id}
					initial={{ y: -96, opacity: 0, scale: 0.9 }}
					animate={{ y: 0, opacity: 1, scale: 1 }}
					exit={{ y: -96, opacity: 0, scale: 0.9 }}
					transition={{ type: 'spring', stiffness: 420, damping: 32 }}
					className="fixed inset-x-0 top-4 z-popover flex justify-center px-4 pointer-events-none"
				>
					<div
						role="status"
						className="relative flex items-center max-w-full border rounded-full shadow-lg pointer-events-auto group border-line bg-glass-surface-2"
					>
						<button
							type="button"
							onClick={open}
							className="flex items-center min-w-0 gap-3 py-2 ps-2 pe-6 rounded-full cursor-pointer text-start transition-ui hover:bg-fill focus-visible:focus-ring"
						>
							<span className="grid overflow-hidden rounded-full size-11 shrink-0 place-items-center bg-surface">
								{island.icon && (
									<img
										src={island.icon}
										alt=""
										className="object-contain size-7"
									/>
								)}
							</span>
							<span className="flex flex-col min-w-0">
								<span
									className="text-sm font-bold truncate text-fg-strong"
									dir="auto"
								>
									{island.title}
								</span>
								{island.description && (
									<span
										className="text-xs truncate text-fg-muted"
										dir="auto"
									>
										{island.description}
									</span>
								)}
							</span>
						</button>
						<button
							type="button"
							onClick={close}
							aria-label={t('ui.common.close')}
							className="absolute grid border rounded-full opacity-0 cursor-pointer -top-2 -end-2 size-6 place-items-center border-line bg-surface-3 text-fg-muted transition-ui group-hover:opacity-100 hover:text-fg-strong focus-visible:opacity-100 focus-visible:focus-ring"
						>
							<Icon name="close" size={12} aria-hidden="true" />
						</button>
					</div>
				</motion.div>
			)}
		</Presence>
	)
}
