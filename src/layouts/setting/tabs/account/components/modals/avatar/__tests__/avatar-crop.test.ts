import { describe, expect, it } from 'bun:test'
import {
	MAX_AVATAR_DIMENSION,
	getAvatarTargetDimensions,
} from '../avatar-crop.utils'

describe('Avatar crop dimension clamping', () => {
	it('defines MAX_AVATAR_DIMENSION as 512px to prevent oversized avatar files', () => {
		expect(MAX_AVATAR_DIMENSION).toBe(512)
	})

	it('clamps oversized dimensions down to 512px', () => {
		const result = getAvatarTargetDimensions({ width: 2048, height: 2048 })
		expect(result).toEqual({ width: 512, height: 512 })
	})

	it('preserves small dimensions under 512px', () => {
		const result = getAvatarTargetDimensions({ width: 256, height: 256 })
		expect(result).toEqual({ width: 256, height: 256 })
	})

	it('handles rectangular aspect ratios by clamping each dimension independently', () => {
		const result = getAvatarTargetDimensions({ width: 800, height: 400 })
		expect(result).toEqual({ width: 512, height: 400 })
	})
})
