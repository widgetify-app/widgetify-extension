import { useEffect } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import type { BirthdayConfettiKey } from '../types'

function birthdayConfettiKey(date: Date): BirthdayConfettiKey {
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `birthday-confetti-${date.getFullYear()}-${month}-${day}`
}

export function useBirthdayConfetti(isBirthday: boolean) {
	useEffect(() => {
		if (!isBirthday) return

		let timer: ReturnType<typeof setTimeout> | undefined
		let cancelled = false

		const run = async () => {
			const storageKey = birthdayConfettiKey(new Date())
			if (await getFromStorage(storageKey)) return
			if (cancelled) return

			timer = setTimeout(async () => {
				const { default: confetti } = await import('canvas-confetti')
				confetti({
					particleCount: 80,
					spread: 60,
					origin: { y: 0.3 },
				})
				await setToStorage(storageKey, 'true')
			}, 2000)
		}

		run()

		return () => {
			cancelled = true
			clearTimeout(timer)
		}
	}, [isBirthday])
}
