type TickMode = 'stopped' | 'idle' | 'frame'

export const IDLE_POLL_MS = 100

interface TickFacts {
	visible: boolean
	still: boolean
	grounded: boolean
	hasFood: boolean
}

export function chooseTickMode(facts: TickFacts): TickMode {
	if (!facts.visible) return 'stopped'
	if (facts.still && facts.grounded && !facts.hasFood) return 'idle'
	return 'frame'
}
