import { Button } from '@/components/button/button'
import { TiWarningOutline } from 'react-icons/ti'

interface Prop {
	onRun: () => void
}
export function WebAppStartGate({ onRun }: Prop) {
	return (
		<div className="absolute inset-0 flex items-center justify-center p-6">
			<div className="flex flex-col items-center w-full max-w-md gap-5 p-5 text-center border shadow-xs rounded-2xl bg-base-100 border-base-300">
				<div className="flex flex-col items-center gap-2">
					<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
						<span className="text-lg text-primary">
							<TiWarningOutline />
						</span>
					</div>

					<p className="text-sm font-medium">
						اجرای برنامه نیاز به تأیید شما دارد
					</p>
				</div>

				<p className="text-xs leading-relaxed opacity-60">
					با اجرای این برنامه، شما مسئولیت استفاده از آن را می‌پذیرید. ویجتیفای
					تنها نقش اجراکننده را دارد و محتوای این سرویس‌ها را کنترل نمی‌کند.
					همچنین برخی اطلاعات غیرحساس مانند نام کاربری و تصویر پروفایل ممکن است
					برای بهبود تجربه کاربری در اختیار این برنامه قرار بگیرد.
				</p>

				<Button
					onClick={onRun}
					isPrimary
					size="sm"
					className="w-full text-sm border-none"
					rounded="xl"
				>
					اجرای برنامه
				</Button>
			</div>
		</div>
	)
}
