import { describe, expect, it } from 'bun:test'
import { notificationOf, pushDataOf, tapUrl } from '../push-notification'

describe('notificationOf', () => {
	it('draws the title, text, icon and picture of a push', () => {
		const shown = notificationOf(
			{
				title: 'عنوان',
				body: 'متن',
				largeIcon: 'https://cdn.test/icon.png',
				image: 'https://cdn.test/picture.png',
				notificationId: 'n1',
				link: '/friends',
			},
			'/icons/icon128.png'
		)

		expect(shown.title).toBe('عنوان')
		expect(shown.options).toMatchObject({
			body: 'متن',
			icon: 'https://cdn.test/icon.png',
			image: 'https://cdn.test/picture.png',
			tag: 'n1',
			dir: 'rtl',
			lang: 'fa',
		})
		expect(shown.options.data).toMatchObject({
			notificationId: 'n1',
			link: '/friends',
		})
	})

	it('uses the app icon and a plain title when the push has none', () => {
		const shown = notificationOf({}, '/icons/icon128.png')

		expect(shown.title).toBe('Widgetify')
		expect(shown.options.icon).toBe('/icons/icon128.png')
		expect(shown.options.image).toBeUndefined()
		expect(shown.options.tag).toBeUndefined()
	})
})

describe('pushDataOf', () => {
	it('takes the data part of a push from FCM', () => {
		expect(
			pushDataOf({ data: { title: 'عنوان', notificationId: 'n1' }, from: '768' })
		).toEqual({ title: 'عنوان', notificationId: 'n1' })
	})

	it('takes a flat payload as it is', () => {
		expect(pushDataOf({ title: 'عنوان' })).toEqual({ title: 'عنوان' })
	})

	it('answers an empty object for anything that is not an object', () => {
		expect(pushDataOf(null)).toEqual({})
		expect(pushDataOf('text')).toEqual({})
		expect(pushDataOf(undefined)).toEqual({})
	})
})

describe('tapUrl', () => {
	it('opens the new tab page with the notification and its link', () => {
		expect(
			tapUrl('chrome-extension://abc/newtab.html', {
				notificationId: 'n1',
				link: '/notifications?tab=all',
			})
		).toBe(
			'chrome-extension://abc/newtab.html?pushTap=n1&pushLink=%2Fnotifications%3Ftab%3Dall'
		)
	})

	it('opens the plain page when the tap carries nothing', () => {
		expect(tapUrl('chrome-extension://abc/newtab.html', {})).toBe(
			'chrome-extension://abc/newtab.html'
		)
	})
})
