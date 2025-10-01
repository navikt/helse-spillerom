import '@navikt/ds-tokens/darkside-css'
import '../styles/globals.css'
import type { Metadata } from 'next'
import React, { PropsWithChildren, ReactElement } from 'react'
import { Page } from '@navikt/ds-react'

import { erDemo, erDev, erLokal } from '@/env'
import { Header } from '@/components/header/Header'
import { Preload } from '@/app/preload'
import { Providers } from '@/app/providers'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { QueryErrors } from '@/components/QueryErrors'

function title() {
    function postfix() {
        if (erDev) return ' - dev'
        if (erDemo) return ' - demo'
        if (erLokal) return ' - localhost'
        return ''
    }

    return `Spillerom${postfix()}`
}

export const metadata: Metadata = {
    title: title(),
    icons: {
        icon: `/favicons/${erLokal ? 'favicon-local.ico' : 'favicon-dev.ico'}`,
    },
}

export default async function RootLayout({ children }: Readonly<PropsWithChildren>): Promise<ReactElement> {
    return (
        <html lang="nb" suppressHydrationWarning>
            <Preload />
            <body className="min-w-2xl">
                <Providers>
                    <ErrorBoundary>
                        <Page contentBlockPadding="none">
                            <Header />
                            <QueryErrors />
                            {children}
                        </Page>
                    </ErrorBoundary>
                </Providers>
            </body>
        </html>
    )
}
