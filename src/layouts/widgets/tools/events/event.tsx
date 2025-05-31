import type { FetchedAllEvents } from '@/services/hooks/date/getEvents.hook'
import type { GoogleCalendarEvent } from '@/services/hooks/date/getGoogleCalendarEvents.hook'
import { motion } from 'framer-motion'
import type { WidgetifyDate } from '../../calendar/utils'
import { EventItem } from './components/EventItem'
import { EventsEmptyState } from './components/EventsEmptyState'
import { combineAndSortEvents } from './utils'

interface EventsProps {
  events: FetchedAllEvents
  googleEvents?: GoogleCalendarEvent[]
  currentDate: WidgetifyDate
  isPreview?: boolean
  onDateChange?: (date: WidgetifyDate) => void
}

export function Events({
  events,
  googleEvents = [],
  currentDate,
}: EventsProps) {
  const sortedEvents = combineAndSortEvents(events, currentDate, googleEvents)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h4 className={'flex items-center text-lg font-medium'}>مناسبت‌ها</h4>
      </div>

      {sortedEvents.length > 0 ? (
        <motion.div
          className={'flex-1 overflow-y-auto h-56 rounded-lg p-2'}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {sortedEvents.map((event, index) => (
            <EventItem
              key={`${event.source}-${index}`}
              event={event}
              index={index}
            />
          ))}
        </motion.div>
      ) : (
        <EventsEmptyState />
      )}
    </div>
  )
}
