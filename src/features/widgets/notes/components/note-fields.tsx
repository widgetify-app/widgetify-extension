import type { RefObject } from 'react'
import { cn } from '@/common/utils/cn'
import { TextInput } from '@/components/ui'
import type { WidgetControlTone } from '@/features/widgets/components/widget-menu-button'

interface NoteFieldsProps {
	title: string
	body: string
	onTitleChange: (title: string) => void
	onBodyChange: (body: string) => void
	tone?: WidgetControlTone
	titleRef?: RefObject<HTMLInputElement | null>
	titleDebounceMs?: number
	className?: string
	bodyClassName?: string
}

export function NoteFields({
	title,
	body,
	onTitleChange,
	onBodyChange,
	tone = 'default',
	titleRef,
	titleDebounceMs,
	className,
	bodyClassName,
}: NoteFieldsProps) {
	const isOnColor = tone === 'onColor'
	const placeholderClass = isOnColor
		? 'placeholder:text-current placeholder:opacity-60'
		: 'placeholder:text-fg-faint'

	return (
		<div className={cn('flex flex-col flex-1 min-h-0 gap-1.5 px-2', className)}>
			<TextInput
				ref={titleRef}
				variant="bare"
				value={title}
				onChange={onTitleChange}
				debounce={titleDebounceMs !== undefined}
				debounceTime={titleDebounceMs}
				direction="rtl"
				placeholder="یه عنوان بنویس"
				aria-label="عنوان یادداشت"
				className={cn(
					'h-6 text-sm font-bold truncate',
					isOnColor ? 'text-current' : 'text-fg-strong',
					placeholderClass
				)}
			/>
			<textarea
				value={body}
				onChange={(e) => onBodyChange(e.target.value)}
				placeholder="هرچی می‌خوای اینجا بنویس"
				aria-label="متن یادداشت"
				dir="rtl"
				className={cn(
					'flex-1 w-full min-h-0 text-xs leading-loose bg-transparent outline-none resize-none scrollbar-none',
					isOnColor ? 'text-current' : 'text-fg',
					placeholderClass,
					bodyClassName
				)}
			/>
		</div>
	)
}
