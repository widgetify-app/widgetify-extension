export function toPersianDigits(val: string | number): string {
	return String(val).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])
}
