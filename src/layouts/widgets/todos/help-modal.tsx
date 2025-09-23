import Analytics from '@/analytics'
import Modal from '@/components/modal'

interface TodoHelpModalProps {
	show: boolean
	onClose: () => void
}
export function TodoHelpModal({ show, onClose }: TodoHelpModalProps) {
	useEffect(() => {
		if (show) {
			Analytics.event('view_todo_help_modal')
		}
	}, [show])

	return (
		<Modal
			isOpen={show}
			onClose={onClose}
			title="راهنمای استفاده از ویجت وظایف"
			direction="rtl"
		>
			<div className="p-4">
				<ul className="space-y-4 text-sm leading-relaxed text-muted">
					<li>
						<strong>اضافه کردن وظیفه به روز خاص:</strong> برای اضافه کردن
						وظیفه به یک روز خاص، ابتدا ویجت تقویم را فعال کنید، سپس روز مورد
						نظر را انتخاب کنید و در نهایت وظیفه مورد نظر را وارد کنید.
					</li>
					<li>
						<strong>حالت همه وظایف:</strong> با تغییر حالت به "همه وظایف"،
						تمامی وظایف نمایش داده می‌شود.
					</li>
					<li>
						<strong>حالت لیست ماهانه:</strong> با تغییر حالت به "لیست ماهانه"،
						تمامی وظایف ماه جاری نمایش داده می‌شود.
					</li>
					<li>
						<strong>حالت لیست روزانه:</strong> با تغییر حالت به "لیست روزانه"،
						فقط وظایف امروز نمایش داده می‌شود.
					</li>
					<li>
						<strong>انتخاب روز پیش‌فرض:</strong> در صورت عدم انتخاب روز از ویجت
						تقویم، به طور پیش‌فرض روز امروز انتخاب می‌شود.
					</li>
					<li>
						<strong>حفظ وظایف:</strong> برای جلوگیری از پاک شدن وظایف، بهتر
						است وارد حساب کاربری خود شوید.
					</li>
				</ul>
			</div>
		</Modal>
	)
}
