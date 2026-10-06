import { WidgetEmpty } from '@/features/widgets/components/widget-empty'

interface GoogleCalendarEmptyProps {
	title: string
	description?: string
}

export function GoogleCalendarEmpty({ title, description }: GoogleCalendarEmptyProps) {
	return <WidgetEmpty art="calendar" title={title} description={description} />
}
