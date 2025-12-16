import { Fragment, ReactElement } from 'react'
import { BodyShort, HStack, Link, Tooltip } from '@navikt/ds-react'

import { Kodeverk, Årsak } from '@schemas/kodeverkV2'
import { formatParagraf, getLovdataUrl } from '@utils/paragraf-formatering'

interface AvslåttBegrunnelserProps {
    avslåttBegrunnelse: string[]
    kodeverk: Kodeverk
}

export function AvslåttBegrunnelser({ avslåttBegrunnelse, kodeverk }: AvslåttBegrunnelserProps): ReactElement | null {
    if (!avslåttBegrunnelse?.length || !kodeverk) return null

    const begrunnelser = avslåttBegrunnelse
        .map((kode) => finnBegrunnelse(kode, kodeverk))
        .filter(Boolean) as Begrunnelse[]

    if (begrunnelser.length === 0) return null

    return (
        <HStack gap="1" wrap={false}>
            {begrunnelser.map((begrunnelse, index) => (
                <Fragment key={`${begrunnelse.paragraf}-${index}`}>
                    <Tooltip content={begrunnelse.beskrivelse}>
                        {begrunnelse.lovdataUrl ? (
                            <Link href={begrunnelse.lovdataUrl} target="_blank" rel="noopener noreferrer">
                                <BodyShort size="small">{begrunnelse.paragraf}</BodyShort>
                            </Link>
                        ) : (
                            <BodyShort size="small">{begrunnelse.paragraf}</BodyShort>
                        )}
                    </Tooltip>
                    {index < begrunnelser.length - 1 && <span>, </span>}
                </Fragment>
            ))}
        </HStack>
    )
}

interface Begrunnelse {
    paragraf: string
    beskrivelse: string
    lovdataUrl?: string
}

function finnBegrunnelse(kode: string, kodeverk: Kodeverk): Begrunnelse | null {
    const årsak = kodeverk.flatMap((vilkår) => vilkår.ikkeOppfylt).find((årsak: Årsak) => årsak.kode === kode)
    if (!årsak) return null

    return {
        paragraf: årsak.vilkårshjemmel ? formatParagraf(årsak.vilkårshjemmel) : kode,
        beskrivelse: årsak.beskrivelse,
        lovdataUrl: årsak.vilkårshjemmel ? getLovdataUrl(årsak.vilkårshjemmel) : undefined,
    }
}
