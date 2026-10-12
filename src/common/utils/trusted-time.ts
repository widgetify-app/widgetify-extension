export const MIN_CORRECTED_SKEW_MS = 10_000
export const CLOCK_SYNC_TTL_MS = 3 * 24 * 60 * 60 * 1000

let offsetMs = 0
const listeners = new Set<() => void>()

interface ClockSample {
	serverMs: number
	roundTripMs: number
	systemMs: number
}

export function computeClockOffset({
	serverMs,
	roundTripMs,
	systemMs,
}: ClockSample): number {
	if (!Number.isFinite(serverMs) || serverMs <= 0) return 0

	const offset = Math.round(serverMs + roundTripMs / 2 - systemMs)

	return Math.abs(offset) >= MIN_CORRECTED_SKEW_MS ? offset : 0
}

interface SavedClockSync {
	offset: number
	syncedAt: number
}

export function isClockSyncFresh(
	saved: SavedClockSync | null | undefined,
	systemMs: number
) {
	if (!saved || !Number.isFinite(saved.offset)) return false

	const age = systemMs - saved.syncedAt

	return age >= 0 && age < CLOCK_SYNC_TTL_MS
}

export function setClockOffset(next: number) {
	if (next === offsetMs) return

	offsetMs = next

	for (const listener of listeners) listener()
}

export function nowMs() {
	return Date.now() + offsetMs
}

export function nowDate() {
	return new Date(nowMs())
}

export function onClockCorrected(listener: () => void) {
	listeners.add(listener)

	return () => {
		listeners.delete(listener)
	}
}
