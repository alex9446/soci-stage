// deno-lint-ignore no-explicit-any
export function jsonResponse(json: any, status: number) {
  return new Response(JSON.stringify(json), {
    headers: { 'Content-Type': 'application/json' },
    status: status
  })
}

export function jsonResponseMessage(message: string, status: number) {
  return jsonResponse({ message: message }, status)
}
