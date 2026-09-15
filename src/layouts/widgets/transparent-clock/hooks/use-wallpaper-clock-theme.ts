import { useEffect, useRef, useState } from 'react'
import { getFromStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import type { StoredWallpaper } from '@/common/wallpaper.interface'

export interface WallpaperClockTheme {
	primaryColor: string
	secondaryColor: string
	accentGlow: string
	isDark: boolean
	isDerivedFromWallpaper: boolean
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
	isDerivedFromWallpaper: true,
}

const THEME_FALLBACK: WallpaperClockTheme = {
	primaryColor: 'currentColor',
	secondaryColor: 'currentColor',
	accentGlow: 'none',
	isDark: true,
	isDerivedFromWallpaper: false,
}

const MIN_CONTRAST_RATIO = 4.5

const SECONDARY_HUE_WEIGHT_RATIO = 0.45
const SECONDARY_HUE_MIN_DISTANCE = 40

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

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
	const sNorm = s / 100
	const lNorm = l / 100
	const k = (n: number) => (n + h / 30) % 12
	const a = sNorm * Math.min(lNorm, 1 - lNorm)
	const f = (n: number) =>
		lNorm - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
	return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)]
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
	if (Number.isNaN(num)) return [128, 128, 128]
	return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

function relativeLuminance(r: number, g: number, b: number): number {
	const toLinear = (c: number) => {
		const cs = c / 255
		return cs <= 0.03928 ? cs / 12.92 : ((cs + 0.055) / 1.055) ** 2.4
	}
	const rl = toLinear(r)
	const gl = toLinear(g)
	const bl = toLinear(b)
	return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl
}

function contrastRatio(lumA: number, lumB: number): number {
	const brightest = Math.max(lumA, lumB) + 0.05
	const darkest = Math.min(lumA, lumB) + 0.05
	return brightest / darkest
}

function ensureContrast(
	hue: number,
	sat: number,
	initialL: number,
	bgLuminance: number,
	isDark: boolean
): number {
	let l = initialL
	const step = isDark ? 2 : -2
	const limit = isDark ? 97 : 4

	for (let i = 0; i < 40; i++) {
		const [r, g, b] = hslToRgb(hue, sat, l)
		const ratio = contrastRatio(relativeLuminance(r, g, b), bgLuminance)
		if (ratio >= MIN_CONTRAST_RATIO) break
		if ((isDark && l >= limit) || (!isDark && l <= limit)) break
		l += step
	}

	return Math.max(0, Math.min(100, l))
}

interface DominantColor {
	hue: number
	saturation: number
	weight: number
}

interface ImageColorStats {
	avgLuminance: number
	primary: DominantColor
	secondary: DominantColor | null
}

