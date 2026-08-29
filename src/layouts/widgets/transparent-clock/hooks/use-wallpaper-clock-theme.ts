import { useEffect, useState } from 'react'
import { getFromStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import type { StoredWallpaper } from '@/common/wallpaper.interface'

export interface WallpaperClockTheme {
	primaryColor: string
	secondaryColor: string
	accentGlow: string
	isDark: boolean
}

export const CLOCK_SHADOW_SETTINGS = {
	darkBgShadow: '0 2px 6px rgba(0, 0, 0, 0.22)',
	lightBgShadow: '0 1px 6px rgba(255, 255, 255, 0.35)',
	defaultShadow: '0 2px 6px rgba(0, 0, 0, 0.22)',
}

const DEFAULT_THEME: WallpaperClockTheme = {
	primaryColor: '#f1f5f9',
	secondaryColor: 'rgba(241, 245, 249, 0.85)',
	accentGlow: CLOCK_SHADOW_SETTINGS.defaultShadow,
	isDark: true,
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
	r /= 255
	g /= 255
	b /= 255
	const max = Math.max(r, g, b)
	const min = Math.min(r, g, b)
	let h = 0
	let s = 0
	const l = (max + min) / 2

	if (max !== min) {
		const d = max - min
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0)
				break
			case g:
				h = (b - r) / d + 2
				break
			case b:
				h = (r - g) / d + 4
				break
		}
		h /= 6
	}

	return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hexToRgb(hex: string): [number, number, number] {
	const cleaned = hex.replace('#', '').trim()
	const full =
		cleaned.length === 3
			? cleaned
					.split('')
					.map((c) => c + c)
					.join('')
			: cleaned
	const num = parseInt(full, 16)
	if (isNaN(num)) return [128, 128, 128]
	return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

function computeThemeFromHsl(
	avgL: number,
	dominantHue: number,
	dominantS: number
): WallpaperClockTheme {
	const isDark = avgL < 55

	if (dominantS < 12) {
		if (isDark) {
			return {
				primaryColor: '#f1f5f9',
				secondaryColor: 'rgba(241, 245, 249, 0.85)',
				accentGlow: CLOCK_SHADOW_SETTINGS.darkBgShadow,
				isDark: true,
			}
		}
		return {
			primaryColor: '#1e293b',
			secondaryColor: 'rgba(30, 41, 59, 0.85)',
			accentGlow: CLOCK_SHADOW_SETTINGS.lightBgShadow,
			isDark: false,
		}
	}

	if (isDark) {
		const targetS = Math.min(85, Math.max(50, dominantS + 10))
		return {
			primaryColor: `hsl(${dominantHue}, ${targetS}%, 90%)`,
			secondaryColor: `hsla(${dominantHue}, ${Math.max(40, targetS - 15)}%, 82%, 0.88)`,
			accentGlow: CLOCK_SHADOW_SETTINGS.darkBgShadow,
			isDark: true,
		}
	}

	const targetS = Math.min(90, Math.max(60, dominantS + 20))
	return {
		primaryColor: `hsl(${dominantHue}, ${targetS}%, 18%)`,
		secondaryColor: `hsla(${dominantHue}, ${Math.max(50, targetS - 10)}%, 26%, 0.88)`,
		accentGlow: CLOCK_SHADOW_SETTINGS.lightBgShadow,
		isDark: false,
	}
}

async function extractThemeFromImage(src: string): Promise<WallpaperClockTheme> {
	return new Promise((resolve) => {
		const img = new Image()
		img.crossOrigin = 'Anonymous'
		img.src = src

		img.onload = () => {
			try {
				const canvas = document.createElement('canvas')
				const ctx = canvas.getContext('2d')
				if (!ctx) {
					resolve(DEFAULT_THEME)
					return
				}

				const sampleW = 48
				const sampleH = 48
				canvas.width = sampleW
				canvas.height = sampleH
				ctx.drawImage(img, 0, 0, sampleW, sampleH)

				const data = ctx.getImageData(0, 0, sampleW, sampleH).data
				let totalL = 0
				const totalPixels = data.length / 4

				const hueWeights = new Array(12).fill(0)
				const hueSats = new Array(12).fill(0)
				const hueCounts = new Array(12).fill(0)

				for (let i = 0; i < data.length; i += 4) {
					const r = data[i]
					const g = data[i + 1]
					const b = data[i + 2]
					const [h, s, l] = rgbToHsl(r, g, b)

					totalL += l

					const bin = Math.min(11, Math.floor(h / 30))
					const vibrancy = (s / 100) * (1 - Math.abs(l - 50) / 50)
					hueWeights[bin] += vibrancy
					hueSats[bin] += s
					hueCounts[bin] += 1
				}

				const avgL = totalL / totalPixels

				let bestBin = 0
				let maxWeight = -1
				for (let b = 0; b < 12; b++) {
					if (hueWeights[b] > maxWeight) {
						maxWeight = hueWeights[b]
						bestBin = b
					}
				}

				const dominantHue = bestBin * 30 + 15
				const dominantS =
					hueCounts[bestBin] > 0
						? Math.round(hueSats[bestBin] / hueCounts[bestBin])
						: 0

				resolve(computeThemeFromHsl(avgL, dominantHue, dominantS))
			} catch {
				resolve(DEFAULT_THEME)
			}
		}

		img.onerror = () => {
			resolve(DEFAULT_THEME)
		}
	})
}

function extractThemeFromGradient(gradient: {
	from: string
	to: string
}): WallpaperClockTheme {
	const rgb1 = hexToRgb(gradient.from)
	const rgb2 = hexToRgb(gradient.to)
	const [h1, s1, l1] = rgbToHsl(...rgb1)
	const [h2, s2, l2] = rgbToHsl(...rgb2)

	const avgL = (l1 + l2) / 2
	const dominantHue = s1 >= s2 ? h1 : h2
	const dominantS = Math.max(s1, s2)

	return computeThemeFromHsl(avgL, dominantHue, dominantS)
}

export function useWallpaperClockTheme(): WallpaperClockTheme {
	const [theme, setTheme] = useState<WallpaperClockTheme>(DEFAULT_THEME)

	useEffect(() => {
		let isMounted = true

		async function updateFromWallpaper(wallpaper: StoredWallpaper | null) {
			if (!wallpaper) return

			if (wallpaper.type === 'IMAGE' && wallpaper.src) {
				const computed = await extractThemeFromImage(wallpaper.src)
				if (isMounted) setTheme(computed)
			} else if (wallpaper.type === 'GRADIENT' && wallpaper.gradient) {
				const computed = extractThemeFromGradient(wallpaper.gradient)
				if (isMounted) setTheme(computed)
			} else if (wallpaper.type === 'VIDEO') {
				if (isMounted) setTheme(DEFAULT_THEME)
			}
		}

		getFromStorage('wallpaper').then((saved) => {
			if (isMounted) updateFromWallpaper(saved)
		})

		const unsubscribe = listenEvent(
			'wallpaper_change',
			(wallpaper: StoredWallpaper) => {
				updateFromWallpaper(wallpaper)
			}
		)

		return () => {
			isMounted = false
			unsubscribe()
		}
	}, [])

	return theme
}
