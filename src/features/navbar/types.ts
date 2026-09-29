export type BirthdayConfettiKey = `birthday-confetti-${string}`

declare module '@/common/constants/store-keys' {
	interface StorageKV {
		[key: BirthdayConfettiKey]: string
	}
}
