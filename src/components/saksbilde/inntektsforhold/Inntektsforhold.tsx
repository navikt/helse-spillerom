'use client'

import { ReactElement, useState } from 'react'
import { Alert, BodyShort, Box, Button, Table, VStack } from '@navikt/ds-react'
import {
    TableBody,
    TableDataCell,
    TableExpandableRow,
    TableHeader,
    TableHeaderCell,
    TableRow,
} from '@navikt/ds-react/Table'
import { PlusIcon } from '@navikt/aksel-icons'
import { AnimatePresence, motion } from 'motion/react'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { useInntektsforhold } from '@hooks/queries/useInntektsforhold'
import { Inntektsforholdtype } from '@schemas/inntektsforhold'
import { InntektsforholdForm } from '@components/saksbilde/inntektsforhold/InntektsforholdForm'
import { VilkårsvurderingAccordionContent } from '@components/saksbilde/vilkårsvurdering/Vilkårsvurdering'
import { useKodeverk } from '@hooks/queries/useKodeverk'
import { useVilkaarsvurderinger } from '@hooks/queries/useVilkaarsvurderinger'

const inntektsforholdTypeToKodeverkKategori: Record<Inntektsforholdtype, string | undefined> = {
    ORDINÆRT_ARBEIDSFORHOLD: 'arbeidstakere',
    FRILANSER: 'frilanser',
    SELVSTENDIG_NÆRINGSDRIVENDE: 'selvstendig_næringsdrivende',
    ARBEIDSLEDIG: undefined,
}

export function Inntektsforhold({ value }: { value: string }): ReactElement {
    const [visOpprettForm, setVisOpprettForm] = useState(false)
    const { data: inntektsforhold, isLoading, isError } = useInntektsforhold()
    const { data: kodeverk } = useKodeverk()
    const { data: vilkaarsvurderinger } = useVilkaarsvurderinger()

    if (isLoading) return <SaksbildePanel value={value}>Laster...</SaksbildePanel>
    if (isError)
        return (
            <SaksbildePanel value={value}>
                <Alert variant="error">Kunne ikke laste inntektsforhold</Alert>
            </SaksbildePanel>
        )

    return (
        <SaksbildePanel value={value}>
            <VStack gap="6">
                <Button
                    className="w-fit"
                    variant="secondary"
                    size="small"
                    icon={<PlusIcon />}
                    onClick={() => setVisOpprettForm((prev) => !prev)}
                >
                    Legg til inntektsforhold
                </Button>
                <AnimatePresence initial={false}>
                    {visOpprettForm && (
                        <motion.div
                            key="opprett-inntektsforhold"
                            transition={{
                                type: 'tween',
                                duration: 0.2,
                                ease: 'easeInOut',
                            }}
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                        >
                            <Box
                                background="surface-selected"
                                padding="8"
                                borderRadius="medium"
                                borderColor="border-subtle"
                                borderWidth="1"
                            >
                                <InntektsforholdForm closeForm={() => setVisOpprettForm(false)} />
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>

                {inntektsforhold && inntektsforhold.length > 0 ? (
                    <Table size="medium">
                        <TableHeader>
                            <TableRow>
                                <TableHeaderCell />
                                <TableHeaderCell>Type</TableHeaderCell>
                                <TableHeaderCell>Organisasjon</TableHeaderCell>
                                <TableHeaderCell>Sykmeldt fra forholdet</TableHeaderCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inntektsforhold.map((forhold) => (
                                <TableExpandableRow
                                    key={forhold.id}
                                    expandOnRowClick
                                    content={
                                        inntektsforholdTypeToKodeverkKategori[forhold.inntektsforholdtype] && (
                                            <VilkårsvurderingAccordionContent
                                                vilkårListe={
                                                    kodeverk?.filter(
                                                        (v) =>
                                                            v.kategori ===
                                                            inntektsforholdTypeToKodeverkKategori[
                                                                forhold.inntektsforholdtype
                                                            ],
                                                    ) ?? []
                                                }
                                                vilkårsvurderinger={vilkaarsvurderinger}
                                            />
                                        )
                                    }
                                >
                                    <TableDataCell>
                                        <BodyShort>{getInntektsforholdtypeText(forhold.inntektsforholdtype)}</BodyShort>
                                    </TableDataCell>
                                    <TableDataCell>
                                        <VStack gap="1">
                                            {forhold.orgnavn && (
                                                <BodyShort weight="semibold">{forhold.orgnavn}</BodyShort>
                                            )}
                                            {forhold.orgnummer && (
                                                <BodyShort className="font-mono text-sm text-gray-600">
                                                    {forhold.orgnummer}
                                                </BodyShort>
                                            )}
                                            {!forhold.orgnummer && !forhold.orgnavn && (
                                                <BodyShort className="text-gray-500">-</BodyShort>
                                            )}
                                        </VStack>
                                    </TableDataCell>
                                    <TableDataCell>
                                        <BodyShort>{forhold.sykmeldtFraForholdet ? 'Ja' : 'Nei'}</BodyShort>
                                    </TableDataCell>
                                </TableExpandableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Alert variant="info">
                        <BodyShort>Ingen inntektsforhold registrert for denne saksbehandlingsperioden.</BodyShort>
                    </Alert>
                )}
            </VStack>
        </SaksbildePanel>
    )
}

function getInntektsforholdtypeText(type: Inntektsforholdtype): string {
    switch (type) {
        case 'ORDINÆRT_ARBEIDSFORHOLD':
            return 'Ordinært arbeidsforhold'
        case 'FRILANSER':
            return 'Frilanser'
        case 'SELVSTENDIG_NÆRINGSDRIVENDE':
            return 'Selvstendig næringsdrivende'
        case 'ARBEIDSLEDIG':
            return 'Arbeidsledig'
        default:
            return type
    }
}
