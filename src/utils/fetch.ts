import { z, ZodError } from 'zod/v4'

import { problemDetailsSchema } from '@/schemas/problemDetails'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'

export async function fetchAndParse<T>(url: string, schema: z.ZodType<T>, options?: RequestInit): Promise<T> {
    const res = await fetch(url, options)
    const isJson = (res.headers.get('content-type') ?? '').includes('json')
    const payload: unknown = isJson ? await res.json() : await res.text()

    if (res.ok) {
        try {
            return schema.parse(payload)
        } catch (error) {
            if (error instanceof ZodError) {
                /* eslint-disable-next-line no-console */
                console.error('Zod parsing error:', error)
                // Bevar den originale ZodError med payload som cause
                const enhancedError = new Error('Invalid response format from server')
                enhancedError.cause = error
                ;(enhancedError as Error & { originalPayload: unknown; url: string }).originalPayload = payload
                ;(enhancedError as Error & { originalPayload: unknown; url: string }).url = url
                throw enhancedError
            }
            throw error
        }
    }
    if (res.ok) {
        return schema.parse(payload)
    }

    const maybeProblem = problemDetailsSchema.safeParse(payload)
    if (maybeProblem.success) {
        throw new ProblemDetailsError(maybeProblem.data)
    }

    throw new ProblemDetailsError({
        title: 'Ukjent feil',
        status: res.status,
        detail: `Failed to fetch ${url}: ${res.status}`,
        type: 'about:blank',
    })
}

export async function postAndParse<T>(url: string, schema: z.ZodType<T>, body: unknown): Promise<T> {
    return fetchAndParse(url, schema, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
}

export async function putAndParse<T>(url: string, schema: z.ZodType<T>, body: unknown): Promise<T> {
    return fetchAndParse(url, schema, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
}

export async function deleteNoContent(url: string): Promise<void> {
    const res = await fetch(url, { method: 'DELETE' })

    if (!res.ok) {
        const isJson = (res.headers.get('content-type') ?? '').includes('json')
        const payload: unknown = isJson ? await res.json() : await res.text()

        const maybeProblem = problemDetailsSchema.safeParse(payload)
        if (maybeProblem.success) {
            throw new ProblemDetailsError(maybeProblem.data)
        }

        throw new ProblemDetailsError({
            title: 'Ukjent feil',
            status: res.status,
            detail: `Failed to delete ${url}: ${res.status}`,
            type: 'about:blank',
        })
    }
}

export async function putNoContent(url: string, body: unknown): Promise<void> {
    const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })

    if (!res.ok) {
        const isJson = (res.headers.get('content-type') ?? '').includes('json')
        const payload: unknown = isJson ? await res.json() : await res.text()

        const maybeProblem = problemDetailsSchema.safeParse(payload)
        if (maybeProblem.success) {
            throw new ProblemDetailsError(maybeProblem.data)
        }

        throw new ProblemDetailsError({
            title: 'Ukjent feil',
            status: res.status,
            detail: `Failed to put ${url}: ${res.status}`,
            type: 'about:blank',
        })
    }
}
