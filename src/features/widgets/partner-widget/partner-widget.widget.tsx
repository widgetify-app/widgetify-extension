import { useEffect, useReducer, useRef, useState, useSyncExternalStore } from 'react'
import { t } from '@/common/i18n'
import { callEvent } from '@/common/utils/call-event'
import { PopoverMenuItem, Spinner } from '@/components/ui'
import { useAppearanceSetting } from '@/context/appearance.context'
import { useAuth } from '@/context/auth.context'
import { useTheme } from '@/context/theme.context'
import { WidgetEmpty } from '@/features/widgets/components/widget-empty'
import { WidgetError } from '@/features/widgets/components/widget-error'
import { WidgetContainer } from '@/features/widgets/components/widget-container'
import { usePartnerAccess } from '@/features/widgets/partner-access.context'
import { WidgetHeader } from '@/features/widgets/components/widget-header'
import {
	WidgetUnavailable,
	WidgetUnavailableTile,
} from '@/features/widgets/components/widget-unavailable'
import { useWidgetMenuActions } from '@/features/widgets/widget-menu.context'
import { Icon } from '@/icons'
import { partnerCatalogStore } from '@/features/widgets/utils/partner-catalog/partner-catalog-store'
import type { PartnerCatalogItem } from '@/features/widgets/types'
import type {
	PartnerWidgetKey,
	WidgetSize,
} from '@/features/widgets/utils/layout-engine/types'
import {
	type PartnerLaunchResponse,
	useLaunchPartnerWidget,
} from '@/services/widgets/launch-partner-widget.hook'
import { useColorScheme } from './hooks/use-color-scheme'
import { useInViewport } from './hooks/use-in-viewport'
import { frameSlots } from './utils/frame-slots'
import { INITIAL_HOST_STATE, hostReducer, isFramed } from './utils/host-state'
import { launchFailureOf } from '@/features/widgets/utils/partner-catalog/launch-failure'
import {
	REFRESH_MIN_INTERVAL_MS,
	authMessage,
	buildFrameUrl,
	createRefreshLimiter,
	frameMessageKind,
	hostAllow,
	hostSandbox,
	launchTimeoutMs,
} from './utils/protocol'

interface Prop {
	widgetKey: PartnerWidgetKey
	instanceId: string
	size: WidgetSize
	meta?: { variant?: unknown } | null
}

export function PartnerWidget({ widgetKey, instanceId, size, meta }: Prop) {
	const { items } = useSyncExternalStore(
		partnerCatalogStore.subscribe,
		partnerCatalogStore.get
	)

	const item = items.find((entry) => entry.widgetKey === widgetKey)

	if (!item) {
		return <WidgetUnavailableTile instanceId={instanceId} />
	}

	const variant = typeof meta?.variant === 'string' ? meta.variant : null

	return (
		<WidgetContainer contentClassName="p-3 gap-2">
			<WidgetHeader title={item.title} />

			<PartnerFrame
				item={item}
				instanceId={instanceId}
				size={size}
				variant={variant}
			/>
		</WidgetContainer>
	)
}

interface FrameProp {
	item: PartnerCatalogItem
	instanceId: string
	size: WidgetSize
	variant: string | null
}

