export function HabitEmpty() {
	return (
		<div className="flex flex-col items-center justify-center h-full gap-2 px-4">
			<div className="flex items-center justify-center w-12 h-12">
				<img
					src="https://cdn.widgetify.ir/system/no-items.png"
					alt="بدون عادت"
					className="object-contain w-48 h-auto select-none"
				/>
			</div>

			<p className="mt-1 font-bold text-center text-content">
				عادت‌های خوب رو از اینجا شروع کن 🌱
			</p>

			<p className="text-center text-[.65rem] leading-5 text-content opacity-75">
				اولین عادتت رو اضافه کن
				<br />
				مثلا:
				<br />💧 نوشیدن ۸ لیوان آب
				<br />📖 ۲۰ دقیقه مطالعه
				<br />🚶 ۳۰ دقیقه پیاده‌روی
			</p>
		</div>
	)
}
