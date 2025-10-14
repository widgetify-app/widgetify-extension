import { useState } from 'react'
import { FiLogIn, FiUserPlus } from 'react-icons/fi'
import Analytics from '@/analytics'
import { SectionPanel } from '@/components/section-panel'
import { SignInForm } from './sign-in-form'
import { SignUpForm } from './sign-up-form'

type AuthMode = 'signin' | 'signup'

interface AuthTab {
	id: AuthMode
	label: string
	icon: React.ComponentType<{ size?: number; className?: string }>
}

export const AuthForm = () => {
	const [activeMode, setActiveMode] = useState<AuthMode>('signin')

	const authTabs: AuthTab[] = [
		{
			id: 'signin',
			label: 'ورود به حساب',
			icon: FiLogIn,
		},
		{
			id: 'signup',
			label: 'ثبت‌نام',
			icon: FiUserPlus,
		},
	]

	const getTabStyle = (isActive: boolean) => {
		if (isActive) {
			return 'bg-primary text-white border-primary shadow-md'
		}
		return 'bg-transparent text-muted border-base-300 hover:bg-primary/10'
	}

	const handleModeChange = (mode: AuthMode) => {
		setActiveMode(mode)
		Analytics.event(`auth_tab_change_${mode}`)
	}

	return (
		<SectionPanel title="احراز هویت" size="xs">
			<div className="flex gap-1 p-1 mb-4 rounded-2xl bg-base-200">
				{authTabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => handleModeChange(tab.id)}
						className={`flex-1 flex cursor-pointer items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${getTabStyle(activeMode === tab.id)}`}
					>
						<tab.icon size={16} />
						{tab.label}
					</button>
				))}
			</div>

			<div className="flex flex-col justify-center max-w-md mx-auto">
				{activeMode === 'signin' ? (
					<SignInForm
						key="signin"
						onSwitchToSignUp={() => handleModeChange('signup')}
					/>
				) : (
					<SignUpForm
						key="signup"
						onSwitchToSignIn={() => handleModeChange('signin')}
					/>
				)}
			</div>
		</SectionPanel>
	)
}
