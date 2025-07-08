'use client'

import { ReactElement } from 'react'
import { Button, Heading } from '@navikt/ds-react'
import { usePathname, useRouter } from 'next/navigation'

import { SaksbehandlingsperioderTabell } from '@components/saksbilde/saksbehandlingsperioder/SaksbehandlingsperioderTabell'
import { useBrukerRoller } from '@/hooks/queries/useBrukerRoller'

export default function PersonPage(): ReactElement {
    const router = useRouter()
    const pathname = usePathname()
    const { data: brukerRoller } = useBrukerRoller()

    return (
        <section className="flex-auto p-8">
            {brukerRoller.saksbehandler && (
                <div className="mb-8">
                    <Button
                        variant="secondary-neutral"
                        onClick={() => router.push(pathname + '/opprett-saksbehandlingsperiode')}
                    >
                        Start ny behandling
                    </Button>
                </div>
            )}
            <div>
                <Heading level="2" size="medium" className="mb-4">
                    Behandlingsperioder
                </Heading>
                <SaksbehandlingsperioderTabell />
            </div>
        </section>
    )
}
