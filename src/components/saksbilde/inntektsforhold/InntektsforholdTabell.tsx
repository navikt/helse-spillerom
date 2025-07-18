'use client'

import { ReactElement, useState } from 'react'
import { Alert, BodyShort, Box, Button, Table, VStack, HStack } from '@navikt/ds-react'
import { Modal } from '@navikt/ds-react'
import {
    TableBody,
    TableDataCell,
    TableExpandableRow,
    TableHeader,
    TableHeaderCell,
    TableRow,
} from '@navikt/ds-react/Table'
import { PlusIcon, PencilIcon, TrashIcon } from '@navikt/aksel-icons'
import { motion } from 'motion/react'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { useInntektsforhold } from '@hooks/queries/useInntektsforhold'
import { useSlettInntektsforhold } from '@hooks/mutations/useSlettInntektsforhold'
import InntektsforholdForm from '@components/saksbilde/inntektsforhold/InntektsforholdForm'
import { useOppdaterInntektsforholdKategorisering } from '@hooks/mutations/useOppdaterInntektsforhold'
import { inntektsforholdKodeverk } from '@components/saksbilde/inntektsforhold/inntektsforholdKodeverk'
import { AnimatePresenceWrapper } from '@components/AnimatePresenceWrapper'
import { getTestSafeTransition } from '@utils/tsUtils'
import { Organisasjonsnavn } from '@components/organisasjon/Organisasjonsnavn'
import { useKanSaksbehandles } from '@hooks/queries/useKanSaksbehandles'

