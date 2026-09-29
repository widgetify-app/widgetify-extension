import type { VariantProps } from 'class-variance-authority'
import type React from 'react'
import { cn } from '@/common/utils/cn'
import { spinnerVariants } from './spinner.variants'

interface SpinnerProps
	extends Omit<React.ComponentPropsWithoutRef<'span'>, 'children'>,
		VariantProps<typeof spinnerVariants> {}

export function Spinner({ size, tone, className, ...rest }: SpinnerProps) {
	return (
		<span
			role="status"
			aria-label="در حال بارگذاری"
			className={cn(spinnerVariants({ size, tone }), className)}
			{...rest}
		/>
	)
}
