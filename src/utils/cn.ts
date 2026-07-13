import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges class names and intelligently resolves conflicting Tailwind utility classes.
 *
 * This utility combines:
 * - `clsx`: Handles conditional class composition with minimal overhead
 * - `tailwind-merge`: Resolves Tailwind class conflicts (e.g., `p-2 p-4` → `p-4`)
 *
 * Use this instead of template-literal concatenation for any component that
 * accepts runtime className overrides or applies conditional styles.
 *
 * @param inputs - Variadic class values: strings, booleans, objects, or arrays.
 *                 Falsy values (false, null, undefined) are safely filtered.
 * @returns A single, deduplicated, conflict-free class string ready for DOM.
 *
 * @example
 * ```ts
 * // Conditional styling
 * cn('px-4 py-2', isActive && 'bg-blue-500', disabled && 'opacity-50')
 *
 * // Override via prop
 * cn('text-sm font-medium', className)
 *
 * // Conflict resolution (Tailwind)
 * cn('p-4 m-2', 'p-2') // → 'm-2 p-2' (last p-* wins)
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs))
}
