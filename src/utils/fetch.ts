import { z, ZodError } from 'zod'

export async function fetchAndParse<T>(url: string, schema: z.ZodType<T>, options?: RequestInit): Promise<T> {
    const res = await fetch(url, options)

    if (!res.ok) {
        throw new Error(`Failed to fetch ${url}: ${res.status}`)
    }

    const json = await res.json()

    try {
        return schema.parse(json)
    } catch (error) {
        if (error instanceof ZodError) {
            /* eslint-disable-next-line no-console */
            console.error('Zod parsing error:', error.flatten())
            throw new Error('Invalid response format from server')
        }
        throw error
    }
}

export async function postAndParse<T>(url: string, schema: z.ZodType<T>, body: unknown): Promise<T> {
    return fetchAndParse(url, schema, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
}
