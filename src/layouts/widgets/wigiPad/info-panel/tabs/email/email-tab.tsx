import { EmailMessageItem } from '../../components/email-message-item'

interface EmailTabProps {
	emailMessages: Array<{
		id: string
		threadId: string
		subject: string
		sender: string
		snippet: string
	}>
}

export function EmailTab({ emailMessages }: EmailTabProps) {
	// if (emailMessages.length === 0) return

	const emailSample = [
		{
			id: '197dba5d4ec4bc99',
			threadId: '197dba5d4ec4bc99',
			subject: 'هشدار امنیتی',
			sender: 'Google <no-reply@accounts.google.com>',
			snippet:
				'به Widgetify - ویجتی‌فای اجازه داده‌اید به برخی‌از داده‌های «حساب Google» شما دسترسی داشته باشد sajjadmrx@gmail.com‏ اگر شما به Widgetify - ویجتی‌فای اجازه نداده‌اید به برخی‌از داده‌های «حساب Google»',
		},
		{
			id: '197c695164730b47',
			threadId: '197c695164730b47',
			subject: 'Building a team of leaders',
			sender: 'monday insights <team@learn.mail.monday.com>',
			snippet:
				'Redefining success • Unlocking talent • The Vatican on AI July 1, 2025 The monday.com weekly monday.com&#39;s take on the latest work trends - sent on Tuesdays Inside this issue Workplace trends The AI',
		},
		{
			id: 'adfk',
			threadId: 'asdfadsf',
			subject: 'faksjdf lajsdiofja sdffiajsdij aoisdjf ',
			sender: 'akjsdfklj alksdjf lkajsdlf kjalsdfj alsdf',
			snippet: 'asdfasdfjaksdflakjsdf',
		},
		{
			id: 'adfk',
			threadId: 'asdfadsf',
			subject: 'faksjdf lajsdiofja sdffiajsdij aoisdjf ',
			sender: 'akjsdfklj alksdjf lkajsdlf kjalsdfj alsdf',
			snippet: 'asdfasdfjaksdflakjsdf',
		},
		{
			id: 'adfk',
			threadId: 'asdfadsf',
			subject: 'faksjdf lajsdiofja sdffiajsdij aoisdjf ',
			sender: 'akjsdfklj alksdjf lkajsdlf kjalsdfj alsdf',
			snippet: 'asdfasdfjaksdflakjsdf',
		},
		{
			id: 'adfk',
			threadId: 'asdfadsf',
			subject: 'faksjdf lajsdiofja sdffiajsdij aoisdjf ',
			sender: 'akjsdfklj alksdjf lkajsdlf kjalsdfj alsdf',
			snippet: 'asdfasdfjaksdflakjsdf',
		},
	]

	return (
		<div className="space-y-2">
			{emailSample.map((email, index) => (
				<EmailMessageItem key={index} email={email} />
			))}
		</div>
	)
}
