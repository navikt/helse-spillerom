import '../styles/globals.css'
import type { Metadata } from 'next'
import React, { PropsWithChildren, ReactElement } from 'react'
import { Page } from '@navikt/ds-react'

import { erDemo, erDev, erLokal } from '@/env'
import { Header } from '@/components/header/Header'
import { Preload } from '@/app/preload'
import { Providers } from '@/app/providers'

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
        <html lang="nb">
            <Preload />
            <body>
                <Page contentBlockPadding="none">
                    <Providers>
                        <Header />
                        {children}
                    </Providers>
                </Page>
            </body>
        </html>
    )
}
