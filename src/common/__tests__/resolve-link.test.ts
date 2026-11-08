import { describe, expect, it } from 'bun:test'
import { resolveLink } from '../utils/resolve-link'

describe('resolveLink', () => {
	it('opens an http or https address in a new tab', () => {
		expect(resolveLink('https://example.com/a')).toEqual({
			kind: 'external',
			url: 'https://example.com/a',
		})
		expect(resolveLink('http://example.com')).toEqual({
			kind: 'external',
			url: 'http://example.com/',
		})
	})

	it('refuses an address that is not http or https', () => {
		for (const link of [
			'javascript:alert(1)',
			'data:text/html,hi',
			'file:///c:/x',
			'not a url',
		]) {
			expect(resolveLink(link)).toBeNull()
		}
	})

	it('does nothing when there is no link', () => {
		expect(resolveLink()).toBeNull()
		expect(resolveLink(null)).toBeNull()
		expect(resolveLink('')).toBeNull()
		expect(resolveLink('   ')).toBeNull()
	})

	it('goes to a page', () => {
		for (const page of ['home', 'explorer', 'mini-apps']) {
			expect(resolveLink(`/${page}`)).toEqual({
				kind: 'internal',
				event: 'go_to_page',
				payload: page,
			})
		}
	})

	it('opens one mini-app', () => {
		expect(resolveLink('/mini-apps/chess')).toEqual({
			kind: 'internal',
			event: 'openMiniApp',
			payload: 'chess',
		})
	})

	it('opens the widget catalog, on one widget when a key follows', () => {
		expect(resolveLink('/widgets')).toEqual({
			kind: 'internal',
			event: 'openWidgetCatalog',
		})
		expect(resolveLink('/widgets/widget:avaje')).toEqual({
			kind: 'internal',
			event: 'openWidgetCatalog',
			payload: 'widget:avaje',
		})
		expect(resolveLink('/widgets/clock')).toMatchObject({ payload: 'clock' })
	})

	it('opens the profile, on one tab when it is a known one', () => {
		expect(resolveLink('/profile')).toEqual({
			kind: 'internal',
			event: 'openProfile',
		})
		expect(resolveLink('/profile/friends')).toEqual({
			kind: 'internal',
			event: 'openProfile',
			payload: 'friends',
		})
		expect(resolveLink('/profile/nope')).toBeNull()
	})

	it('opens the settings, on one tab when it is a known one', () => {
		expect(resolveLink('/settings')).toEqual({
			kind: 'internal',
			event: 'openSettings',
			payload: null,
		})
		expect(resolveLink('/settings/vip')).toEqual({
			kind: 'internal',
			event: 'openSettings',
			payload: 'vip',
		})
		expect(resolveLink('/settings/nope')).toBeNull()
	})

	it('refuses a path it does not know', () => {
		for (const link of [
			'/',
			'/nope',
			'/home/extra',
			'/explorer/x',
			'/mini-apps/',
			'/settings/vip/extra',
			'openProfile',
			'//evil.test/home',
		]) {
			expect(resolveLink(link)).toBeNull()
		}
	})

	it('ignores spaces around the link', () => {
		expect(resolveLink('  /explorer ')).toMatchObject({ event: 'go_to_page' })
	})
})
