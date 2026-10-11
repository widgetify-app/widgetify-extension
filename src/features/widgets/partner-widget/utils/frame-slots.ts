const MAX_LIVE_FRAMES = 6

export function createFrameSlots(limit: number) {
	const live: string[] = []
	const visible = new Set<string>()
	const listeners = new Set<(id: string) => void>()

	const evict = () => {
		while (live.length > limit) {
			const index = live.findIndex((id) => !visible.has(id))

			if (index === -1) return

			const [id] = live.splice(index, 1)

			for (const listener of listeners) listener(id)
		}
	}

	return {
		isLive: (id: string) => live.includes(id),
		touch: (id: string) => {
			const index = live.indexOf(id)

			if (index !== -1) live.splice(index, 1)

			live.push(id)
			evict()
		},
		setVisible: (id: string, isVisible: boolean) => {
			if (isVisible) visible.add(id)
			else visible.delete(id)

			evict()
		},
		release: (id: string) => {
			const index = live.indexOf(id)

			if (index !== -1) live.splice(index, 1)

			visible.delete(id)
		},
		onEvict: (listener: (id: string) => void) => {
			listeners.add(listener)

			return () => {
				listeners.delete(listener)
			}
		},
	}
}

export const frameSlots = createFrameSlots(MAX_LIVE_FRAMES)
