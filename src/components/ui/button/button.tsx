import type React from 'react'
import { cn } from '@/common/utils/cn'
import { Spinner } from '../spinner/spinner'
import { type ButtonVariantProps, buttonVariants } from './button.variants'

interface ButtonProps
	extends Omit<React.ComponentPropsWithRef<'button'>, 'color'>,
		ButtonVariantProps {
	loading?: boolean
	loadingText?: React.ReactNode
	icon?: React.ReactNode
}

export function Button({
	className,
	variant,
	color,
	size,
	rounded,
	fullWidth,
	loading,
	loadingText,
	icon,
	type = 'button',
	children,
	...rest
}: ButtonProps) {
	return (
		<button
			type={type}
			className={cn(
				buttonVariants({ variant, color, size, rounded, fullWidth }),
				className
			)}
			{...rest}
		>
			{loading ? (
				loadingText || (
					<>
						<Spinner size="sm" tone="current" aria-hidden="true" />
						<span className="text-xs">صبر کنید...</span>
					</>
				)
			) : (
				<>
					{icon}
					{children}
				</>
			)}
		</button>
	)
}
