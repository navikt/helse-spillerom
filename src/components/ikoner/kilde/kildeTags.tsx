import React, { ComponentPropsWithoutRef, ReactElement } from 'react'
import { PersonPencilFillIcon } from '@navikt/aksel-icons'

import { ArbeidstakerInntektType } from '@schemas/inntektRequest'
import { cn } from '@utils/tw'
import { Dokumenttype } from '@schemas/dokument'
import { Kilde } from '@schemas/dagoversikt'

export const DagoversiktKildeTag: Record<Kilde, ReactElement> = {
    Søknad: <SøknadKildeTag />,
    Saksbehandler: <SaksbehandlerKildeTag />,
}

export const InntektTag: Record<ArbeidstakerInntektType, ReactElement> = {
    DEFAULT: <></>,
    INNTEKTSMELDING: <InntektsmeldingKildeTag />,
    AINNTEKT: <AOrdningenKildeTag />,
    SKJONNSFASTSETTELSE: <SaksbehandlerKildeTag />,
}

export const DokumentTag: Record<Dokumenttype, ReactElement> = {
    søknad: <SøknadKildeTag />,
    inntektsmelding: <InntektsmeldingKildeTag />,
    INNTEKTSMELDING: <InntektsmeldingKildeTag />,
    SYKMELDING: <SykmeldingKildeTag />,
    AAREG: <AARegKildeTag />,
    ainntekt828: <AOrdningenKildeTag />,
    ainntekt830: <AOrdningenKildeTag />,
    arbeidsforhold: <ArbeidsforholdKildeTag />,
    pensjonsgivendeinntekt: <PensjonsgivendeInntektKildeTag />,
}

export function AOrdningenKildeTag(): ReactElement {
    return <KildeTag>AO</KildeTag>
}

export function AARegKildeTag(): ReactElement {
    return <KildeTag>AA</KildeTag>
}

export function SøknadKildeTag(): ReactElement {
    return <KildeTag>SØ</KildeTag>
}

export function SykmeldingKildeTag(): ReactElement {
    return <KildeTag>SM</KildeTag>
}

export function InntektsmeldingKildeTag(): ReactElement {
    return <KildeTag>IM</KildeTag>
}

export function PensjonsgivendeInntektKildeTag(): ReactElement {
    return <KildeTag>PI</KildeTag>
}

export function ArbeidsforholdKildeTag(): ReactElement {
    return <KildeTag>AF</KildeTag>
}

export function SaksbehandlerKildeTag(): ReactElement {
    return (
        <KildeTag>
            <PersonPencilFillIcon aria-label="Saksbehandler" />
        </KildeTag>
    )
}

function KildeTag({ children, ...rest }: ComponentPropsWithoutRef<'div'>): ReactElement {
    const isString = typeof children === 'string'
    const styleKey = isString ? children : undefined

    return (
        <div
            className={cn(
                'flex h-4 w-5 items-center justify-center rounded-sm border text-ax-small leading-none',
                styleKey && stylesMap[styleKey]
                    ? stylesMap[styleKey]
                    : 'border-ax-border-neutral-strong bg-ax-bg-neutral-moderate',
            )}
            {...rest}
        >
            {isString ? (
                <span className="translate-x-[0.5px] translate-y-[0.5px] transform text-xs">{children}</span>
            ) : (
                children
            )}
        </div>
    )
}

const stylesMap: Record<string, string> = {
    AO: 'border-ax-border-success bg-ax-bg-success-moderate',
    IM: 'border-ax-border-warning bg-ax-meta-lime-100',
    SØ: 'border-ax-border-meta-purple bg-ax-bg-meta-purple-moderate',
    PI: 'border-ax-border-neutral-strong bg-ax-bg-neutral-moderate',
}
