import { describe, expect, it } from 'bun:test'
import { resolveIslandAction } from '../utils/island-action'

describe('resolveIslandAction', () => {
	it('opens a link when there is one, whatever the type says', () => {
		expect(
			resolveIslandAction({ type: 'text', link: 'https://example.com/a' })
		).toEqual({
			kind: 'link',
			url: 'https://example.com/a',
		})
		expect(
			resolveIslandAction({
				type: 'action',
				goTo: 'x',
				link: 'https://example.com',
			})
		).toEqual({ kind: 'link', url: 'https://example.com/' })
	})

	it('refuses a link that is not http or https', () => {
		for (const link of [
			'javascript:alert(1)',
			'data:text/html,hi',
			'file:///c:/x',
			'not a url',
		]) {
			expect(resolveIslandAction({ type: 'text', link })).toBeNull()
		}
	})

	it('goes to a page', () => {
		expect(resolveIslandAction({ type: 'page', goTo: 'explorer' })).toEqual({
			kind: 'page',
			goTo: 'explorer',
		})
	})

	it('runs an action with its target', () => {
		expect(
			resolveIslandAction({
				type: 'action',
				goTo: 'openWidgetCatalog',
				target: 'widget:avaje',
			})
		).toEqual({ kind: 'action', goTo: 'openWidgetCatalog', target: 'widget:avaje' })
	})

	it('runs an action without a target', () => {
		expect(
			resolveIslandAction({ type: 'action', goTo: 'openProfile', target: null })
		).toEqual({
			kind: 'action',
			goTo: 'openProfile',
		})
	})

	it('does nothing for a plain text island, or when the page or action has no destination', () => {
		expect(resolveIslandAction({ type: 'text' })).toBeNull()
		expect(resolveIslandAction({ type: 'page' })).toBeNull()
		expect(resolveIslandAction({ type: 'action', goTo: '' })).toBeNull()
		expect(resolveIslandAction({})).toBeNull()
		expect(resolveIslandAction({ type: 'banner', goTo: 'x' })).toBeNull()
	})
})
