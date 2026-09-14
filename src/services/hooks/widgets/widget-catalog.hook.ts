import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { getMainClient, safeAwait } from '@/services/api'
import type { AxiosError, AxiosResponse } from 'axios'
import { WIDGET_DEFINITIONS } from '@/layouts/widgets/widget-registry'
import type { WidgetSize } from '@/layouts/widgets/layout-engine/types'

export const DEFAULT_MAX_FREE_WIDGETS = 5

export interface ServerWidgetVariant {
	id: string
	label: string
	size: WidgetSize
	isVipOnly?: boolean
	meta?: Record<string, any>
}

export interface ServerWidgetSizeOption {
	w: number
	h: number
	isVipOnly?: boolean
}

export interface ServerWidgetCatalogItem {
	widgetKey: string
	label: string
	emoji: string
	category: string
	isVipOnly?: boolean
	allowedSizes: ServerWidgetSizeOption[]
	defaultSize: WidgetSize
	variants?: ServerWidgetVariant[]
	canDuplicate: boolean
}

export interface ServerCatalogConfig {
	maxFreeWidgets?: number
}

export interface ServerWidgetCatalogResponse {
	config?: ServerCatalogConfig
	widgets: ServerWidgetCatalogItem[]
}

export async function getWidgetCatalogApi(): Promise<ServerWidgetCatalogResponse | null> {
	const client = getMainClient()
	const [err, response] = await safeAwait<
		AxiosError,
		AxiosResponse<ServerWidgetCatalogResponse>
	>(client.get<ServerWidgetCatalogResponse>('/user-widgets/catalog'))

	if (err || !response) {
		return null
	}

	return response.data || null
}

export const useGetWidgetCatalog = (enabled = false) => {
	return useQuery<ServerWidgetCatalogResponse | null>({
		queryKey: ['widgetCatalog'],
		queryFn: getWidgetCatalogApi,
		staleTime: 1000 * 60 * 30,
		enabled,
	})
}

export function useWidgetVipResolver(enabled = false) {
	const { data: serverCatalog } = useGetWidgetCatalog(enabled)

	const maxFreeWidgets =
		serverCatalog?.config?.maxFreeWidgets ?? DEFAULT_MAX_FREE_WIDGETS

	const isWidgetVipOnly = useCallback((widgetKey?: string): boolean => {
		if (!widgetKey) return false
		const serverItem = serverCatalog?.widgets?.find((w) => w.widgetKey === widgetKey)
		if (serverItem && typeof serverItem.isVipOnly === 'boolean') {
			return serverItem.isVipOnly
		}
		const localDef = WIDGET_DEFINITIONS[widgetKey as keyof typeof WIDGET_DEFINITIONS]
		return Boolean(localDef?.isVipOnly)
	}, [serverCatalog])

	const isVariantVipOnly = useCallback(
		(widgetKey?: string, variantId?: string): boolean => {
		if (!widgetKey || !variantId) return false
		const serverItem = serverCatalog?.widgets?.find((w) => w.widgetKey === widgetKey)
		if (serverItem?.variants) {
			const v = serverItem.variants.find(
				(item) => item.id === variantId || item.meta?.variant === variantId
			)
			if (v && typeof v.isVipOnly === 'boolean') {
				return v.isVipOnly
			}
		}
		const localDef = WIDGET_DEFINITIONS[widgetKey as keyof typeof WIDGET_DEFINITIONS]
		const localVariant = localDef?.variants?.find(
			(item) => item.id === variantId || item.meta?.variant === variantId
		)
		return Boolean(localVariant?.isVipOnly)
		},
		[serverCatalog]
	)

	const isSizeVipOnly = useCallback(
		(widgetKey?: string, size?: { w: number; h: number }): boolean => {
		if (!widgetKey || !size) return false
		const serverItem = serverCatalog?.widgets?.find((w) => w.widgetKey === widgetKey)
		if (serverItem?.allowedSizes) {
			const match = serverItem.allowedSizes.find(
				(s) => s.w === size.w && s.h === size.h
			)
			if (match && typeof match.isVipOnly === 'boolean') {
				return match.isVipOnly
			}
		}
		const localDef = WIDGET_DEFINITIONS[widgetKey as keyof typeof WIDGET_DEFINITIONS]
		const localSize = localDef?.allowedSizes?.find(
			(s) => s.w === size.w && s.h === size.h
		)
		return Boolean(localSize?.isVipOnly)
		},
		[serverCatalog]
	)

	return useMemo(
		() => ({
			serverWidgets: serverCatalog?.widgets,
			maxFreeWidgets,
			isWidgetVipOnly,
			isVariantVipOnly,
			isSizeVipOnly,
		}),
		[
			serverCatalog,
			maxFreeWidgets,
			isWidgetVipOnly,
			isVariantVipOnly,
			isSizeVipOnly,
		]
	)
}
