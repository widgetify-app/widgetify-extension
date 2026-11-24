interface RichTextContentEditor {
	isDestroyed: boolean
	getMarkdown: () => string
	commands: {
		setContent: (
			value: string,
			options: { contentType: 'markdown'; emitUpdate: false }
		) => unknown
	}
}

export function syncRichTextContent(
	editor: RichTextContentEditor | null,
	value: string
): void {
	if (!editor || editor.isDestroyed || value === editor.getMarkdown()) return
	editor.commands.setContent(value, { contentType: 'markdown', emitUpdate: false })
}
