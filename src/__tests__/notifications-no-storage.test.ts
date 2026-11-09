import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

const hook = readFileSync('src/services/extension/get-notifications.hook.ts', 'utf8')

const storeKeys = readFileSync('src/common/constants/store-keys.ts', 'utf8')

describe('notifications live only on the server', () => {
	it('the hook never writes to the browser storage', () => {
		expect(hook).not.toContain('setToStorage')
		expect(hook).not.toContain("getFromStorage('inbox')")
		expect(hook).not.toContain('dismissed_notifications')
	})

	it('has no storage key for the inbox or for dismissed notifications', () => {
		expect(storeKeys).not.toMatch(/\binbox\b/)
		expect(storeKeys).not.toContain('dismissed_notifications')
	})
})
