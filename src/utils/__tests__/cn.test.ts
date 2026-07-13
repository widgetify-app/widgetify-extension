import { describe, expect, it } from 'vitest'
import { cn } from '../cn'

describe('cn utility', () => {
	describe('basic merging', () => {
		it('should merge multiple string arguments', () => {
			expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
		})

		it('should handle conditional classes via logical AND', () => {
			const isActive = true
			expect(cn('base', isActive && 'active')).toBe('base active')
		})

		it('should drop falsy conditions', () => {
			const isActive = false
			expect(cn('base', isActive && 'active')).toBe('base')
		})

		it('should handle object syntax (object mapping)', () => {
			expect(cn('base', { active: true, disabled: false })).toBe(
				'base active'
			)
		})

		it('should flatten array inputs', () => {
			expect(cn(['px-2', 'py-1'], 'text-sm')).toBe('px-2 py-1 text-sm')
		})
	})

	describe('falsy value handling', () => {
		it('should drop undefined values', () => {
			expect(cn('base', undefined, 'text')).toBe('base text')
		})

		it('should drop null values', () => {
			expect(cn('base', null, 'text')).toBe('base text')
		})

		it('should drop false boolean values', () => {
			expect(cn('base', false, 'text')).toBe('base text')
		})

		it('should return empty string for all falsy inputs', () => {
			expect(cn(undefined, null, false)).toBe('')
		})
	})

	describe('Tailwind conflict resolution', () => {
		it('should resolve conflicting padding utilities (last wins)', () => {
			expect(cn('p-4', 'p-2')).toBe('p-2')
		})

		it('should resolve conflicting text color utilities', () => {
			expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
		})

		it('should resolve conflicting background color utilities', () => {
			expect(cn('bg-gray-100', 'bg-white')).toBe('bg-white')
		})

		it('should preserve non-conflicting utilities alongside resolved conflicts', () => {
			expect(cn('flex gap-2 p-4', 'p-2 items-center')).toBe(
				'flex gap-2 p-2 items-center'
			)
		})

		it('should handle complex real-world scenario', () => {
			const base = 'inline-flex items-center px-4 py-2'
			const variant = 'bg-blue-500 text-white'
			const override = 'px-2 bg-red-500'
		expect(cn(base, variant, override)).toBe(
			'inline-flex items-center py-2 text-white px-2 bg-red-500'
		)
		})
	})

	describe('edge cases', () => {
		it('should handle deeply nested arrays', () => {
			expect(cn(['flex', ['gap-2', ['p-4']]], 'text-sm')).toBe(
				'flex gap-2 p-4 text-sm'
			)
		})

		it('should handle mixed input types', () => {
			expect(
				cn('base', { active: true }, ['text-sm', false && 'hidden'], 'final')
			).toBe('base active text-sm final')
		})

		it('should preserve class order when no conflicts exist', () => {
			expect(cn('flex', 'gap-2', 'p-4')).toBe('flex gap-2 p-4')
		})
	})
})
