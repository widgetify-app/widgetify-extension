import { getFromStorage, setToStorage } from '@/common/storage'

const INSTALLATION_ID = /^[A-Za-z0-9._:-]{1,128}$/

export async function installationId(): Promise<string> {
	const stored = await getFromStorage('installationId')

	if (stored && INSTALLATION_ID.test(stored)) return stored

	const id = crypto.randomUUID()

	await setToStorage('installationId', id)

	return id
}
