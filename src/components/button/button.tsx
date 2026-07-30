import { Icon } from '@/src/icons'
import type React from 'react'

interface ButtonProps {
	onClick?: () => void
	disabled?: boolean
	className?: string
	style?: React.CSSProperties
	icon?: React.ReactNode
	loading?: boolean
	loadingText?: React.ReactNode
	type?: 'button' | 'submit' | 'reset'
	fullWidth?: boolean
	rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
	children?: React.ReactNode
	isPrimary?: boolean
	size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
	ref?: any
}
/**
 * @deprecated Use `import { Button } from '@/components/ui'`.
 *
 * Not a re-export shim on purpose: the new Button drops daisyUI's `btn` base,
 * which would make the `btn-*` modifiers that 16+ call sites pass in
 * `className` inert (in daisyUI 5 they only set `--btn-color`, which nothing
 * reads without `.btn`). Those buttons would silently render grey instead of
 * red/transparent/full-width. Migrate call sites in reviewed batches instead.
 */
export function Button(prop: ButtonProps) {
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
			className={`btn cursor-pointer ${prop.fullWidth ? 'full-width' : ''} ${prop.className} ${prop.rounded ? `rounded-${prop.rounded}` : ''} ${prop.isPrimary ? 'btn-primary' : ''} ${sizes[prop.size] || 'btn-md'} active:!translate-y-0`}
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
