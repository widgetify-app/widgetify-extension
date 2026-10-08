import { t } from '@/common/i18n'
import jalaliMoment from 'jalali-moment'
import { useState } from 'react'
import Analytics from '@/analytics'
import { showToast } from '@/common/toast'
import { callEvent } from '@/common/utils/call-event'
import { cn } from '@/common/utils/cn'
import { translateError } from '@/common/utils/translate-error'
import { Button, Chip, DatePicker, Dropdown, TextInput } from '@/components/ui'
import { Icon } from '@/icons'
import { safeAwait } from '@/services/api'
import { useRemoveTag } from '@/services/todo/remove-tag.hook'
import { cleanTags, matchTags, newTagName } from '../utils/tag-options'
import { todoDueLabel } from '../utils/todo-due-label'
import { TodoComposerTool } from './todo-composer-tool'

interface TodoDateDropdownProps {
	date: jalaliMoment.Moment
	onChange: (date: jalaliMoment.Moment) => void
}

export function TodoDateDropdown({ date, onChange }: TodoDateDropdownProps) {
	return (
		<Dropdown
			trigger={
				<TodoComposerTool
					icon="calendarDays"
					label={t('widgets.todos.form.date')}
					isActive
				>
					{todoDueLabel(date, jalaliMoment().locale('fa'))}
				</TodoComposerTool>
			}
		>
			<DatePicker
				selectedDate={date}
				onDateSelect={(selected) => {
					onChange(selected)
					callEvent('closeAllDropdowns')
				}}
			/>
		</Dropdown>
	)
}

interface TodoCategoryDropdownProps {
	category: string
	tags?: string[]
	onChange: (category: string) => void
}

export function TodoCategoryDropdown({
	category,
	tags,
	onChange,
}: TodoCategoryDropdownProps) {
	const [query, setQuery] = useState('')
	const [tagToRemove, setTagToRemove] = useState<string | null>(null)
	const { mutateAsync: removeTag, isPending: isRemoving } = useRemoveTag()

	const available = cleanTags(tags)
	const shown = matchTags(available, query)
	const newTag = newTagName(available, query)

	const choose = (tag: string) => {
		onChange(tag)
		setQuery('')
		callEvent('closeAllDropdowns')
		Analytics.event('todo_category_select')
	}

	const confirmRemove = async () => {
		if (!tagToRemove || isRemoving) return
		const [error, count] = await safeAwait<unknown, number>(removeTag(tagToRemove))
		if (error) {
			showToast(translateError(error) as string, 'error')
			return
		}

		if (category === tagToRemove) onChange('')
		showToast(
			t('widgets.todos.form.tagRemovedToast', {
				p0: tagToRemove,
				p1: (count ?? 0).toLocaleString('fa-IR'),
			}),
			'success'
		)
		setTagToRemove(null)
	}

	return (
		<Dropdown
			onClose={() => {
				setQuery('')
				setTagToRemove(null)
			}}
			trigger={
				<TodoComposerTool
					icon="tags"
					label={t('widgets.todos.filter.tag')}
					isActive={Boolean(category)}
				>
					{category || undefined}
				</TodoComposerTool>
			}
		>
			<div className="flex flex-col gap-2 p-2 w-64">
				{tagToRemove ? (
					<div className="flex flex-col gap-2 p-2.5 rounded-xl bg-danger-fill">
						<p className="leading-relaxed text-2xs text-fg">
							{t('widgets.todos.form.tagRemoveConfirmPrefix')}
							{tagToRemove}
							{t('widgets.todos.form.tagRemoveConfirmSuffix')}
						</p>
						<div className="flex justify-end gap-1">
							<Button
								size="xs"
								variant="ghost"
								rounded="lg"
								onClick={() => setTagToRemove(null)}
								disabled={isRemoving}
							>
								{t('widgets.todos.form.deleteCancel')}
							</Button>
							<Button
								size="xs"
								color="danger"
								rounded="lg"
								onClick={confirmRemove}
								disabled={isRemoving}
							>
								{isRemoving
									? t('widgets.todos.form.tagRemoving')
									: t('widgets.todos.form.tagRemove')}
							</Button>
						</div>
					</div>
				) : (
					<>
						<TextInput
							value={query}
							onChange={setQuery}
							onKeyDown={(e) => {
								if (e.key !== 'Enter') return
								if (newTag) choose(newTag)
								else if (shown.length === 1) choose(shown[0])
							}}
							placeholder={t('widgets.todos.form.tagSearchOrCreate')}
							aria-label={t('widgets.todos.form.tagSearchOrBuild')}
							size="sm"
							debounce={false}
						/>

						{newTag && (
							<button
								type="button"
								onClick={() => choose(newTag)}
								className="flex items-center gap-1.5 h-8 px-2.5 font-semibold rounded-lg cursor-pointer text-2xs text-brand bg-brand-fill transition-ui hover:bg-brand-fill-2 focus-visible:focus-ring"
							>
								<Icon name="plus" size={12} aria-hidden="true" />
								<span className="truncate">
									{t('widgets.todos.form.tagCreatePrefix')}
									{newTag}»
								</span>
							</button>
						)}

						<div className="flex flex-wrap gap-1 overflow-y-auto max-h-36 scrollbar-none">
							{category && (
								<Chip size="sm" onClick={() => choose('')}>
									{t('widgets.todos.form.noTags')}
								</Chip>
							)}
							{shown.map((tag) => (
								<TagChip
									key={tag}
									tag={tag}
									isSelected={tag === category}
									onSelect={() => choose(tag === category ? '' : tag)}
									onRemove={() => setTagToRemove(tag)}
								/>
							))}
							{available.length === 0 && !newTag && (
								<p className="px-1 text-2xs text-fg-faint">
									{t('widgets.todos.form.noTagsHint')}
								</p>
							)}
						</div>
					</>
				)}
			</div>
		</Dropdown>
	)
}

interface TagChipProps {
	tag: string
	isSelected: boolean
	onSelect: () => void
	onRemove: () => void
}

function TagChip({ tag, isSelected, onSelect, onRemove }: TagChipProps) {
	return (
		<span
			className={cn(
				'inline-flex items-center h-6 font-semibold rounded-full text-2xs',
				isSelected ? 'bg-brand-fill text-brand' : 'bg-fill text-fg-muted'
			)}
		>
			<button
				type="button"
				onClick={onSelect}
				aria-pressed={isSelected}
				className="h-full rounded-s-full cursor-pointer ps-2.5 pe-1 focus-visible:focus-ring"
			>
				{tag}
			</button>
			<button
				type="button"
				onClick={onRemove}
				aria-label={t('widgets.todos.form.tagRemoveAria', { p0: tag })}
				className="grid h-full rounded-e-full cursor-pointer place-items-center ps-0.5 pe-1.5 transition-ui hover:text-danger focus-visible:focus-ring"
			>
				<Icon name="close" size={10} aria-hidden="true" />
			</button>
		</span>
	)
}
