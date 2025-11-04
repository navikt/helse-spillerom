import React, { ComponentPropsWithoutRef, ReactElement } from 'react'
import { PersonPencilFillIcon } from '@navikt/aksel-icons'

import { ArbeidstakerInntektType } from '@schemas/inntektRequest'
import { cn } from '@utils/tw'

export const TagFor: Record<ArbeidstakerInntektType, ReactElement> = {
    DEFAULT: <></>,
    INNTEKTSMELDING: <InntektsmeldingKildeTag />,
    AINNTEKT: <AOrdningenKildeTag />,
    SKJONNSFASTSETTELSE: <SaksbehandlerKildeTag />,
    MANUELT_BEREGNET: <SaksbehandlerKildeTag />,
}

export function AOrdningenKildeTag(): ReactElement {
    return <KildeTag>AO</KildeTag>
}

export function InntektsmeldingKildeTag(): ReactElement {
    return <KildeTag>IM</KildeTag>
}

export function SaksbehandlerKildeTag(): ReactElement {
    return (
        <KildeTag>
            <PersonPencilFillIcon />
        </KildeTag>
    )
}

function KildeTag({ children, ...rest }: ComponentPropsWithoutRef<'div'>): ReactElement {
    const content =
        typeof children === 'string' ? (
            <span className="translate-x-[0.5px] translate-y-[0.5px] transform text-xs">{children}</span>
        ) : (
            children
        )

    const text = children as string

    return (
        <div
            className={cn(
                'flex h-[16px] w-[20px] items-center justify-center rounded-sm border text-ax-small leading-none',
                stylesMap[text] ?? 'border-ax-border-neutral-strong bg-ax-bg-neutral-moderate',
            )}
            {...rest}
        >
            {content}
        </div>
    )
}

const stylesMap: Record<string, string> = {
    AO: 'border-ax-border-success bg-ax-bg-success-moderate',
    IM: 'border-ax-border-warning bg-ax-meta-lime-100',
}
