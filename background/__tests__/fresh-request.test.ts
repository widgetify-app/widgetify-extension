import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { asksForFreshCopy } from '../cache-config'

const client = readFileSync('src/services/api.ts', 'utf8')

describe('asksForFreshCopy', () => {
	it('treats an explicit refresh as a request for a fresh copy', () => {
		expect(asksForFreshCopy({ cache: 'reload' })).toBe(true)
	})

	it('leaves an ordinary API request on its cache strategy', () => {
		expect(asksForFreshCopy({ cache: 'no-cache' })).toBe(false)
		expect(asksForFreshCopy({ cache: 'default' })).toBe(false)
	})
})

describe('the main API client', () => {
	it('asks the server on every request instead of replaying a stored reply', () => {
		expect(client).toContain(
			"adapter: 'fetch',\n\t\tfetchOptions: { cache: 'no-cache' },"
		)
	})

	it('sends an explicit refresh with the mode the worker treats as fresh', () => {
		expect(client).toMatch(/FRESH_REQUEST[^}]*cache: 'reload'/)
	})
})
