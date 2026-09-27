export const galleryKeys = {
	assets: ['gallery-assets'] as const,
	assetsPage: (params: unknown) => ['gallery-assets', params] as const,
	categories: (type?: string) => ['gallery-categories', type] as const,
}
