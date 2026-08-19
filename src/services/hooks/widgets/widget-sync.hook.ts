import { useMutation } from '@tanstack/react-query'
import { getMainClient, safeAwait } from '@/services/api'
import type { WidgetPosition, WidgetSize } from '@/layouts/widgets/layout-engine/types'
import type { AxiosError } from 'axios'

export interface CreateWidgetPayload {
	type: string
	position: WidgetPosition
	size: WidgetSize
	clientInstanceId: string
	settings?: Record<string, unknown>
}

export interface ServerWidgetResponse {
	id: string
	type: string
	position: WidgetPosition
	size: WidgetSize
	createdAt: string
}

/**
 * Creates a widget record on the server.
 * 
 * NOTE (Future Server Contract):
 * Endpoint: POST /widgets
 * When the server implementation is completed:
 * 1. The client sends { type, position, size, clientInstanceId, settings }
 * 2. The server creates the widget entity and returns { id, type, position, size, createdAt }
 * 3. The returned `id` is stored as `widgetId` on the client widget instance.
 * 4. All bookmarks, notes, or widgets-scoped items created inside this widget will reference this `widgetId`.
 */
export async function createWidgetApi(
	payload: CreateWidgetPayload
): Promise<ServerWidgetResponse> {
	const client = getMainClient()

	const [err, response] = await safeAwait<AxiosError, ServerWidgetResponse>(
		client.post<ServerWidgetResponse>('/widgets', payload)
	)

	if (err || !response) {
		// Mock fallback until server endpoint is implemented
		const mockServerWidgetId = `widget-srv-${payload.clientInstanceId}-${Date.now().toString(36)}`
		return {
			id: mockServerWidgetId,
			type: payload.type,
			position: payload.position,
			size: payload.size,
			createdAt: new Date().toISOString(),
		}
	}

	return response
}

export const useCreateWidget = () => {
	return useMutation({
		mutationKey: ['createWidget'],
		mutationFn: async (payload: CreateWidgetPayload) => {
			return await createWidgetApi(payload)
		},
	})
}
