export const wallpapersKeys = {
	categories: ['getWallpaperCategories'] as const,
	byQuery: (query: string) => ['getWallpapers', query] as const,
	byCategory: (page?: number, categoryId?: string) =>
		['getWallpapers', page, categoryId] as const,
	config: ['wallpaperConfig'] as const,
}
