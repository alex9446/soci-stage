import { createResource, For, Suspense } from 'solid-js'
import { action } from '@solidjs/router'
import { useSupabase } from '../context'
import './Register.sass'

const fetchGroups = async () => {
  const supabaseClient = useSupabase()!
  const { data: groups, error } = await supabaseClient.from('groups').select('id,name').order('id')
  if (error) throw error.message
  return groups
}

const createUser = action(async (formData: FormData) => {
  const email = formData.get('email')
  const password = formData.get('password')
  const firstName = formData.get('first-name')
  const lastName = formData.get('last-name')
  const watchword = formData.get('watchword')
  const group = formData.get('group')
  console.debug(email, password, firstName, lastName, watchword, group)
})

const Register = () => {
  const [groups] = createResource(fetchGroups)

  return (
    <main id='register-page'>
      <form method='post' action={createUser}>
        <input type='email' name='email' required placeholder='email' />
        <input type='password' name='password' required minLength="6" placeholder='password' />
        <input type='text' name='first-name' required placeholder='nome' />
        <input type='text' name='last-name' required placeholder='cognome' />
        <select name='group'>
          <Suspense fallback={<option>Caricamento gruppi...</option>}>
            <For each={groups()}>
              {(group) => <option value={group.id}>{group.name}</option>}
            </For>
          </Suspense>
        </select>
        <label for='watchword'>Parola d'ordine:</label>
        <input id='watchword' type='text' name='watchword' required />
        <input type='submit' value='Registrami' />
      </form>
    </main>
  )
}

export default Register
