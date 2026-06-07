import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { getFromStorage, setToStorage } from '@/common/storage'

export function useBirthdayConfetti(isBirthday: boolean) {
	useEffect(() => {
		if (!isBirthday) return

		const run = async () => {
			const todayKey = new Date().toISOString().slice(0, 10)
			const storageKey = `birthday-confetti-${todayKey}`

			const alreadyShown = await getFromStorage(storageKey as any)

			if (alreadyShown) return

			setTimeout(() => {
				confetti({
					particleCount: 80,
					spread: 60,
					origin: { y: 0.3 },
				})
			}, 2000)

			await setToStorage(storageKey as any, 'true' as any)
		}

		run()
	}, [isBirthday])
}
