interface CachedAnswer<T> {
	read: () => Promise<T | null>
	load: () => Promise<T>
	save: (value: T) => Promise<void>
}

export async function cachedAnswer<T>({ read, load, save }: CachedAnswer<T>): Promise<T> {
	const saved = await read()

	if (saved !== null) return saved

	const fresh = await load()

	await save(fresh)

	return fresh
}
