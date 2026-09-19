import { Button } from '@/components/ui'

interface Prop {
	handleReload: () => void
	onClickToBack: () => void
}

export function MiniAppError({ handleReload, onClickToBack }: Prop) {
	return (
		<div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 p-6 text-center">
			<div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-danger-subtle">
				<svg
					className="w-10 h-10 text-error"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>

			<p className="text-lg font-bold text-content">خطا در اجرای برنامک</p>
			<p className="max-w-xs text-sm text-muted">
				عاممم یه مشکلی رخ داد، دوباره تلاش کنید.
			</p>
			<div className="flex flex-col gap-2 mt-4 w-80">
				<Button
					size="sm"
					type="button"
					className="w-full"
					rounded={'2xl'}
					color={'primary'}
					onClick={handleReload}
				>
					تلاش مجدد
				</Button>
				<Button
					type="button"
					size="sm"
					// className=""
					rounded={'2xl'}
					onClick={() => onClickToBack()}
				>
					بازگشت
				</Button>
			</div>
		</div>
	)
}
