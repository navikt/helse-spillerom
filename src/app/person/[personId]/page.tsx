'use client'

import { ReactElement } from 'react'
import { Button } from '@navikt/ds-react'
import { usePathname, useRouter } from 'next/navigation'

export default function PersonPage(): ReactElement {
    const router = useRouter()
    const pathname = usePathname()
    return (
        <section className="flex-auto">
            <Button
                className="m-8"
                variant="secondary-neutral"
                onClick={() => router.push(pathname + '/opprett-saksbehandlingsperiode')}
            >
                Start ny behandling
            </Button>
        </section>
    )
}
