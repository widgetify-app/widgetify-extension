/**
 * Determines whether optimal mode (reduced motion / low animations) should be activated.
 * Returns true if the user explicitly enabled optimal mode in app settings
 * OR if the operating system / browser prefers reduced motion.
 */
export function shouldReduceMotion(
	userOptimalModeSetting?: boolean | null,
	systemPrefersReducedMotion?: boolean | null
): boolean {
	return Boolean(userOptimalModeSetting || systemPrefersReducedMotion)
}
