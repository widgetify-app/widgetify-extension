import { t } from '@/common/i18n'
import { useMemo } from 'react'
import type { StoredWallpaper, Wallpaper } from '@/common/types/wallpaper.interface'
import { cn } from '@/common/utils/cn'
import { Theme } from '@/context/theme.context'
import { useWallpaperContext } from '@/context/wallpaper.context'
import { Icon } from '@/icons'
import { useGetThemeStylesheet } from '@/services/theme/get-theme-stylesheet.hook'
import { scopeThemeCss } from '../../utils/theme-css'

const BUNDLED_THEMES: string[] = Object.values(Theme)

export function ThemePreview({ theme }: { theme: string }) {
	const { selectedBackground, currentStoredWallpaper } = useWallpaperContext()
	const isRemote = !BUNDLED_THEMES.includes(theme)
	const { data: css } = useGetThemeStylesheet(theme, isRemote)
	const scopedCss = useMemo(() => (css ? scopeThemeCss(css, theme) : ''), [css, theme])
	const backdrop = wallpaperBackdrop(selectedBackground, currentStoredWallpaper)

	if (isRemote && !scopedCss) {
		return (
			<span
				aria-hidden="true"
				className="absolute inset-0 grid place-items-center bg-fill text-fg-ghost"
			>
				<Icon name="theme" size={24} />
			</span>
		)
	}

	return (
		<span
			data-theme={theme}
			aria-hidden="true"
			className="absolute inset-0 block overflow-hidden bg-center bg-cover theme-scope @container bg-surface-2"
			style={backdrop ? { backgroundImage: `url("${backdrop}")` } : undefined}
		>
			{scopedCss && <style>{scopedCss}</style>}
			<span className="absolute flex items-center justify-between top-[7%] inset-x-[5%] h-[11%] px-[3%] rounded-full bg-surface backdrop-glass shadow-sm">
				<span className="flex items-center h-full gap-[6cqw]">
					<span className="rounded-full size-[3.2cqw] bg-brand" />
					<span className="rounded-full w-[12cqw] h-[2.2cqw] bg-fill-3" />
				</span>
				<span className="rounded-full w-[9cqw] h-[2.2cqw] bg-fill-3" />
			</span>
			<span className="absolute flex gap-[3%] bottom-[7%] inset-x-[5%] h-[64%]">
				<span className="flex flex-col flex-[1.4] gap-[7%] p-[4.5cqw] rounded-lg bg-surface backdrop-glass shadow-md">
					<span className="w-1/2 rounded-full h-[2.6cqw] bg-fg-faint" />
					<TodoLine done />
					<TodoLine />
					<TodoLine />
				</span>
				<span className="flex flex-col items-center justify-center flex-1 gap-[8%] rounded-lg bg-surface backdrop-glass shadow-md">
					<span className="font-bold leading-none text-fg-strong text-[8.5cqw] tabular-nums">
						{t('market.preview.theme.clockSample')}
					</span>
					<span className="rounded-full w-[18cqw] h-[4.6cqw] bg-brand" />
				</span>
			</span>
		</span>
	)
}

function TodoLine({ done }: { done?: boolean }) {
	return (
		<span className="flex items-center gap-[2.5cqw]">
			<span
				className={cn(
					'shrink-0 border rounded-xs size-[3.4cqw] border-line',
					done && 'bg-brand border-brand'
				)}
			/>
			<span className="flex-1 rounded-full h-[2.2cqw] bg-fill-2" />
		</span>
	)
}

function wallpaperBackdrop(
	selected: Wallpaper | null,
	stored: StoredWallpaper | null
): string | undefined {
	if (selected) {
		return selected.type === 'IMAGE' ? selected.src : selected.previewSrc || undefined
	}
	return stored?.type === 'IMAGE' ? stored.src : undefined
}
