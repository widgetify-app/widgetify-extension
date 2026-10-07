import { useQuery } from '@tanstack/react-query'
import { themeKeys } from '@/services/theme/theme.keys'

const THEMES_CDN = 'https://cdn.widgetify.ir/themes'

export const useGetThemeStylesheet = (theme: string, enabled: boolean) => {
	return useQuery<string>({
		queryKey: themeKeys.stylesheet(theme),
		queryFn: () => getThemeStylesheet(theme),
		enabled,
		retry: 1,
		staleTime: Number.POSITIVE_INFINITY,
	})
}

async function getThemeStylesheet(theme: string): Promise<string> {
	const response = await fetch(`${THEMES_CDN}/${theme}.css`)
	if (!response.ok) throw new Error(`theme ${theme} answered ${response.status}`)
	return response.text()
}
