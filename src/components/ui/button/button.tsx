import type React from 'react'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/src/icons'
import { type ButtonVariantProps, buttonVariants } from './button.variants'

export interface ButtonProps
	extends Omit<React.ComponentPropsWithRef<'button'>, 'color'>,
		ButtonVariantProps {
	loading?: boolean
	loadingText?: React.ReactNode
	icon?: React.ReactNode
}

export function Button({
	className,
	variant,
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
				buttonVariants({ variant, size, rounded, fullWidth }),
				className
			)}
			{...rest}
		>
			{loading ? (
				loadingText || (
					<>
						<Icon name="spinner" className="animate-spin" />
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
