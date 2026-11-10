export const OPEN_MODAL_SELECTOR = 'dialog[open]'

interface Searchable {
	querySelector(selector: string): unknown
}

export function hasOpenModal(root: Searchable): boolean {
	return root.querySelector(OPEN_MODAL_SELECTOR) !== null
}
