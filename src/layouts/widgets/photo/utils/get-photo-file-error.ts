export function getPhotoFileError(file: { type: string; size: number }): string | null {
	if (!file.type.startsWith('image/')) {
		return 'لطفا یک فایل تصویری انتخاب کن'
	}

	return null
}
