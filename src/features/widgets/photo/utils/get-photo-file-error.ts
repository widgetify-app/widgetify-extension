export function getPhotoFileError(file: { type: string; size: number }): string | null {
	if (!file.type.startsWith('image/')) {
		return 'فقط عکس می‌تونی انتخاب کنی'
	}

	return null
}
