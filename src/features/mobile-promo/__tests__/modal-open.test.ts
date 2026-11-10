import { describe, expect, it } from 'bun:test'
import { hasOpenModal, OPEN_MODAL_SELECTOR } from '../utils/modal-open'

function rootWith(found: unknown) {
	const asked: string[] = []

	return {
		asked,
		root: {
			querySelector(selector: string) {
				asked.push(selector)

				return found
			},
		},
	}
}

describe('hasOpenModal', () => {
	it('looks for an open dialog, which is what the Modal component renders when it is open', () => {
		const { root, asked } = rootWith(null)

		hasOpenModal(root)

		expect(OPEN_MODAL_SELECTOR).toBe('dialog[open]')
		expect(asked).toEqual(['dialog[open]'])
	})

	it('is true when one is found and false when none is', () => {
		expect(hasOpenModal(rootWith({}).root)).toBe(true)
		expect(hasOpenModal(rootWith(null).root)).toBe(false)
	})
})
