'use client'

import { ReactElement } from 'react'

import { TilkommenInntektForm } from '@components/saksbilde/tilkommen-inntekt/TilkommenInntektForm'

export default function OpprettTilkommenInntektPage(): ReactElement {
    return (
        <section className="flex-auto">
            <TilkommenInntektForm />
        </section>
    )
}
