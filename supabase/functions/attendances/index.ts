// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js@2/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import * as uuid from 'jsr:@std/uuid@1'
import { Database } from '../_shared/database.types.ts'

const validActions = ['verify', 'set']
const validTimes = {
  start: 1,
  end: 24
}

console.info(`Edge function "attendances" up and running!`)

// deno-lint-ignore no-explicit-any
function jsonResponse(json: any, status: number) {
  return new Response(JSON.stringify(json), {
      headers: { 'Content-Type': 'application/json' },
      status: status
  })
}

Deno.serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok')
  }

  try {
    // check payload
    const { action, group } = await req.json()
    if (!validActions.includes(action)) return jsonResponse({ message: 'action not valid!' }, 400)
    if (!Number.isInteger(group)) return jsonResponse({ message: 'group is not an integer!' }, 400)

    const supabaseAdmin = createClient<Database>(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SECRET_FUNCTIONS_KEY')!
    )

    // user valid?
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError) return jsonResponse({ message: authError.message }, 401)
    if (!user || !uuid.validate(user.id)) return jsonResponse({ message: 'user.id not valid!' }, 401)

    // can set attendance?
    const nowInRome = Temporal.Now.zonedDateTimeISO('Europe/Rome')
    // TO-DO verify in attendances table
    const { data: groupsRows, error: selectError } = await supabaseAdmin
      .from('groups')
      .select('id,days_of_week')
      .eq('id', group)
    if (selectError) throw selectError
    if (groupsRows.length !== 1) return jsonResponse({ message: 'non-existent group!' }, 400)
    const allowedDay = groupsRows[0].days_of_week.includes(nowInRome.dayOfWeek)
    const allowedTime = (nowInRome.hour >= validTimes.start && nowInRome.hour < validTimes.end)
    if (!allowedDay || !allowedTime) return jsonResponse({ message: 'day or time not allowed!' }, 403)

    if (action === 'verify') {
      return jsonResponse({ day_of_week: nowInRome.dayOfWeek }, 200)
    } else if (action === 'set') {
      const { error: insertError } = await supabaseAdmin
        .from('attendances')
        .insert([
          { marked_day: nowInRome.toPlainDate().toString(), user_id: user.id, group_id: group },
        ])
      if (insertError) throw insertError
      return jsonResponse({ message: 'attendance marked' }, 200)
    }
    return jsonResponse({ message: 'I\'m a teapot' }, 418)

  // deno-lint-ignore no-explicit-any
  } catch (err: any) {
    return jsonResponse({ message: err?.message ?? err }, 500)
  }
})
