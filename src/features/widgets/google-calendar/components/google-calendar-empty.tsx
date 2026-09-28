import { WidgetEmpty } from '@/features/widgets/components/widget-empty'

interface GoogleCalendarEmptyProps {
	message: string
}

export function GoogleCalendarEmpty({ message }: GoogleCalendarEmptyProps) {
	return <WidgetEmpty art="calendar" description={message} />
}
