export function blockBrowserContextMenu(target: EventTarget): () => void {
	const block = (event: Event) => event.preventDefault()
	target.addEventListener('contextmenu', block, true)
	return () => target.removeEventListener('contextmenu', block, true)
}
