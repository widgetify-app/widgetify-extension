let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
	if (!audioContext) {
		audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
	}
	return audioContext
}

export function playFoodDropSound(): void {
	try {
		const ctx = getAudioContext()
		const oscillator = ctx.createOscillator()
		const gainNode = ctx.createGain()

		oscillator.connect(gainNode)
		gainNode.connect(ctx.destination)

		oscillator.frequency.setValueAtTime(800, ctx.currentTime)
		oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.2)

		gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
		gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)

		oscillator.start(ctx.currentTime)
		oscillator.stop(ctx.currentTime + 0.2)
	} catch (error) {
		console.debug('Audio context not available:', error)
	}
}

export function playCollectSound(): void {
	try {
		const ctx = getAudioContext()
		const oscillator = ctx.createOscillator()
		const gainNode = ctx.createGain()

		oscillator.connect(gainNode)
		gainNode.connect(ctx.destination)

		// Create a pleasant collect sound
		oscillator.frequency.setValueAtTime(600, ctx.currentTime)
		oscillator.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1)

		gainNode.gain.setValueAtTime(0.08, ctx.currentTime)
		gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

		oscillator.start(ctx.currentTime)
		oscillator.stop(ctx.currentTime + 0.1)
	} catch (error) {
		console.debug('Audio context not available:', error)
	}
}
