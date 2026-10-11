export const MESSAGE_READY = 'WIDGETIFY_APP_READY'

export const MESSAGE_AUTH = 'WIDGETIFY_AUTH'

export const MESSAGE_REFRESH_AUTH = 'WIDGETIFY_REFRESH_AUTH'

export const DEFAULT_TIMEOUT_MS = 8000

export const REFRESH_MIN_INTERVAL_MS = 10_000

const SANDBOX_FLOOR = [
	'allow-scripts',
	'allow-same-origin',
	'allow-forms',
	'allow-popups',
	'allow-popups-to-escape-sandbox',
]

const SANDBOX_OPTIONAL = [
	'allow-modals',
	'allow-downloads',
	'allow-pointer-lock',
	'allow-presentation',
]

const ALLOWED_POLICIES = [
	'fullscreen',
	'clipboard-write',
	'web-share',
	'pointer-lock',
	'gamepad',
]

type FrameMessageKind = 'ready' | 'refresh'

interface FrameMessageEvent {
	source: unknown
	origin: string
	data: unknown
}

interface FrameUrlInput {
	widgetUrl: string
	theme: string
	colorScheme: 'light' | 'dark'
	font: string
	width: number
	height: number
	variant?: string | null
}

export function frameMessageKind(
	event: FrameMessageEvent,
	frameWindow: unknown,
	origin: string
): FrameMessageKind | null {
	if (!frameWindow || event.source !== frameWindow || event.origin !== origin) {
		return null
	}

	const type = (event.data as { type?: unknown } | null)?.type

	if (type === MESSAGE_READY) return 'ready'
	if (type === MESSAGE_REFRESH_AUTH) return 'refresh'

	return null
}

export function authMessage(auth: { data: string; signature: string }) {
	return {
		type: MESSAGE_AUTH,
		payload: { data: auth.data, signature: auth.signature },
	}
}

export function buildFrameUrl(input: FrameUrlInput): string {
	const url = new URL(input.widgetUrl)

	url.searchParams.set('mode', 'widget')
	url.searchParams.set('client', 'EXTENSION')
	url.searchParams.set('referrer', 'EXTENSION')
	url.searchParams.set('theme', input.theme)
	url.searchParams.set('colorScheme', input.colorScheme)
	url.searchParams.set('font', input.font)
	url.searchParams.set('w', String(input.width))
	url.searchParams.set('h', String(input.height))

	if (input.variant) url.searchParams.set('variant', input.variant)

	return url.toString()
}

export function hostSandbox(requested: string[]): string {
	const extra = requested.filter((token) => SANDBOX_OPTIONAL.includes(token))

	return [...new Set([...SANDBOX_FLOOR, ...extra])].join(' ')
}

export function hostAllow(requested: string[]): string {
	const allowed = requested.filter((token) => ALLOWED_POLICIES.includes(token))

	return [...new Set(allowed)].join('; ')
}

export function launchTimeoutMs(timeoutMs: number | null): number {
	return timeoutMs ?? DEFAULT_TIMEOUT_MS
}

export function colorSchemeOf(declared: string): 'light' | 'dark' {
	return declared.trim() === 'light' ? 'light' : 'dark'
}

export function createRefreshLimiter(minIntervalMs: number) {
	let last = Number.NEGATIVE_INFINITY

	return (now: number): boolean => {
		if (now - last < minIntervalMs) return false
		last = now
		return true
	}
}
