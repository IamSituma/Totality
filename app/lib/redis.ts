// redis.ts
// Upstash redis removed — export a noop placeholder to avoid import errors.

export const redis = null as unknown as {
  get: (...args: any[]) => Promise<any>
  set: (...args: any[]) => Promise<any>
}
