let lookBelongsToAccount = true

export function isLookSyncedWithAccount(): boolean {
	return lookBelongsToAccount
}

export function setLookSyncedWithAccount(value: boolean) {
	lookBelongsToAccount = value
}