function PartnerFrame({ item, instanceId, size, variant }: FrameProp) {
	const rootRef = useRef<HTMLDivElement>(null)
	const frameRef = useRef<HTMLIFrameElement>(null)
	const refreshLimiter = useRef(createRefreshLimiter(REFRESH_MIN_INTERVAL_MS))
	const [state, dispatch] = useReducer(hostReducer, INITIAL_HOST_STATE)
	const [launch, setLaunch] = useState<PartnerLaunchResponse | null>(null)
	const [reloadCount, setReloadCount] = useState(0)
	const { mutateAsync: launchWidget } = useLaunchPartnerWidget()
	const { isAuthenticated } = useAuth()
	const { ensureAccess } = usePartnerAccess()
	const { theme } = useTheme()
	const { fontFamily } = useAppearanceSetting()
	const colorScheme = useColorScheme(theme)
	const isVisible = useInViewport(rootRef)

	useEffect(() => {
		frameSlots.setVisible(instanceId, isVisible)

		if (isVisible) dispatch({ type: 'seen' })
	}, [isVisible, instanceId])

	useEffect(() => {
		const stop = frameSlots.onEvict((id) => {
			if (id === instanceId) dispatch({ type: 'evicted' })
		})

		return () => {
			stop()
			frameSlots.release(instanceId)
		}
	}, [instanceId])

	useEffect(() => {
		if (state.phase !== 'launching') return

		if (!isAuthenticated) {
			dispatch({ type: 'failed', failure: 'NOT_SIGNED_IN' })
			return
		}

		let cancelled = false

		launchWidget({ instanceId })
			.then((response) => {
				if (cancelled) return

				if (response.origin !== item.origin) {
					dispatch({ type: 'failed', failure: 'FAILED' })
					return
				}

				setLaunch(response)
				dispatch({ type: 'launched' })
			})
			.catch((error) => {
				if (!cancelled)
					dispatch({ type: 'failed', failure: launchFailureOf(error) })
			})

		return () => {
			cancelled = true
		}
	}, [state.phase, isAuthenticated, instanceId, item.origin, launchWidget])

	useEffect(() => {
		if (state.phase === 'needsSignIn' && isAuthenticated) dispatch({ type: 'retry' })
	}, [state.phase, isAuthenticated])

	useEffect(() => {
		if (state.phase !== 'connecting') return

		const timer = setTimeout(
			() => dispatch({ type: 'timeout' }),
			launchTimeoutMs(item.timeoutMs)
		)

		return () => clearTimeout(timer)
	}, [state.phase, item.timeoutMs])

	useEffect(() => {
		if (!isFramed(state) || !launch) return

		frameSlots.touch(instanceId)

		let current = launch

		const answer = () =>
			frameRef.current?.contentWindow?.postMessage(
				authMessage(current),
				current.origin
			)

		const onMessage = (event: MessageEvent) => {
			const kind = frameMessageKind(
				event,
				frameRef.current?.contentWindow,
				launch.origin
			)

			if (kind === 'ready') {
				answer()
				dispatch({ type: 'ready' })
			}

			if (kind === 'refresh' && refreshLimiter.current(Date.now())) {
				launchWidget({ instanceId })
					.then((response) => {
						if (response.origin !== item.origin) return

						current = response
						setLaunch(response)
						answer()
					})
					.catch(() => {})
			}
		}

		window.addEventListener('message', onMessage)

		return () => window.removeEventListener('message', onMessage)
	}, [state.phase, launch, instanceId, item.origin, launchWidget])

	const retry = () => dispatch({ type: 'retry' })

	useWidgetMenuActions(
		isFramed(state) ? (
			<PopoverMenuItem
				icon={<Icon name="refresh" size={14} />}
				label={t('widgets.partner.refresh')}
				onClick={() => setReloadCount((count) => count + 1)}
			/>
		) : null
	)

	const grantAccess = async () => {
		if (await ensureAccess(item.widgetKey)) retry()
	}

	const renderBody = () => {
		if (state.phase === 'error') {
			return <WidgetError message={t('widgets.partner.error')} onRetry={retry} />
		}

		if (state.phase === 'unavailable') {
			return <WidgetUnavailable instanceId={instanceId} />
		}

		if (state.phase === 'needsSignIn') {
			return (
				<WidgetEmpty
					art="user"
					title={t('widgets.partner.signIn.title')}
					action={{
						label: t('widgets.partner.signIn.action'),
						onClick: () => callEvent('openProfile'),
					}}
				/>
			)
		}

		if (state.phase === 'needsConsent') {
			return (
				<WidgetEmpty
					art="consent"
					title={t('widgets.partner.consent.title')}
					action={{
						label: t('widgets.partner.consent.action'),
						onClick: grantAccess,
					}}
				/>
			)
		}

		if (state.phase === 'needsContact') {
			return (
				<WidgetEmpty
					art="user"
					title={t('widgets.partner.contact.title')}
					action={{
						label: t('widgets.partner.contact.action'),
						onClick: grantAccess,
					}}
				/>
			)
		}

		return null
	}

	const body = renderBody()

	const frameUrl =
		isFramed(state) && launch
			? buildFrameUrl({
					widgetUrl: launch.widgetUrl,
					theme,
					colorScheme,
					font: fontFamily,
					width: size.w,
					height: size.h,
					variant,
				})
			: null

	return (
		<div ref={rootRef} className="relative flex-1 min-h-0 w-full">
			{frameUrl && (
				<iframe
					key={`${frameUrl}#${reloadCount}`}
					ref={frameRef}
					src={frameUrl}
					title={item.title}
					allow={hostAllow(item.allow)}
					sandbox={hostSandbox(item.sandbox)}
					referrerPolicy="no-referrer"
					className={`w-full h-full border-none transition-opacity duration-300 ${state.phase === 'ready' ? 'opacity-100' : 'opacity-0'}`}
				/>
			)}

			{!body && state.phase !== 'ready' && (
				<div className="absolute inset-0 flex items-center justify-center">
					<Spinner size="sm" aria-hidden="true" />
				</div>
			)}

			{body && <div className="absolute inset-0">{body}</div>}
		</div>
	)
}
