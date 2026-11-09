import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

const hook = readFileSync('src/services/extension/get-notifications.hook.ts', 'utf8')

describe('reading the notifications', () => {
	it('is one request to the feed route', () => {
		expect(hook.match(/'\/v2\/notifications\/feed'/g)).toHaveLength(1)
	})

	it('no longer reads the inbox and the surfaces as two requests', () => {
		expect(hook).not.toContain("'/v2/notifications/inbox'")
		expect(hook).not.toContain('get<{ data: RawSurfaces }>')
		expect(hook).not.toMatch(/'\/v2\/notifications\/surfaces'\)/)
	})
})
