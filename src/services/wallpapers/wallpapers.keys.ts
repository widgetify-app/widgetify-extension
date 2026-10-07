const wallpapersRoot = ['getWallpapers'] as const

export const wallpapersKeys = {
	categories: ['getWallpaperCategories'] as const,
	all: wallpapersRoot,
	byQuery: (query: string) => [...wallpapersRoot, query] as const,
	byCategory: (page?: number, categoryId?: string) =>
		[...wallpapersRoot, page, categoryId] as const,
	config: ['wallpaperConfig'] as const,
}
