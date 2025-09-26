import { SupabaseClient } from 'jsr:@supabase/supabase-js@2'
import { Database } from '../_shared/database.types.ts'

const validTimes = {
  start: 1,
  end: 24
}


export async function allowedAttendance(supabaseAdmin: SupabaseClient<Database>,
                                        group: number,
                                        nowInRome: Temporal.ZonedDateTime) {
  // TO-DO verify in attendances table
  const { data, error } = await supabaseAdmin
    .from('groups')
    .select('id,days_of_week')
    .eq('id', group)
  if (error) return { message: error.message, code: 500 }
  if (data.length !== 1) return { message: 'non-existent group!', code: 400 }
  const allowedDay = data[0].days_of_week.includes(nowInRome.dayOfWeek)
  const allowedTime = (nowInRome.hour >= validTimes.start && nowInRome.hour < validTimes.end)
  if (!allowedDay || !allowedTime) return { message: 'day or time not allowed!', code: 403 }
  return { message: 'ok', code: 200 }
}
