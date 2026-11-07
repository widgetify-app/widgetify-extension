import { TaskItem, TaskList } from '@tiptap/extension-list'
import { Markdown } from '@tiptap/markdown'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { Icon, type IconName } from '@/icons'
import type { RichTextFieldProps } from './rich-text-field'

const EXTENSIONS = [
	StarterKit.configure({
		blockquote: false,
		code: false,
		codeBlock: false,
		heading: false,
		horizontalRule: false,
		link: false,
		strike: false,
		underline: false,
	}),
	TaskList,
	TaskItem.configure({ nested: false }),
	Markdown,
]

type FormatName = 'bold' | 'italic' | 'bulletList' | 'orderedList' | 'taskList'

const BUTTONS: { name: FormatName; icon: IconName; label: Parameters<typeof t>[0] }[] = [
	{ name: 'bold', icon: 'bold', label: 'widgets.richText.bold' },
	{ name: 'italic', icon: 'italic', label: 'widgets.richText.italic' },
	{ name: 'bulletList', icon: 'listBullets', label: 'widgets.richText.bullets' },
	{ name: 'orderedList', icon: 'listNumbers', label: 'widgets.richText.numbers' },
	{ name: 'taskList', icon: 'listChecks', label: 'widgets.richText.checklist' },
]

export default function RichTextEditor({
	value,
	onChange,
	placeholder,
	ariaLabel,
	isOnColor = false,
	className,
}: RichTextFieldProps) {
	const editor = useEditor({
		extensions: EXTENSIONS,
		content: value,
		contentType: 'markdown',
		editorProps: {
			attributes: {
				class: 'rich-text outline-none min-h-full',
				'aria-label': ariaLabel,
				dir: 'rtl',
			},
		},
		onUpdate: ({ editor: current }) => onChange(current.getMarkdown()),
	})

	const state = useEditorState({
		editor,
		selector: ({ editor: current }) => ({
			empty: current?.isEmpty ?? true,
			bold: current?.isActive('bold') ?? false,
			italic: current?.isActive('italic') ?? false,
			bulletList: current?.isActive('bulletList') ?? false,
			orderedList: current?.isActive('orderedList') ?? false,
			taskList: current?.isActive('taskList') ?? false,
		}),
	})

	useEffect(() => {
		if (!editor || value === editor.getMarkdown()) return
		editor.commands.setContent(value, { contentType: 'markdown', emitUpdate: false })
	}, [editor, value])

	if (!editor) return null

	function toggle(name: FormatName) {
		const chain = editor?.chain().focus()
		if (name === 'bold') chain?.toggleBold().run()
		if (name === 'italic') chain?.toggleItalic().run()
		if (name === 'bulletList') chain?.toggleBulletList().run()
		if (name === 'orderedList') chain?.toggleOrderedList().run()
		if (name === 'taskList') chain?.toggleTaskList().run()
	}

	return (
		<div className={cn('flex flex-col flex-1 w-full min-h-0 gap-1', className)}>
			<div
				role="toolbar"
				aria-label={t('widgets.richText.toolbar')}
				className="flex gap-0.5 shrink-0"
			>
				{BUTTONS.map((button) => (
					<button
						key={button.name}
						type="button"
						aria-label={t(button.label)}
						aria-pressed={state[button.name]}
						onMouseDown={(event) => event.preventDefault()}
						onClick={() => toggle(button.name)}
						className={cn(
							'grid rounded-lg cursor-pointer place-items-center size-6 transition-ui focus-visible:focus-ring',
							state[button.name]
								? 'bg-brand text-on-brand'
								: 'opacity-70 hover:opacity-100 hover:bg-fill-2'
						)}
					>
						<Icon name={button.icon} size={14} aria-hidden="true" />
					</button>
				))}
			</div>
			<div
				className={cn(
					'relative flex-1 min-h-0 overflow-y-auto text-xs leading-loose scrollbar-none',
					isOnColor ? 'text-current' : 'text-fg'
				)}
			>
				{state.empty && placeholder && (
					<span
						className={cn(
							'absolute pointer-events-none',
							isOnColor ? 'text-current opacity-60' : 'text-fg-faint'
						)}
					>
						{placeholder}
					</span>
				)}
				<EditorContent editor={editor} className="min-h-full" />
			</div>
		</div>
	)
}
