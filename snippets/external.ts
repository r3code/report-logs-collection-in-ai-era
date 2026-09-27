/* eslint-disable no-console */

// #region snippet
// Inside ./snippets/external.ts
export function emptyArray<T>(length: number) {
  return Array.from<T>({ length })
}
// #endregion snippet

export function fill<T>(length: number, value: T): T[] {
  return Array.from<T>({ length }).fill(value)
}
