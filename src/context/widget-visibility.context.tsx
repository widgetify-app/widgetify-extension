import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { showToast } from '@/common/toast'
import { useAuth } from './auth.context'
import { type WidgetItem, WidgetKeys } from '@widget/layout-engine/types'
import { widgetItems } from '@widget/widget-registry'

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
	}

	useEffect(() => {
		async function initActiveWidgets() {
			try {
				const storedVisibility = await getFromStorage('activeWidgets')
				if (Array.isArray(storedVisibility) && storedVisibility.length > 0) {
					let visibilityIds = storedVisibility
						.map((w: any) => (w?.id ? w.id : w))
						.filter((id) => widgetItems.some((w) => w.id === id))

					const hadOldNotesOrTodos =
						visibilityIds.includes(WidgetKeys.todos) ||
						visibilityIds.includes(WidgetKeys.notes)

					if (hadOldNotesOrTodos) {
						visibilityIds = visibilityIds.filter(
							(id) => id !== WidgetKeys.todos && id !== WidgetKeys.notes
						)
						if (!visibilityIds.includes(WidgetKeys.yadKar)) {
							visibilityIds.push(WidgetKeys.yadKar)
						}
					}

					const orders: Record<WidgetKeys, number> = getDefaultWidgetOrders()
					for (const w of storedVisibility) {
						if (w?.id && typeof w.order === 'number') {
							orders[w.id as WidgetKeys] = w.order
						}
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

			saveActiveWidgets(newVisibility)
			return newVisibility
		})
	}

	const getSortedWidgets = (): WidgetItem[] => {
		return widgetItems
			.filter((item) => visibility.includes(item.id))
			.sort((a, b) => {
				const orderA = widgetOrders[a.id] ?? a.order
				const orderB = widgetOrders[b.id] ?? b.order
				return orderA - orderB
			})
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
	if (!context) {
		throw new Error(
			'useWidgetVisibility must be used within a WidgetVisibilityProvider'
		)
	}
	return context
}
