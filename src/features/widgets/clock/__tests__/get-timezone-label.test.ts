import { describe, expect, it } from 'bun:test'
import { getTimeZoneLabel } from '../utils/get-timezone-label'

describe('getTimeZoneLabel', () => {
	it('keeps a three letter zone as it is', () => {
		expect(getTimeZoneLabel('UTC')).toBe('UTC')
		expect(getTimeZoneLabel('EST')).toBe('EST')
	})

	it('shows the city of a region zone in capitals', () => {
		expect(getTimeZoneLabel('Asia/Tehran')).toBe('TEHRAN')
	})

	it('turns the underscore of a city into a space', () => {
		expect(getTimeZoneLabel('America/New_York')).toBe('NEW YORK')
	})

	it('keeps a zone that has no region', () => {
		expect(getTimeZoneLabel('Tehran')).toBe('Tehran')
	})
})
