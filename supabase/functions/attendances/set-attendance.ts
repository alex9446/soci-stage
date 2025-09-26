import { SupabaseClient } from 'jsr:@supabase/supabase-js@2'
import { Database } from '../_shared/database.types.ts'

// const FAKE_DATE = '2000-01-01'


export async function setAttendance(supabaseAdmin: SupabaseClient<Database>,
                                    group: number,
                                    nowInRome: Temporal.ZonedDateTime,
                                    userId: string) {
  const { error } = await supabaseAdmin
    .from('attendances')
    .insert([
      { marked_day: nowInRome.toPlainDate().toString(), user_id: userId, group_id: group }
      // { marked_day: FAKE_DATE, user_id: userId, group_id: group }
    ])
  if (error) return { message: error.message, code: 500 }
  return { message: 'attendance marked', code: 200 }
}
