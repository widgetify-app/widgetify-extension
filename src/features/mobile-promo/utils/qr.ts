import qrcode from 'qrcode-generator'

export function buildQrMatrix(text: string): boolean[][] {
	const qr = qrcode(0, 'H')

	qr.addData(text)
	qr.make()

	const size = qr.getModuleCount()

	return Array.from({ length: size }, (_, row) =>
		Array.from({ length: size }, (_, column) => qr.isDark(row, column))
	)
}
