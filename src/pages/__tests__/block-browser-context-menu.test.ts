import { describe, expect, it } from 'bun:test'
import { blockBrowserContextMenu } from '@/pages/utils/block-browser-context-menu'

class RecordingTarget extends EventTarget {
	registrations: Array<boolean | AddEventListenerOptions | undefined> = []

	addEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject | null,
		options?: boolean | AddEventListenerOptions
	) {
		this.registrations.push(options)
		super.addEventListener(type, listener, options)
	}
}

function rightClick() {
	return new Event('contextmenu', { cancelable: true })
}

describe('blockBrowserContextMenu', () => {
	it('stops the browser from opening its menu', () => {
		const target = new EventTarget()
		blockBrowserContextMenu(target)
		const event = rightClick()
		target.dispatchEvent(event)
		expect(event.defaultPrevented).toBe(true)
	})

	it('listens in the capture phase, so a handler that stops propagation cannot let the menu through', () => {
		const target = new RecordingTarget()
		blockBrowserContextMenu(target)
		expect(target.registrations).toEqual([true])
	})

	it('leaves every other event alone', () => {
		const target = new EventTarget()
		blockBrowserContextMenu(target)
		const click = new Event('click', { cancelable: true })
		target.dispatchEvent(click)
		expect(click.defaultPrevented).toBe(false)
	})

	it('gives the browser menu back once it is undone', () => {
		const target = new EventTarget()
		const undo = blockBrowserContextMenu(target)
		undo()
		const event = rightClick()
		target.dispatchEvent(event)
		expect(event.defaultPrevented).toBe(false)
	})
})
