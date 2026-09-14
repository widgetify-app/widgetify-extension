import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { showToast } from '@/common/toast'
import {
	getUserWidgetsApi,
	syncUserWidgetsApi,
} from '@/services/hooks/widgets/widget-sync.hook'
import { useAuth } from './auth.context'
import { type WidgetItem, WidgetKeys } from '@/layouts/widgets/layout-engine/types'
import { widgetItems } from '@/layouts/widgets/widget-registry'

export { WidgetKeys, type WidgetItem, widgetItems }

interface WidgetVisibilityContextType {
	visibility: WidgetKeys[]
	toggleWidget: (widgetId: WidgetKeys) => void
	getSortedWidgets: () => WidgetItem[]
}

const defaultVisibility: WidgetKeys[] = [
	WidgetKeys.calendar,
	WidgetKeys.yadKar,
	WidgetKeys.tools,
	WidgetKeys.comboWidget,
]
export const MAX_VISIBLE_WIDGETS = 5

const WidgetVisibilityContext = createContext<WidgetVisibilityContextType | undefined>(
	undefined
)

const getDefaultWidgetOrders = (): Record<WidgetKeys, number> => {
	const orders: Record<WidgetKeys, number> = {} as Record<WidgetKeys, number>
	for (const item of widgetItems) {
		orders[item.id] = item.order
	}
	return orders
}

export function WidgetVisibilityProvider({ children }: { children: ReactNode }) {
	const [visibility, setVisibility] = useState<WidgetKeys[]>(defaultVisibility)
	const [widgetOrders, setWidgetOrders] =
		useState<Record<WidgetKeys, number>>(getDefaultWidgetOrders)
	const syncTimerRef = useRef<NodeJS.Timeout | null>(null)
	const hasFetchedServerRef = useRef<boolean>(false)
	const { isAuthenticated } = useAuth()

	const saveActiveWidgets = (
		currentVisibility = visibility,
		currentOrders = widgetOrders
	) => {
		const activeWidgets = widgetItems
			.filter((item) => currentVisibility.includes(item.id))
			.map((item) => ({
				...item,
				order: currentOrders[item.id] ?? item.order,
			}))
		setToStorage('activeWidgets', activeWidgets)

		if (isAuthenticated) {
			if (syncTimerRef.current) {
				clearTimeout(syncTimerRef.current)
			}
			syncTimerRef.current = setTimeout(() => {
				syncUserWidgetsApi({
					workspace: 'HOME',
					widgets: activeWidgets.map((w, index) => ({
						widgetKey: w.id,
						order: w.order ?? index,
						col: 0,
						row: 0,
						width: 2,
						height: 3,
					})),
				}).catch(() => {})
			}, 1000)
		}
	}

	useEffect(() => {
		async function initActiveWidgets() {
			try {
				const storedVisibility = await getFromStorage('activeWidgets')
				if (
					storedVisibility &&
					Array.isArray(storedVisibility) &&
					storedVisibility.length > 0
				) {
					let visibilityIds = storedVisibility
						.filter((item) => widgetItems.some((w) => w.id === item.id))
						.map((item: any) => item.id as WidgetKeys)

					if (
						visibilityIds.includes(WidgetKeys.todos) ||
						visibilityIds.includes(WidgetKeys.notes)
					) {
						Analytics.event('yadkar_merged')
						visibilityIds = visibilityIds.filter(
							(id) => id !== WidgetKeys.todos && id !== WidgetKeys.notes
						)
						if (!visibilityIds.includes(WidgetKeys.yadKar)) {
							visibilityIds.push(WidgetKeys.yadKar)
						}
					}

					const orders: Record<WidgetKeys, number> = getDefaultWidgetOrders()
					for (const item of storedVisibility) {
						orders[item.id as WidgetKeys] =
							item.order ?? getDefaultWidgetOrders()[item.id as WidgetKeys]
					}

					if (visibilityIds.length > 0) {
						setVisibility(visibilityIds)
						setWidgetOrders(orders)
					}
				}
			} catch (err) {
				console.error('Failed to load local active widgets', err)
			}
		}

		initActiveWidgets()
	}, [])

	useEffect(() => {
		if (!isAuthenticated || hasFetchedServerRef.current) return
		hasFetchedServerRef.current = true

		let isCancelled = false

		async function fetchAndReconcileVisibility() {
			try {
				const serverWidgets = await getUserWidgetsApi('HOME')

				if (isCancelled) return

				if (serverWidgets && serverWidgets.length > 0) {
					const visibilityIds = serverWidgets
						.map((sw) => sw.widgetKey as WidgetKeys)
						.filter((k) => widgetItems.some((w) => w.id === k))

					const orders: Record<WidgetKeys, number> = getDefaultWidgetOrders()
					for (const sw of serverWidgets) {
						orders[sw.widgetKey as WidgetKeys] = sw.order ?? 0
					}

					if (visibilityIds.length > 0) {
						setVisibility(visibilityIds)
						setWidgetOrders(orders)
						const activeWidgets = widgetItems
							.filter((item) => visibilityIds.includes(item.id))
							.map((item) => ({
								...item,
								order: orders[item.id] ?? item.order,
							}))
						setToStorage('activeWidgets', activeWidgets)
					}
				}
			} catch (err) {
				console.error('Background visibility fetch error', err)
			}
		}

		fetchAndReconcileVisibility()

		return () => {
			isCancelled = true
		}
	}, [isAuthenticated])

	const toggleWidget = (widgetId: WidgetKeys) => {
		setVisibility((prev) => {
			const isCurrentlyVisible = prev.includes(widgetId)

			if (!isCurrentlyVisible) {
				if (!isAuthenticated && prev.length >= MAX_VISIBLE_WIDGETS) {
					showToast(
						`کاربران مهمان تنها می‌توانند حداکثر ${MAX_VISIBLE_WIDGETS} ویجت فعال کنند. برای فعال کردن ویجت‌های بیشتر، وارد حساب کاربری خود شوید.`,
						'error'
					)
					return prev
				}
			}

			const newVisibility = isCurrentlyVisible
				? prev.filter((id) => id !== widgetId)
				: [...prev, widgetId]

			if (isCurrentlyVisible) {
				Analytics.event(`widget_remove_${widgetId}`)
			} else {
				Analytics.event(`widget_add_${widgetId}`)
			}

			saveActiveWidgets(newVisibility, widgetOrders)
			return newVisibility
		})
	}

	const getSortedWidgets = (): WidgetItem[] => {
		return widgetItems
			.filter((item) => visibility.includes(item.id))
			.map((item) => ({
				...item,
				order: widgetOrders[item.id] ?? item.order,
			}))
			.sort((a, b) => a.order - b.order)
	}
	return (
		<WidgetVisibilityContext.Provider
			value={{
				visibility,
				toggleWidget,
				getSortedWidgets,
			}}
		>
			{children}
		</WidgetVisibilityContext.Provider>
	)
}

export const useWidgetVisibility = () => {
	const context = useContext(WidgetVisibilityContext)
	if (context === undefined) {
		throw new Error(
			'useWidgetVisibility must be used within a WidgetVisibilityProvider'
		)
	}
	return context
}
