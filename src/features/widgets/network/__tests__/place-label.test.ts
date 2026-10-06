import { describe, expect, it } from 'bun:test'
import { getPlaceLabel } from '../utils/place-label'

describe('getPlaceLabel', () => {
	it('joins the city and the cleaned provider', () => {
		expect(getPlaceLabel('Tehran', 'Iran Telecommunication Company PJS')).toBe(
			'Tehran · Iran Telecommunication PJS'
		)
	})

	it('shows whichever part it has', () => {
		expect(getPlaceLabel('Tehran', null)).toBe('Tehran')
		expect(getPlaceLabel(null, 'Shatel')).toBe('Shatel')
		expect(getPlaceLabel(null, null)).toBe('')
	})
})
