'use client'

import React, { PropsWithChildren, ReactElement, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ShortcutProvider } from '@components/tastatursnarveier/context'
import { DemoPersonsøk } from '@/mock-api/DemoPersonsøk'

export function Providers({ children }: PropsWithChildren): ReactElement {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        /* Setting this to true causes the request to be immediately executed after initial
                           mount Even if the query had data hydrated from the server side render */
                        refetchOnMount: false,
                        refetchOnWindowFocus: false,
                    },
                },
            }),
    )

    return (
        <QueryClientProvider client={queryClient}>
            <ShortcutProvider>
                <DemoPersonsøk>{children}</DemoPersonsøk>
            </ShortcutProvider>
        </QueryClientProvider>
    )
}
