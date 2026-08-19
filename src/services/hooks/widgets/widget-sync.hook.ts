import { useMutation, useQuery } from '@tanstack/react-query'
import { getMainClient, safeAwait } from '@/services/api'
import type { AxiosError, AxiosResponse } from 'axios'

export interface ServerUserWidget {
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

export interface CreateUserWidgetPayload {
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

export interface UpdateUserWidgetPayload {
	col?: number
	row?: number
	width?: number
	height?: number
	order?: number
	meta?: any
	disabled?: boolean
}

export interface SyncWidgetItemPayload {
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

export interface SyncUserWidgetsPayload {
	ui?: 'ADVANCED' | 'SIMPLE' | 'CUSTOM'
	workspace?: 'HOME'
	widgets: SyncWidgetItemPayload[]
}

export async function getUserWidgetsApi(
	ui: string = 'ADVANCED',
	workspace: string = 'HOME'
): Promise<ServerUserWidget[]> {
	const client = getMainClient()
	const [err, response] = await safeAwait<
		AxiosError,
		AxiosResponse<{ widgets: ServerUserWidget[] }>
	>(
		client.get<{ widgets: ServerUserWidget[] }>('/user-widgets', {
			params: { ui, workspace },
		})
	)

	if (err || !response) {
		return []
	}

	return response.data?.widgets || []
}

export async function createUserWidgetApi(
	payload: CreateUserWidgetPayload
): Promise<ServerUserWidget | null> {
	const client = getMainClient()
	const [err, response] = await safeAwait<
		AxiosError,
		AxiosResponse<ServerUserWidget>
	>(client.post<ServerUserWidget>('/user-widgets', payload))

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
	const [err, response] = await safeAwait<
		AxiosError,
		AxiosResponse<ServerUserWidget>
	>(client.put<ServerUserWidget>(`/user-widgets/${instanceId}`, payload))

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
): Promise<ServerUserWidget[]> {
	const client = getMainClient()
	const [err, response] = await safeAwait<
		AxiosError,
		AxiosResponse<{ widgets: ServerUserWidget[] }>
	>(
		client.post<{ widgets: ServerUserWidget[] }>('/user-widgets/sync', payload)
	)

	if (err || !response) {
		return []
	}

	return response.data?.widgets || []
}

export const useGetUserWidgets = (
	ui: 'ADVANCED' | 'SIMPLE' | 'CUSTOM' = 'ADVANCED',
	workspace: 'HOME' = 'HOME',
	enabled: boolean = true
) => {
	return useQuery<ServerUserWidget[]>({
		queryKey: ['getUserWidgets', ui, workspace],
		queryFn: () => getUserWidgetsApi(ui, workspace),
		enabled,
	})
}

export const useCreateUserWidget = () => {
	return useMutation({
		mutationKey: ['createUserWidget'],
		mutationFn: (payload: CreateUserWidgetPayload) => createUserWidgetApi(payload),
	})
}

export const useUpdateUserWidget = () => {
	return useMutation({
		mutationKey: ['updateUserWidget'],
		mutationFn: ({
			instanceId,
			payload,
		}: { instanceId: string; payload: UpdateUserWidgetPayload }) =>
			updateUserWidgetApi(instanceId, payload),
	})
}

export const useDeleteUserWidget = () => {
	return useMutation({
		mutationKey: ['deleteUserWidget'],
		mutationFn: (instanceId: string) => deleteUserWidgetApi(instanceId),
	})
}

export const useSyncUserWidgets = () => {
	return useMutation({
		mutationKey: ['syncUserWidgets'],
		mutationFn: (payload: SyncUserWidgetsPayload) => syncUserWidgetsApi(payload),
	})
}
