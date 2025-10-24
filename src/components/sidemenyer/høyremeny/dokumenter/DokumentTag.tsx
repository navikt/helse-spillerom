import { ComponentPropsWithoutRef, ComponentType, ReactElement } from 'react'
import { Tag, TagProps } from '@navikt/ds-react'

import { Dokumenttype } from '@schemas/dokument'
import { cn } from '@utils/tw'

interface DokumentTagProps {
    type: Dokumenttype
}

export function DokumentTag({ type }: DokumentTagProps): ReactElement {
    const TagComponent = dokumentTag[type]
    return <TagComponent />
}

const dokumentTag: Record<Dokumenttype, ComponentType> = {
    søknad: SøknadTag,
    inntektsmelding: InntektsmeldingTag,
    INNTEKTSMELDING: InntektsmeldingTag,
    SYKMELDING: SykmeldingTag,
    AAREG: AaregTag,
    ainntekt828: () => <ExtendedTag variant="neutral">8-28</ExtendedTag>,
    ainntekt830: () => <ExtendedTag variant="neutral">8-30</ExtendedTag>,
    arbeidsforhold: () => <ExtendedTag variant="neutral">AF</ExtendedTag>,
    pensjonsgivendeinntekt: () => <ExtendedTag variant="neutral">PI</ExtendedTag>,
}

function SøknadTag(): ReactElement {
    return <ExtendedTag variant="alt1">SØ</ExtendedTag>
}

function InntektsmeldingTag(): ReactElement {
    return (
        <ExtendedTag variant="warning" className="bg-limegreen-100">
            IM
        </ExtendedTag>
    )
}

function SykmeldingTag(): ReactElement {
    return <ExtendedTag variant="info">SM</ExtendedTag>
}

function AaregTag(): ReactElement {
    return <ExtendedTag variant="neutral">AA</ExtendedTag>
}

interface ExtendedTagProps extends ComponentPropsWithoutRef<'div'> {
    variant: TagProps['variant']
}

function ExtendedTag({ variant, children, className }: ExtendedTagProps): ReactElement {
    return (
        <Tag variant={variant} className={cn('text-small mt-[2px] h-5 min-h-5 w-6 rounded-sm leading-0', className)}>
            {children}
        </Tag>
    )
}
