import { describe, expect, it } from 'bun:test'
import { chooseLayoutOnLoad } from '../utils/layout-sync'

describe('chooseLayoutOnLoad', () => {
	it('sends the local layout up when an edit never reached the server', () => {
		expect(
			chooseLayoutOnLoad({
				hasUnsyncedEdit: true,
				hasLocalEdit: false,
				serverWidgetCount: 4,
			})
		).toBe('push-local')
	})

	it('takes the server layout when nothing local is waiting', () => {
		expect(
			chooseLayoutOnLoad({
				hasUnsyncedEdit: false,
				hasLocalEdit: false,
				serverWidgetCount: 4,
			})
		).toBe('take-server')
	})

	it('keeps the local layout when the user already changed it in this tab', () => {
		expect(
			chooseLayoutOnLoad({
				hasUnsyncedEdit: false,
				hasLocalEdit: true,
				serverWidgetCount: 4,
			})
		).toBe('keep-local')
	})

	it('seeds an empty server from the local layout', () => {
		expect(
			chooseLayoutOnLoad({
				hasUnsyncedEdit: false,
				hasLocalEdit: false,
				serverWidgetCount: 0,
			})
		).toBe('seed-server')
	})
})
