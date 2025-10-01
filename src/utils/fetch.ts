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
                const enhancedError = enhanceZodError(error, payload)
                /* eslint-disable-next-line no-console */
                console.error('Zod parsing error:', enhancedError)
                //throw new Error('Invalid response format from server\n ' + JSON.stringify(enhancedError, null, 2) )
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

/**
 * Hjelpefunksjon for å hente ut verdier fra et objekt basert på en path
 * Håndterer arrays, objekter og edge cases trygt
 */
function getValueByPath(obj: unknown, path: (string | number)[]): unknown {
    try {
        let current = obj

        for (const key of path) {
            // Håndter null/undefined
            if (current === null || current === undefined) {
                return undefined
            }

            // Håndter arrays
            if (Array.isArray(current)) {
                if (typeof key === 'number' && key >= 0 && key < current.length) {
                    current = current[key]
                } else {
                    return undefined
                }
            }
            // Håndter objekter
            else if (typeof current === 'object' && current !== null) {
                if (key in current) {
                    current = (current as Record<string | number, unknown>)[key]
                } else {
                    return undefined
                }
            }
            // Hvis current ikke er et objekt eller array, kan vi ikke navigere videre
            else {
                return undefined
            }
        }

        return current
    } catch (error) {
        // Hvis noe går galt, returner undefined i stedet for å krasje
        /* eslint-disable-next-line no-console */
        console.warn('Error in getValueByPath:', error, 'for path:', path)
        return undefined
    }
}

/**
 * Forbedrer ZodError med faktiske verdier fra payload
 */
function enhanceZodError(error: ZodError, payload: unknown): ZodError {
    try {
        const enhancedIssues = error.issues.map((issue) => {
            // Konverter path til string/number array, hopp over symboler
            const path = issue.path.filter(
                (key): key is string | number => typeof key === 'string' || typeof key === 'number',
            )
            const actualValue = getValueByPath(payload, path)

            // Formater den faktiske verdien trygt
            let formattedValue = 'undefined'
            if (actualValue !== undefined) {
                try {
                    formattedValue = JSON.stringify(actualValue)
                } catch {
                    // Hvis JSON.stringify feiler (f.eks. sirkulære referanser), bruk toString
                    formattedValue = String(actualValue)
                }
            }

            // Legg til den faktiske verdien i feilmeldingen
            const enhancedMessage =
                actualValue !== undefined ? `${issue.message} (faktisk verdi: ${formattedValue})` : issue.message

            return {
                ...issue,
                message: enhancedMessage,
                // Legg til den faktiske verdien som en ekstra property
                actualValue,
            }
        })

        return new ZodError(enhancedIssues)
    } catch (enhancementError) {
        // Hvis noe går galt med enhancement, returner original error
        /* eslint-disable-next-line no-console */
        console.warn('Error enhancing ZodError:', enhancementError)
        return error
    }
}