function analyzePixels(data: Uint8ClampedArray): ImageColorStats {
	const BIN_COUNT = 12
	const BIN_SIZE = 360 / BIN_COUNT

	const hueWeights = new Array(BIN_COUNT).fill(0)
	const hueSats = new Array(BIN_COUNT).fill(0)
	const hueCounts = new Array(BIN_COUNT).fill(0)

	let totalLuminance = 0
	let opaquePixelCount = 0

	const huesForRefine: { h: number; s: number; weight: number }[] = []

	for (let i = 0; i < data.length; i += 4) {
		const alpha = data[i + 3]
		if (alpha < 20) continue

		const r = data[i]
		const g = data[i + 1]
		const b = data[i + 2]
		const [h, s, l] = rgbToHsl(r, g, b)

		totalLuminance += relativeLuminance(r, g, b)
		opaquePixelCount++

		const bin = Math.min(BIN_COUNT - 1, Math.floor(h / BIN_SIZE))
		const vibrancy = (s / 100) * (1 - Math.abs(l - 50) / 50)
		hueWeights[bin] += vibrancy
		hueSats[bin] += s
		hueCounts[bin] += 1
		huesForRefine.push({ h, s, weight: vibrancy })
	}

	if (opaquePixelCount === 0) {
		return {
			avgLuminance: 0.5,
			primary: { hue: 0, saturation: 0, weight: 0 },
			secondary: null,
		}
	}

	const avgLuminance = totalLuminance / opaquePixelCount

	const ranked = hueWeights
		.map((weight, bin) => ({ bin, weight }))
		.sort((a, b) => b.weight - a.weight)

	const bestBin = ranked[0].bin
	const bestBinCenter = bestBin * BIN_SIZE + BIN_SIZE / 2

	let sumSin = 0
	let sumCos = 0
	let sumSat = 0
	let refineWeight = 0
	const window = BIN_SIZE + 10

	for (const { h, s, weight } of huesForRefine) {
		let diff = Math.abs(h - bestBinCenter)
		if (diff > 180) diff = 360 - diff
		if (diff > window) continue
		const rad = (h * Math.PI) / 180
		sumSin += Math.sin(rad) * weight
		sumCos += Math.cos(rad) * weight
		sumSat += s * weight
		refineWeight += weight
	}

	let refinedHue = bestBinCenter
	let refinedSat = hueCounts[bestBin] > 0 ? hueSats[bestBin] / hueCounts[bestBin] : 0

	if (refineWeight > 0) {
		const angle = Math.atan2(sumSin, sumCos)
		refinedHue = ((angle * 180) / Math.PI + 360) % 360
		refinedSat = sumSat / refineWeight
	}

	const primary: DominantColor = {
		hue: Math.round(refinedHue),
		saturation: Math.round(refinedSat),
		weight: ranked[0].weight,
	}

	let secondary: DominantColor | null = null
	for (const candidate of ranked.slice(1)) {
		const candidateCenter = candidate.bin * BIN_SIZE + BIN_SIZE / 2
		let hueDistance = Math.abs(candidateCenter - primary.hue)
		if (hueDistance > 180) hueDistance = 360 - hueDistance

		if (
			candidate.weight >= primary.weight * SECONDARY_HUE_WEIGHT_RATIO &&
			hueDistance >= SECONDARY_HUE_MIN_DISTANCE
		) {
			secondary = {
				hue: Math.round(candidateCenter),
				saturation:
					hueCounts[candidate.bin] > 0
						? Math.round(hueSats[candidate.bin] / hueCounts[candidate.bin])
						: 0,
				weight: candidate.weight,
			}
			break
		}
	}

	return { avgLuminance, primary, secondary }
}

function buildTheme(stats: ImageColorStats): WallpaperClockTheme {
	const { avgLuminance, primary, secondary } = stats
	const isDark = avgLuminance < 0.4

	const shadow = isDark
		? CLOCK_SHADOW_SETTINGS.darkBgShadow
		: CLOCK_SHADOW_SETTINGS.lightBgShadow

	if (primary.saturation < 12) {
		return isDark
			? {
					primaryColor: '#f1f5f9',
					secondaryColor: 'rgba(241, 245, 249, 0.85)',
					accentGlow: shadow,
					isDark: true,
					isDerivedFromWallpaper: true,
				}
			: {
					primaryColor: '#1e293b',
					secondaryColor: 'rgba(30, 41, 59, 0.85)',
					accentGlow: shadow,
					isDark: false,
					isDerivedFromWallpaper: true,
				}
	}

	const targetS = isDark
		? Math.min(85, Math.max(50, primary.saturation + 10))
		: Math.min(90, Math.max(60, primary.saturation + 20))

	const initialL = isDark ? 90 : 18
	const finalL = ensureContrast(primary.hue, targetS, initialL, avgLuminance, isDark)

	const primaryColor = `hsl(${primary.hue}, ${targetS}%, ${finalL}%)`

	let secondaryColor: string
	if (secondary) {
		const secTargetS = isDark
			? Math.max(40, Math.min(80, secondary.saturation))
			: Math.max(50, Math.min(85, secondary.saturation + 10))
		const secInitialL = isDark ? 82 : 26
		const secFinalL = ensureContrast(
			secondary.hue,
			secTargetS,
			secInitialL,
			avgLuminance,
			isDark
		)
		secondaryColor = `hsla(${secondary.hue}, ${secTargetS}%, ${secFinalL}%, 0.88)`
	} else {
		const secS = Math.max(isDark ? 40 : 50, targetS - (isDark ? 15 : 10))
		const secL = isDark ? Math.max(70, finalL - 8) : Math.min(35, finalL + 8)
		secondaryColor = `hsla(${primary.hue}, ${secS}%, ${secL}%, 0.88)`
	}

	return {
		primaryColor,
		secondaryColor,
		accentGlow: shadow,
		isDark,
		isDerivedFromWallpaper: true,
	}
}

