import toast from 'react-hot-toast'
import { Button } from '@/components/button/button'
import { SectionPanel } from '@/components/section-panel'

interface ReferralCodeSectionProps {
	code: string
	enableNewBadge?: boolean
	className?: string
}

export const ReferralCodeSection = ({
	code,
	enableNewBadge = false,
	className,
}: ReferralCodeSectionProps) => {
	const handleCopyCode = async () => {
		try {
			await navigator.clipboard.writeText(code)
			toast.success('کد دعوت کپی شد!')
		} catch (error) {
			console.error('Failed to copy code:', error)
			toast.error('خطا در کپی کردن کد')
		}
	}

	return (
		<SectionPanel
			title={
				<div className="flex items-center gap-2">
					<span>کد دعوت شما</span>
					{enableNewBadge && (
						<span className="text-white badge badge-primary badge-xs">
							جدید
						</span>
					)}
				</div>
			}
			size="sm"
		>
			<div className="space-y-2">
				<div
					className={`flex items-center justify-between p-4 bg-base-200 rounded-2xl ${className}`}
				>
					<div>
						<p className="mb-1 text-sm text-muted">کد دعوت</p>
						<p
							className="font-mono text-lg font-semibold cursor-pointer text-content hover:underline"
							onClick={handleCopyCode}
						>
							{code}
						</p>
					</div>
					<Button
						onClick={handleCopyCode}
						size="sm"
						className="rounded-2xl"
						isPrimary={true}
					>
						کپی کد
					</Button>
				</div>
				<p className="flex text-sm text-muted gap-0.5 items-center">
					از این کد برای دعوت دوستان خود استفاده کنید و هر دو ویج‌کوین دریافت
					کنید!{' '}
				</p>
			</div>
		</SectionPanel>
	)
}
