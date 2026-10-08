import { fa } from './fa'

export type MessageKey = keyof typeof fa

type ExtractParams<S extends string> = S extends `${string}{${infer P}}${infer Rest}`
	? P | ExtractParams<Rest>
	: never

type ParamsFor<K extends MessageKey> =
	ExtractParams<(typeof fa)[K]> extends never
		? never
		: { [P in ExtractParams<(typeof fa)[K]>]: string | number }

export function t(key: MessageKey): string
export function t<K extends MessageKey>(key: K, params: ParamsFor<K>): string
export function t(key: MessageKey, params?: Record<string, string | number>): string {
	const template = fa[key] as string
	if (!params) return template
	return template.replace(/\{(\w+)\}/g, (_, name: string) => {
		const value = params[name]
		return value === undefined || value === null ? `{${name}}` : String(value)
	})
}
