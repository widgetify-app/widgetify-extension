import { describe, expect, it } from 'bun:test'
import { focusTarget } from '../focus-target'

const REGISTRY = { clock: {}, 'widget:avaje': {} }

describe('focusTarget', () => {
	it('returns a key the registry knows', () => {
		expect(focusTarget('clock', REGISTRY)).toBe('clock')
		expect(focusTarget('widget:avaje', REGISTRY)).toBe('widget:avaje')
	})

	it('ignores spaces around the key', () => {
		expect(focusTarget('  widget:avaje ', REGISTRY)).toBe('widget:avaje')
	})

	it('returns null for a key the registry does not have', () => {
		expect(focusTarget('widget:gone', REGISTRY)).toBeNull()
		expect(focusTarget('', REGISTRY)).toBeNull()
	})

	it('returns null for anything that is not a string', () => {
		expect(focusTarget(undefined, REGISTRY)).toBeNull()
		expect(focusTarget(null, REGISTRY)).toBeNull()
		expect(focusTarget({ widgetId: 'clock' }, REGISTRY)).toBeNull()
		expect(focusTarget(3, REGISTRY)).toBeNull()
	})

	it('does not treat object prototype names as keys', () => {
		expect(focusTarget('toString', REGISTRY)).toBeNull()
		expect(focusTarget('constructor', REGISTRY)).toBeNull()
	})
})