export function InntektsforholdTabell({ value }: { value: string }): ReactElement {
    const [visOpprettForm, setVisOpprettForm] = useState(false)
    const [slettModalOpen, setSlettModalOpen] = useState(false)
    const [inntektsforholdTilSlett, setInntektsforholdTilSlett] = useState<string | null>(null)
    const [redigererId, setRedigererId] = useState<string | null>(null)
    const { data: inntektsforhold, isLoading, isError } = useInntektsforhold()
    const slettMutation = useSlettInntektsforhold()
    const oppdaterMutation = useOppdaterInntektsforholdKategorisering()
    const kanSaksbehandles = useKanSaksbehandles()

    if (isLoading) return <SaksbildePanel value={value}>Laster...</SaksbildePanel>
    if (isError)
        return (
            <SaksbildePanel value={value}>
                <Alert variant="error">Kunne ikke laste inntektsforhold</Alert>
            </SaksbildePanel>
        )

    // Sjekk om det finnes inntektsforhold som ikke kan kombineres med andre
    const inntektsforholdSomIkkeKanKombineres =
        inntektsforhold?.filter((forhold) => {
            const kategori = forhold.kategorisering['INNTEKTSKATEGORI'] as string
            const alternativ = inntektsforholdKodeverk.alternativer.find((alt) => alt.kode === kategori)
            return alternativ?.kanIkkeKombineresMedAndre === true
        }) || []

    // Vis advarsel hvis det finnes inntektsforhold som ikke kan kombineres og det er flere enn ett inntektsforhold totalt
    const showKombinasjonsAdvarsel =
        inntektsforholdSomIkkeKanKombineres.length > 0 && (inntektsforhold?.length || 0) > 1

    const handleSlett = (inntektsforholdId: string) => {
        setInntektsforholdTilSlett(inntektsforholdId)
        setSlettModalOpen(true)
    }

    const confirmSlett = () => {
        if (inntektsforholdTilSlett) {
            slettMutation.mutate({ inntektsforholdId: inntektsforholdTilSlett })
            setSlettModalOpen(false)
            setInntektsforholdTilSlett(null)
        }
    }

    const cancelSlett = () => {
        setSlettModalOpen(false)
        setInntektsforholdTilSlett(null)
    }

    const handleRediger = (id: string) => {
        setRedigererId(id)
    }

    const handleAvbrytRedigering = () => {
        setRedigererId(null)
    }

    const handleLagreRedigering = (inntektsforholdId: string, kategorisering: Record<string, string | string[]>) => {
        oppdaterMutation.mutate({ inntektsforholdId, kategorisering }, { onSuccess: () => setRedigererId(null) })
    }

    return (
        <SaksbildePanel value={value}>
            <VStack gap="6">
                {showKombinasjonsAdvarsel && (
                    <Alert variant="warning">
                        <BodyShort>
                            {inntektsforholdSomIkkeKanKombineres
                                .map((forhold) => {
                                    const kategori = forhold.kategorisering['INNTEKTSKATEGORI'] as string
                                    const alternativ = inntektsforholdKodeverk.alternativer.find(
                                        (alt) => alt.kode === kategori,
                                    )
                                    return alternativ?.navn
                                })
                                .join(', ')}{' '}
                            kan ikke kombineres med andre inntektsforhold. Vurder å fjerne andre inntektsforhold eller
                            endre kategoriseringen.
                        </BodyShort>
                    </Alert>
                )}

                {inntektsforhold && inntektsforhold.length > 0 ? (
                    <div role="region" aria-label="Inntektsforhold tabell">
                        <Table size="medium" aria-label="Inntektsforhold oversikt">
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderCell className="ignore-axe" />
                                    <TableHeaderCell scope="col">Inntektsforhold</TableHeaderCell>
                                    <TableHeaderCell scope="col">Organisasjon</TableHeaderCell>
                                    <TableHeaderCell scope="col">Sykmeldt</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inntektsforhold.map((forhold, index) => (
                                    <TableExpandableRow
                                        key={forhold.id}
                                        expandOnRowClick
                                        content={
                                            redigererId === forhold.id ? (
                                                <InntektsforholdForm
                                                    closeForm={handleAvbrytRedigering}
                                                    disabled={false}
                                                    initialValues={forhold.kategorisering}
                                                    onSubmit={(kategorisering) =>
                                                        handleLagreRedigering(forhold.id, kategorisering)
                                                    }
                                                    isLoading={oppdaterMutation.isPending}
                                                    avbrytLabel="Avbryt"
                                                    lagreLabel="Lagre"
                                                />
                                            ) : (
                                                <VStack gap="4" className="ignore-axe">
                                                    <InntektsforholdForm
                                                        closeForm={() => {}}
                                                        disabled={true}
                                                        title={undefined}
                                                        initialValues={forhold.kategorisering}
                                                    />
                                                    {kanSaksbehandles && (
                                                        <HStack gap="2">
                                                            <Button
                                                                variant="tertiary"
                                                                size="small"
                                                                icon={<PencilIcon aria-hidden />}
                                                                onClick={() => handleRediger(forhold.id)}
                                                                disabled={
                                                                    redigererId !== null && redigererId !== forhold.id
                                                                }
                                                                aria-label={`Rediger inntektsforhold ${index + 1}`}
                                                            >
                                                                Rediger
                                                            </Button>
                                                            <Button
                                                                className="text-text-danger"
                                                                variant="tertiary"
                                                                size="small"
                                                                icon={<TrashIcon aria-hidden />}
                                                                onClick={() => handleSlett(forhold.id)}
                                                                disabled={slettMutation.isPending}
                                                                aria-label={`Slett inntektsforhold ${index + 1}`}
                                                            >
                                                                Slett
                                                            </Button>
                                                        </HStack>
                                                    )}
                                                </VStack>
                                            )
                                        }
                                    >
                                        <TableDataCell>
                                            <BodyShort>
                                                {getInntektsforholdDisplayText(forhold.kategorisering)}
                                            </BodyShort>
                                        </TableDataCell>
                                        <TableDataCell>
                                            <VStack gap="1">
                                                {forhold.kategorisering['ORGNUMMER'] && (
                                                    <BodyShort className="text-sm">
                                                        <Organisasjonsnavn
                                                            orgnummer={forhold.kategorisering['ORGNUMMER'] as string}
                                                        />
                                                    </BodyShort>
                                                )}
                                            </VStack>
                                        </TableDataCell>
                                        <TableDataCell>
                                            <BodyShort>
                                                {forhold.kategorisering['ER_SYKMELDT'] === 'ER_SYKMELDT_JA'
                                                    ? 'Ja'
                                                    : 'Nei'}
                                            </BodyShort>
                                        </TableDataCell>
                                    </TableExpandableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <Alert variant="info">
                        <BodyShort>Ingen inntektsforhold registrert for denne saksbehandlingsperioden.</BodyShort>
                    </Alert>
                )}
                {!visOpprettForm && kanSaksbehandles && (
                    <Button
                        className="w-fit"
                        variant="tertiary"
                        size="small"
                        icon={<PlusIcon aria-hidden />}
                        onClick={() => setVisOpprettForm((prev) => !prev)}
                        aria-label="Legg til nytt inntektsforhold"
                    >
                        Legg til inntektsforhold
                    </Button>
                )}
                <AnimatePresenceWrapper initial={false}>
                    {visOpprettForm && (
                        <motion.div
                            key="opprett-inntektsforhold"
                            transition={getTestSafeTransition({
                                type: 'tween',
                                duration: 0.2,
                                ease: 'easeInOut',
                            })}
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                        >
                            <Box.New
                                background="accent-soft"
                                borderColor="neutral-subtle"
                                borderWidth="1"
                                borderRadius="medium"
                                className="rounded-md p-8"
                            >
                                <InntektsforholdForm
                                    closeForm={() => setVisOpprettForm(false)}
                                    title="Legg til nytt inntektsforhold"
                                />
                            </Box.New>
                        </motion.div>
                    )}
                </AnimatePresenceWrapper>
            </VStack>

            <Modal
                open={slettModalOpen}
                onClose={cancelSlett}
                header={{
                    heading: 'Slett inntektsforhold',
                }}
            >
                <Modal.Body>
                    <BodyShort>
                        Er du sikker på at du vil slette dette inntektsforholdet? Denne handlingen kan ikke angres.
                    </BodyShort>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={confirmSlett} loading={slettMutation.isPending}>
                        Slett
                    </Button>
                    <Button variant="secondary" onClick={cancelSlett} disabled={slettMutation.isPending}>
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
        </SaksbildePanel>
    )
}

function getInntektsforholdDisplayText(kategorisering: Record<string, string | string[]>): string {
    const inntektskategori = kategorisering['INNTEKTSKATEGORI'] as string

    if (!inntektskategori) {
        return 'Ukjent'
    }

    const alternativ = inntektsforholdKodeverk.alternativer.find((alt) => alt.kode === inntektskategori)
    return alternativ?.navn || inntektskategori
}
