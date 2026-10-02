import { describe, expect, it } from 'bun:test'
import { addOpacityToColor, getContrastingTextColor } from '../utils/color'

describe('getContrastingTextColor', () => {
	it('answers dark text on a light colour and white text on a dark one', () => {
		expect(getContrastingTextColor('#ffffff')).toBe('#0b0b0f')
		expect(getContrastingTextColor('#ffff00')).toBe('#0b0b0f')
		expect(getContrastingTextColor('#000000')).toBe('#ffffff')
		expect(getContrastingTextColor('#1e3a8a')).toBe('#ffffff')
	})

	it('weighs red, green and blue by how bright the eye sees them', () => {
		expect(getContrastingTextColor('#ff0000')).toBe('#ffffff')
		expect(getContrastingTextColor('#0000ff')).toBe('#ffffff')
		expect(getContrastingTextColor('#00ff00')).toBe('#0b0b0f')
		expect(getContrastingTextColor('#f0ca00')).toBe('#0b0b0f')
		expect(getContrastingTextColor('#00ca00')).toBe('#ffffff')
		expect(getContrastingTextColor('#00caff')).toBe('#0b0b0f')
	})

	it('switches from white to dark text just above 60% brightness', () => {
		expect(getContrastingTextColor('#989898')).toBe('#ffffff')
		expect(getContrastingTextColor('#9a9a9a')).toBe('#0b0b0f')
	})

	it('reads the short hex form and a hex with or without the hash', () => {
		expect(getContrastingTextColor('#fff')).toBe('#0b0b0f')
		expect(getContrastingTextColor('000')).toBe('#ffffff')
		expect(getContrastingTextColor('  #FFFFFF  ')).toBe('#0b0b0f')
	})
})

describe('addOpacityToColor', () => {
	it('replaces the alpha of an rgba colour', () => {
		expect(addOpacityToColor('rgba(10, 20, 30, 0.5)', 0.2)).toBe(
			'rgba(10, 20, 30, 0.2)'
		)
	})

	it('adds an alpha to an rgb colour', () => {
		expect(addOpacityToColor('rgb(10, 20, 30)', 0.4)).toBe('rgba(10, 20, 30, 0.4)')
	})
})
