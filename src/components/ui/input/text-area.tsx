import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/common/utils/cn'
import { textAreaVariants } from './input.variants'

export function TextArea({
	className,
	...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
	return <textarea {...props} className={cn(textAreaVariants(), className)} />
}
