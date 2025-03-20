'use client';

import { Calendar } from '@/components/ui/calendar-rac';
import { getLocalTimeZone, today } from '@internationalized/date';

export function MyCalendar() {
  return <Calendar className="rounded-md" value={today(getLocalTimeZone())} onChange={() => {}} />;
}
