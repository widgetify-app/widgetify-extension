import { useQuery } from '@tanstack/react-query'
import { getMainClient, safeAwait } from '@/services/api'
import type { AxiosError, AxiosResponse } from 'axios'
import { widgetsKeys } from '@/services/widgets/widgets.keys'

interface ServerWidgetVariant {
	id: string
	label: string
	size: { w: number; h: number }
	isVipOnly?: boolean
	meta?: Record<string, any>
}

interface ServerWidgetSizeOption {
	w: number
	h: number
	isVipOnly?: boolean
}

interface ServerWidgetCatalogItem {
	widgetKey: string
	label: string
	emoji: string
	category: string
	isVipOnly?: boolean
	isNew?: boolean
	allowedSizes: ServerWidgetSizeOption[]
	defaultSize: { w: number; h: number }
	variants?: ServerWidgetVariant[]
	canDuplicate: boolean
}

interface ServerCatalogConfig {
	maxFreeWidgets?: number
	featuredWidgetKeys?: string[]
}

export interface ServerWidgetCatalogResponse {
	config?: ServerCatalogConfig
	widgets: ServerWidgetCatalogItem[]
}

async function getWidgetCatalogApi(): Promise<ServerWidgetCatalogResponse | null> {
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
		queryKey: widgetsKeys.catalog,
		queryFn: getWidgetCatalogApi,
		staleTime: 1000 * 60 * 30,
		enabled,
	})
}
