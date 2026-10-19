import type React from 'react'
import type { TransparentClockColor, TransparentClockStyle } from '../types'

const CLOCK_FONT_SIZE = 'clamp(2rem, min(24cqw, 56cqh), 10rem)'
const STACKED_FONT_SIZE = 'clamp(2rem, min(40cqw, 34cqh), 9rem)'
const STACKED_LINE_HEIGHT = 0.86

const OUTLINE_WIDTH = 'max(1.5px, 0.03em)'
const GLASS_EDGE_WIDTH = 'max(1px, 0.015em)'

interface ColorSource {
	kind: 'hsl' | 'rgb'
	channels: string
}

interface WallpaperInk {
	isDerivedFromWallpaper: boolean
	inkHsl: string
}

interface ClockDigitsPaint {
	style: React.CSSProperties
	usesThemeText: boolean
}

export function hexToRgbChannels(hex: string): string {
	const value = Number.parseInt(hex.slice(1), 16)
	return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`
}

export function resolveColorSource(
	color: TransparentClockColor,
	ink: WallpaperInk
): ColorSource {
	if (color.startsWith('#')) return { kind: 'rgb', channels: hexToRgbChannels(color) }
	if (ink.isDerivedFromWallpaper) return { kind: 'hsl', channels: ink.inkHsl }
	return { kind: 'rgb', channels: 'var(--color-base-content-rgb)' }
}

export function colorWithAlpha(source: ColorSource, alpha: number): string {
	const clamped = Math.round(Math.min(1, Math.max(0, alpha)) * 100) / 100
	return `${source.kind}a(${source.channels}, ${clamped})`
}

function solidColor(source: ColorSource): string {
	return `${source.kind}(${source.channels})`
}

export function getGlassFillAlpha(tint: number): number {
	return (15 + tint * 0.75) / 100
}

function dropShadow(glow: string): string | undefined {
	return glow && glow !== 'none' ? `drop-shadow(${glow})` : undefined
}

export function getClockDigitsPaint(
	clockStyle: TransparentClockStyle,
	ink: WallpaperInk,
	glow: string
): ClockDigitsPaint {
	const { face, finish, weight, scale, glassTint, color } = clockStyle

	const isStacked = face === 'stacked'
	const style: React.CSSProperties = {
		fontWeight: weight,
		fontSize: `calc(${isStacked ? STACKED_FONT_SIZE : CLOCK_FONT_SIZE} * ${scale})`,
	}

	if (isStacked) style.lineHeight = STACKED_LINE_HEIGHT

	const usesThemeText =
		color === 'wallpaper' && finish === 'solid' && face !== 'outline'
			? !ink.isDerivedFromWallpaper
			: false

	const source = resolveColorSource(color, ink)
	const fillAlpha = getGlassFillAlpha(glassTint)

	if (face === 'outline') {
		const stroke =
			finish === 'glass'
				? colorWithAlpha(source, fillAlpha + 0.2)
				: solidColor(source)
		style.color = 'transparent'
		style.WebkitTextStroke = `${OUTLINE_WIDTH} ${stroke}`
		style.filter = dropShadow(glow)
		return { style, usesThemeText }
	}

	if (finish === 'glass') {
		style.color = 'transparent'
		style.backgroundImage = `linear-gradient(175deg, ${colorWithAlpha(source, fillAlpha + 0.35)} 0%, ${colorWithAlpha(source, fillAlpha)} 50%, ${colorWithAlpha(source, fillAlpha * 0.6)} 100%)`
		style.WebkitBackgroundClip = 'text'
		style.backgroundClip = 'text'
		style.WebkitTextStroke = `${GLASS_EDGE_WIDTH} ${colorWithAlpha(source, fillAlpha + 0.3)}`
		style.filter = dropShadow(glow)
		return { style, usesThemeText }
	}

	if (!usesThemeText) {
		style.color = color.startsWith('#') ? color : solidColor(source)
		style.textShadow = glow
	}

	return { style, usesThemeText }
}
