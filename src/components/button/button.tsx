import { Icon } from '@/src/icons'
import { cn } from '@/src/utils/cn'
import type React from 'react'

/**
 * Props interface for the Button component.
 *
 * Defines all configurable aspects of button rendering: sizing, styling,
 * interaction state, and content. Follows semantic HTML conventions for
 * accessibility and compatibility with form submission workflows.
 */
interface ButtonProps {
	/** Callback fired when the button is clicked */
	onClick?: () => void
	/** Disables user interaction and updates visual state */
	disabled?: boolean
	/** Additional CSS classes merged with default styles (overrides via Tailwind merge) */
	className?: string
	/** Inline CSS styles (lowest precedence, for special cases only) */
	style?: React.CSSProperties
	/** Optional icon element displayed alongside or instead of text */
	icon?: React.ReactNode
	/** If true, replaces children with loading indicator and optional text */
	loading?: boolean
	/** Text or element shown during loading state (defaults to spinner + Persian "صبر کنید...") */
	loadingText?: React.ReactNode
	/** HTML button type attribute for form semantics */
	type?: 'button' | 'submit' | 'reset'
	/** If true, button width expands to fill its container */
	fullWidth?: boolean
	/** Border radius scale: 'sm' (0.375rem), 'md' (0.5rem), 'lg' (0.75rem), 'xl' (1rem), 'full' (9999px) */
	rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
	/** Button content—text, nodes, or components */
	children?: React.ReactNode
	/** If true, applies primary theme colors (blue background, white text) */
	isPrimary?: boolean
	/** Controls button dimensions: 'xs' (24px), 'sm' (32px), 'md' (40px), 'lg' (48px), 'xl' (56px) */
	size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
	/** React ref for imperative access (e.g., .focus(), .blur()) */
	ref?: any
}

/**
 * A reusable button component with flexible sizing, theming, and states.
 *
 * This component wraps a native HTML `<button>` with Tailwind-based styling,
 * loading states, and configurable appearance. The `cn()` utility ensures
 * that user-provided className overrides are properly merged with built-in
 * styles without Tailwind conflicts (e.g., duplicate spacing, color utilities).
 *
 * Accessibility: Use `disabled` prop to disable the button; avoid disabling
 * via className alone as screen readers rely on the HTML attribute.
 *
 * @example
 * ```tsx
 * <Button size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 *
 * <Button
 *   size="lg"
 *   isPrimary
 *   fullWidth
 *   loading={isSubmitting}
 *   loadingText="Submitting..."
 *   type="submit"
 * >
 *   Submit Form
 * </Button>
 * ```
 */
export function Button(prop: ButtonProps) {
	/**
	 * Maps size prop to Tailwind height and padding utility tokens.
	 * These classes are combined via `cn()` to avoid conflicts.
	 */
	const sizes: Record<string, string> = {
		xs: 'btn-xs',
		sm: 'btn-sm',
		md: 'btn-md',
		lg: 'btn-lg',
		xl: 'btn-xl',
	}

	return (
		<button
			type={prop.type || 'button'}
			onClick={prop.onClick}
			disabled={prop.disabled}
			className={cn(
				'btn cursor-pointer',
				prop.fullWidth && 'full-width',
				prop.rounded && `rounded-${prop.rounded}`,
				prop.isPrimary && 'btn-primary text-white',
				sizes[prop.size] || 'btn-md',
				'active:!translate-y-0',
				prop.className
			)}
			style={prop.style}
			ref={prop.ref}
		>
			{prop.loading
				? prop.loadingText || (
						<div className="flex items-center gap-1">
							<Icon name="spinner" className="animate-spin" />
							<span className="text-xs">صبر کنید...</span>
						</div>
					)
				: prop.children}
		</button>
	)
}