function extractThemeFromGradient(gradient: {
	from: string
	to: string
}): WallpaperClockTheme {
	const rgb1 = hexToRgb(gradient.from)
	const rgb2 = hexToRgb(gradient.to)
	const [h1, s1] = rgbToHsl(...rgb1)
	const [h2, s2] = rgbToHsl(...rgb2)

	const avgLuminance = (relativeLuminance(...rgb1) + relativeLuminance(...rgb2)) / 2
	const dominantHue = s1 >= s2 ? h1 : h2
	const dominantS = Math.max(s1, s2)

	let hueDistance = Math.abs(h1 - h2)
	if (hueDistance > 180) hueDistance = 360 - hueDistance
	const secondary: DominantColor | null =
		hueDistance >= SECONDARY_HUE_MIN_DISTANCE
			? {
					hue: dominantHue === h1 ? h2 : h1,
					saturation: dominantHue === h1 ? s2 : s1,
					weight: Math.min(s1, s2),
				}
			: null

	return buildTheme({
		avgLuminance,
		primary: { hue: dominantHue, saturation: dominantS, weight: Math.max(s1, s2) },
		secondary,
	})
}

async function extractThemeFromImage(src: string): Promise<WallpaperClockTheme> {
	return new Promise((resolve) => {
		const img = new Image()
		img.crossOrigin = 'Anonymous'
		img.src = src

		img.onload = () => {
			try {
				if (!img.naturalWidth || !img.naturalHeight) {
					resolve(DEFAULT_THEME)
					return
				}

				const canvas = document.createElement('canvas')
				const ctx = canvas.getContext('2d')
				if (!ctx) {
					resolve(DEFAULT_THEME)
					return
				}

				const sampleW = 64
				const sampleH = 64
				canvas.width = sampleW
				canvas.height = sampleH
				ctx.drawImage(img, 0, 0, sampleW, sampleH)

				const { data } = ctx.getImageData(0, 0, sampleW, sampleH)
				const stats = analyzePixels(data)
				resolve(buildTheme(stats))
			} catch {
				resolve(DEFAULT_THEME)
			}
		}

		img.onerror = () => {
			resolve(DEFAULT_THEME)
		}
	})
}

export function useWallpaperClockTheme(): WallpaperClockTheme {
	const [theme, setTheme] = useState<WallpaperClockTheme>(THEME_FALLBACK)
	const requestIdRef = useRef(0)

	useEffect(() => {
		let isMounted = true

		async function updateFromWallpaper(wallpaper: StoredWallpaper | null) {
			if (!wallpaper) {
				if (isMounted) setTheme(THEME_FALLBACK)
				return
			}

			const requestId = ++requestIdRef.current

			if (wallpaper.type === 'IMAGE' && wallpaper.src) {
				const computed = await extractThemeFromImage(wallpaper.src)
				if (isMounted && requestId === requestIdRef.current) setTheme(computed)
			} else if (wallpaper.type === 'GRADIENT' && wallpaper.gradient) {
				const computed = extractThemeFromGradient(wallpaper.gradient)
				if (isMounted && requestId === requestIdRef.current) setTheme(computed)
			} else if (wallpaper.type === 'VIDEO') {
				if (isMounted && requestId === requestIdRef.current)
					setTheme(DEFAULT_THEME)
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
