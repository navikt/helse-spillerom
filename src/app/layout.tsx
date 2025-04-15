import type { Metadata } from 'next'
import React, { PropsWithChildren, ReactElement } from 'react'

import { erLokal } from '@/env'
import '../styles/globals.css'
import { Header } from '@/components/header/Header'
import Providers from '@/app/providers'

export const metadata: Metadata = {
    title: `Speil ${erLokal ? ' - localhost' : ''}`,
    icons: {
        icon: `/favicons/${erLokal ? 'favicon-local.ico' : 'favicon-dev.ico'}`,
    },
}

export default async function RootLayout({ children }: Readonly<PropsWithChildren>): Promise<ReactElement> {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <Header />
                    <main role="main">{children}</main>
                </Providers>
            </body>
        </html>
    )
}
