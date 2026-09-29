import type React from 'react'
import { cn } from '@/common/utils/cn'

export function Kbd({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
	return <kbd className={cn('kbd', className)} {...props} />
}
