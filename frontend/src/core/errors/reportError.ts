export function reportError (error: Error, info?: unknown): void {
  console.error('[Global Error]', error)
  if (info != null) {
    console.error('[Component Stack]', info)
  }
}
