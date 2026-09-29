import { getMainClient, safeAwait } from '@/services/api'
import type { AxiosError, AxiosResponse } from 'axios'
import type { ServerWidgetCatalogResponse } from './widget-catalog.hook'

interface ServerUserWidget {
	instanceId: string
	widgetKey: string
	ui: 'ADVANCED' | 'SIMPLE' | 'CUSTOM'
	workspace: 'HOME'
	col: number
	row: number
	width: number
	height: number
	order: number
	meta?: any
	disabled: boolean
	createdAt: string
	updatedAt: string
}

interface CreateUserWidgetPayload {
	widgetKey: string
	ui?: 'ADVANCED' | 'SIMPLE' | 'CUSTOM'
	workspace?: 'HOME'
	col?: number
	row?: number
	width?: number
	height?: number
	order?: number
	meta?: any
	disabled?: boolean
}

interface UpdateUserWidgetPayload {
	col?: number
	row?: number
	width?: number
	height?: number
	order?: number
	meta?: any
	disabled?: boolean
}

interface SyncWidgetItemPayload {
	instanceId?: string
	widgetKey: string
	col?: number
	row?: number
	width?: number
	height?: number
	order?: number
	meta?: any
	disabled?: boolean
}

interface SyncUserWidgetsPayload {
	workspace?: 'HOME'
	widgets: SyncWidgetItemPayload[]
}

interface GetUserWidgetsApiResponse {
	widgets: ServerUserWidget[]
	catalog?: ServerWidgetCatalogResponse
}

export async function getUserWidgetsApi(
	workspace: string = 'HOME'
): Promise<GetUserWidgetsApiResponse | null> {
	const client = getMainClient()
	const [err, response] = await safeAwait<
		AxiosError,
		AxiosResponse<GetUserWidgetsApiResponse>
	>(
		client.get<GetUserWidgetsApiResponse>('/user-widgets', {
			params: { workspace },
		})
	)

	if (err || !response) {
		return null
	}

	return response.data || null
}

export async function createUserWidgetApi(
	payload: CreateUserWidgetPayload
): Promise<ServerUserWidget | null> {
	const client = getMainClient()
	const [err, response] = await safeAwait<AxiosError, AxiosResponse<ServerUserWidget>>(
		client.post<ServerUserWidget>('/user-widgets', payload)
	)

	if (err || !response) {
		return null
	}

	return response.data
}

export async function updateUserWidgetApi(
	instanceId: string,
	payload: UpdateUserWidgetPayload
): Promise<ServerUserWidget | null> {
	const client = getMainClient()
	const [err, response] = await safeAwait<AxiosError, AxiosResponse<ServerUserWidget>>(
		client.put<ServerUserWidget>(`/user-widgets/${instanceId}`, payload)
	)

	if (err || !response) {
		return null
	}

	return response.data
}

export async function deleteUserWidgetApi(
	instanceId: string
): Promise<{ success: boolean; message?: string } | null> {
	const client = getMainClient()
	const [err, response] = await safeAwait<
		AxiosError,
		AxiosResponse<{ success: boolean; message?: string }>
	>(
		client.delete<{ success: boolean; message?: string }>(
			`/user-widgets/${instanceId}`
		)
	)

	if (err || !response) {
		return null
	}

	return response.data
}

export async function syncUserWidgetsApi(
	payload: SyncUserWidgetsPayload
): Promise<ServerUserWidget[] | null> {
	const client = getMainClient()
	const [err, response] = await safeAwait<
		AxiosError,
		AxiosResponse<{ widgets: ServerUserWidget[] }>
	>(client.post<{ widgets: ServerUserWidget[] }>('/user-widgets/sync', payload))

	if (err || !response) {
		return null
	}

	return response.data?.widgets || []
}
