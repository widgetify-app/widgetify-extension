import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'

export type GalleryAssetType = 'PHOTO_FRAME' | 'BOOKMARK_ICON' | 'AVATAR'

export interface GalleryAsset {
	id: string
	title: string | null
	fileKey: string
	url: string
	previewUrl: string | null
	type: GalleryAssetType
	price: number
	accessVip: boolean
	category: string | null
	isUnlocked: boolean
	isOwned: boolean
	usedCount: number
	order: number
	isActive: boolean
	createdAt: string
}

export interface GalleryPagination {
	page: number
	limit: number
	total: number
	totalPages: number
}

export interface GalleryResponse {
	data: {
		assets: GalleryAsset[]
		pagination: GalleryPagination
	}
}

export interface GetGalleryParams {
	page?: number
	limit?: number
	type?: GalleryAssetType
	category?: string
}

export async function getGalleryAssets(
	params: GetGalleryParams = {}
): Promise<GalleryResponse> {
	const client = getMainClient()
	const { data } = await client.get<GalleryResponse>('/gallery', {
		params: {
			page: params.page ?? 1,
			limit: params.limit ?? 50,
			...(params.type ? { type: params.type } : {}),
			...(params.category ? { category: params.category } : {}),
		},
	})
	return data
}

export async function getGalleryCategories(type?: GalleryAssetType): Promise<string[]> {
	const client = getMainClient()
	const { data } = await client.get<{ data: { categories: string[] } }>(
		'/gallery/categories',
		{
			params: type ? { type } : {},
		}
	)
	return data.data.categories
}

export async function purchaseGalleryAsset(
	assetId: string
): Promise<{ data: { success: boolean; asset: GalleryAsset } }> {
	const client = getMainClient()
	const { data } = await client.post<{
		data: { success: boolean; asset: GalleryAsset }
	}>(`/gallery/${assetId}/purchase`)
	return data
}

export function useGetGalleryAssets(params: GetGalleryParams = {}, enabled = true) {
	return useQuery<GalleryResponse>({
		queryKey: ['gallery-assets', params],
		queryFn: () => getGalleryAssets(params),
		staleTime: 1000 * 60 * 5,
		enabled,
	})
}

export function useGetGalleryCategories(type?: GalleryAssetType, enabled = true) {
	return useQuery<string[]>({
		queryKey: ['gallery-categories', type],
		queryFn: () => getGalleryCategories(type),
		staleTime: 1000 * 60 * 10,
		enabled,
	})
}

export function usePurchaseGalleryAsset() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (assetId: string) => purchaseGalleryAsset(assetId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['gallery-assets'] })
			queryClient.invalidateQueries({ queryKey: ['getUser'] })
		},
	})
}
