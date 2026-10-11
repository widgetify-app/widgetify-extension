import { describe, expect, it } from 'bun:test'
import {
	DEFAULT_TIMEOUT_MS,
	MESSAGE_AUTH,
	MESSAGE_READY,
	MESSAGE_REFRESH_AUTH,
	authMessage,
	buildFrameUrl,
	colorSchemeOf,
	createRefreshLimiter,
	frameMessageKind,
	hostAllow,
	hostSandbox,
	launchTimeoutMs,
} from '../utils/protocol'

const ORIGIN = 'https://iframes.example.test'
const FRAME = { name: 'the frame window' }

function event(overrides: Record<string, unknown> = {}) {
	return {
		source: FRAME,
		origin: ORIGIN,
		data: { type: MESSAGE_READY },
		...overrides,
	}
}

describe('frameMessageKind', () => {
	it('reads READY and REFRESH from the right window and origin', () => {
		expect(frameMessageKind(event(), FRAME, ORIGIN)).toBe('ready')
		expect(
			frameMessageKind(
				event({ data: { type: MESSAGE_REFRESH_AUTH } }),
				FRAME,
				ORIGIN
			)
		).toBe('refresh')
	})

	it('ignores another window, another origin and a missing frame', () => {
		expect(frameMessageKind(event({ source: {} }), FRAME, ORIGIN)).toBeNull()
		expect(
			frameMessageKind(event({ origin: 'https://evil.example' }), FRAME, ORIGIN)
		).toBeNull()
		expect(frameMessageKind(event(), null, ORIGIN)).toBeNull()
		expect(frameMessageKind(event({ source: null }), null, ORIGIN)).toBeNull()
	})

	it('ignores every other message', () => {
		const others: unknown[] = [
			null,
			'text',
			42,
			{},
			{ type: MESSAGE_AUTH },
			{ type: 'OTHER' },
			{ type: 7 },
		]

		for (const data of others) {
			expect(frameMessageKind(event({ data }), FRAME, ORIGIN)).toBeNull()
		}
	})
})

describe('authMessage', () => {
	it('puts the token in a payload object, as the mini-app runner does', () => {
		expect(authMessage({ data: 'abc', signature: 'def' })).toEqual({
			type: MESSAGE_AUTH,
			payload: { data: 'abc', signature: 'def' },
		})
	})

	it('copies only the two token fields', () => {
		const message = authMessage({ data: 'a', signature: 'b', extra: 1 } as never)

		expect(Object.keys(message.payload)).toEqual(['data', 'signature'])
	})
})

describe('buildFrameUrl', () => {
	const base = {
		widgetUrl: `${ORIGIN}/w/pomodoro`,
		theme: 'dark',
		colorScheme: 'dark' as const,
		font: 'Vazir',
		width: 4,
		height: 2,
	}

	it('carries everything the page needs in the query', () => {
		const url = new URL(buildFrameUrl({ ...base, variant: 'compact' }))

		expect(url.origin + url.pathname).toBe(`${ORIGIN}/w/pomodoro`)
		expect(Object.fromEntries(url.searchParams)).toEqual({
			mode: 'widget',
			client: 'EXTENSION',
			referrer: 'EXTENSION',
			theme: 'dark',
			colorScheme: 'dark',
			font: 'Vazir',
			w: '4',
			h: '2',
			variant: 'compact',
		})
	})

	it('leaves the variant out when there is none', () => {
		expect(new URL(buildFrameUrl(base)).searchParams.has('variant')).toBe(false)
		expect(
			new URL(buildFrameUrl({ ...base, variant: null })).searchParams.has('variant')
		).toBe(false)
	})

	it('changes the address whenever theme, font, size or variant change', () => {
		const urls = [
			buildFrameUrl(base),
			buildFrameUrl({ ...base, theme: 'light', colorScheme: 'light' }),
			buildFrameUrl({ ...base, font: 'Samim' }),
			buildFrameUrl({ ...base, width: 2 }),
			buildFrameUrl({ ...base, height: 1 }),
			buildFrameUrl({ ...base, variant: 'wide' }),
		]

		expect(new Set(urls).size).toBe(urls.length)
	})

	it('encodes a font with spaces and Persian letters once', () => {
		const url = buildFrameUrl({ ...base, font: 'وزیر متن' })

		expect(new URL(url).searchParams.get('font')).toBe('وزیر متن')
	})

	it('keeps parameters that were already in the widget address', () => {
		const url = new URL(
			buildFrameUrl({ ...base, widgetUrl: `${ORIGIN}/w/x?lang=fa` })
		)

		expect(url.searchParams.get('lang')).toBe('fa')
	})
})

describe('hostSandbox', () => {
	it('always gives the floor, with popups able to leave the sandbox', () => {
		expect(hostSandbox([]).split(' ')).toEqual([
			'allow-scripts',
			'allow-same-origin',
			'allow-forms',
			'allow-popups',
			'allow-popups-to-escape-sandbox',
		])
	})

	it('adds only the optional tokens the widget asks for', () => {
		const tokens = hostSandbox([
			'allow-downloads',
			'allow-modals',
			'allow-scripts',
		]).split(' ')

		expect(tokens).toContain('allow-downloads')
		expect(tokens).toContain('allow-modals')
		expect(tokens.filter((token) => token === 'allow-scripts')).toHaveLength(1)
	})

	it('never lets a widget navigate the page or reach anything else', () => {
		const requested = [
			'allow-top-navigation',
			'allow-top-navigation-by-user-activation',
			'allow-top-navigation-to-custom-protocols',
			'allow-storage-access-by-user-activation',
			'allow-orientation-lock',
			'',
			'x y',
		]

		const tokens = hostSandbox(requested).split(' ')

		for (const token of requested) {
			expect(tokens).not.toContain(token)
		}
	})
})

describe('hostAllow', () => {
	it('passes the permissions a widget may use and drops the rest', () => {
		expect(hostAllow(['fullscreen', 'clipboard-write', 'camera', 'microphone'])).toBe(
			'fullscreen; clipboard-write'
		)
		expect(hostAllow(['geolocation', 'payment', 'fullscreen; camera'])).toBe('')
		expect(hostAllow([])).toBe('')
	})

	it('lists each permission once', () => {
		expect(hostAllow(['fullscreen', 'fullscreen'])).toBe('fullscreen')
	})
})

describe('launchTimeoutMs', () => {
	it('uses the widget value or eight seconds', () => {
		expect(launchTimeoutMs(null)).toBe(DEFAULT_TIMEOUT_MS)
		expect(launchTimeoutMs(3000)).toBe(3000)
	})
})

describe('colorSchemeOf', () => {
	it('is light only when the theme says light', () => {
		expect(colorSchemeOf('light')).toBe('light')
		expect(colorSchemeOf(' light ')).toBe('light')
		expect(colorSchemeOf('dark')).toBe('dark')
		expect(colorSchemeOf('light dark')).toBe('dark')
		expect(colorSchemeOf('')).toBe('dark')
	})
})

describe('createRefreshLimiter', () => {
	it('lets one request through per interval', () => {
		const allow = createRefreshLimiter(1000)

		expect(allow(0)).toBe(true)
		expect(allow(500)).toBe(false)
		expect(allow(999)).toBe(false)
		expect(allow(1000)).toBe(true)
		expect(allow(1001)).toBe(false)
	})

	it('keeps separate limiters apart', () => {
		const first = createRefreshLimiter(1000)
		const second = createRefreshLimiter(1000)

		expect(first(0)).toBe(true)
		expect(second(0)).toBe(true)
	})
})
