import type { RefObject } from 'react'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { TextInput } from '@/components/ui'
import { RichTextField } from '@/features/widgets/components/rich-text-field'
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
				placeholder={t('widgets.notes.field.titlePlaceholder')}
				aria-label={t('widgets.notes.field.titleAria')}
				className={cn(
					'h-6 text-sm font-bold truncate',
					isOnColor ? 'text-current' : 'text-fg-strong',
					placeholderClass
				)}
			/>
			<RichTextField
				value={body}
				onChange={onBodyChange}
				placeholder={t('widgets.notes.field.bodyPlaceholder')}
				ariaLabel={t('widgets.notes.field.bodyAria')}
				isOnColor={isOnColor}
				className={bodyClassName}
			/>
		</div>
	)
}
