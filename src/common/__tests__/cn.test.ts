import { describe, expect, it } from 'bun:test'
import { cn } from '../utils/cn'

describe('cn', () => {
	it('joins class names and skips what is empty', () => {
		expect(cn('a', false, undefined, 'b', ['c'], { d: true, e: false })).toBe(
			'a b c d'
		)
	})

	it('keeps the last of two Tailwind classes that set the same thing', () => {
		expect(cn('px-2', 'px-4')).toBe('px-4')
		expect(cn('bg-surface', 'bg-surface-2')).toBe('bg-surface-2')
		expect(cn('text-fg', 'text-fg-muted')).toBe('text-fg-muted')
	})

	it('keeps classes that set different things', () => {
		expect(cn('text-fg-muted', 'text-3xs')).toBe('text-fg-muted text-3xs')
		expect(cn('shadow-md', 'shadow-brand-fill-2')).toBe(
			'shadow-md shadow-brand-fill-2'
		)
	})

	it('lets a small text size replace a Tailwind one', () => {
		expect(cn('text-sm', 'text-3xs')).toBe('text-3xs')
		expect(cn('text-4xs', 'text-3xs')).toBe('text-3xs')
	})

	it('knows the utilities of the design system that Tailwind does not', () => {
		expect(cn('rounded-xl', 'rounded-widget')).toBe('rounded-widget')
		expect(cn('transition-colors', 'transition-ui')).toBe('transition-ui')
		expect(cn('z-10', 'z-nav')).toBe('z-nav')
		expect(cn('outline-solid', 'focus-ring')).toBe('focus-ring')
		expect(cn('focus-ring', 'rounded-widget', 'transition-ui', 'z-popover')).toBe(
			'focus-ring rounded-widget transition-ui z-popover'
		)
	})
})
