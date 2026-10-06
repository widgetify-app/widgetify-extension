import { describe, expect, it } from 'bun:test'
import { cleanIspName } from '../utils/clean-isp-name'

describe('cleanIspName', () => {
	it('drops the legal form and the bracketed part', () => {
		expect(cleanIspName('Iran Telecommunication Company PJS')).toBe(
			'Iran Telecommunication PJS'
		)
		expect(cleanIspName('Pars Online (AS16322) Ltd.')).toBe('Pars Online')
	})

	it('keeps a name that is only a legal form', () => {
		expect(cleanIspName('LLC')).toBe('LLC')
	})
})
