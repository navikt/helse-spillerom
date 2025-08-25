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

import { useOppdaterYrkesaktivitetKategorisering } from '@hooks/mutations/useOppdaterYrkesaktivitet'
import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { useYrkesaktivitet } from '@hooks/queries/useYrkesaktivitet'
import { useSlettYrkesaktivitet } from '@hooks/mutations/useSlettYrkesaktivitet'
import YrkesaktivitetForm from '@components/saksbilde/yrkesaktivitet/YrkesaktivitetForm'
import { yrkesaktivitetKodeverk } from '@components/saksbilde/yrkesaktivitet/YrkesaktivitetKodeverk'
import { AnimatePresenceWrapper } from '@components/AnimatePresenceWrapper'
import { getTestSafeTransition } from '@utils/tsUtils'
import { Organisasjonsnavn } from '@components/organisasjon/Organisasjonsnavn'
import { useKanSaksbehandles } from '@hooks/queries/useKanSaksbehandles'
import { useSykepengegrunnlag } from '@hooks/queries/useSykepengegrunnlag'
import { useBekreftelsesModal } from '@hooks/useBekreftelsesModal'
import { BekreftelsesModal } from '@components/BekreftelsesModal'

export function YrkesaktivitetTabell({ value }: { value: string }): ReactElement {
    const [visOpprettForm, setVisOpprettForm] = useState(false)
    const [slettModalOpen, setSlettModalOpen] = useState(false)
    const [yrkesaktivitetTilSlett, setInntektsforholdTilSlett] = useState<string | null>(null)
    const [redigererId, setRedigererId] = useState<string | null>(null)
    const { data: yrkesaktivitet, isLoading, isError } = useYrkesaktivitet()
    const { data: sykepengegrunnlag } = useSykepengegrunnlag()
    const slettMutation = useSlettYrkesaktivitet()
    const oppdaterMutation = useOppdaterYrkesaktivitetKategorisering()
    const kanSaksbehandles = useKanSaksbehandles()
    const {
        isOpen: bekreftelsesModalOpen,
        modalProps,
        visBekreftelsesmodal,
        handleBekreft,
        handleAvbryt,
    } = useBekreftelsesModal()

    if (isLoading) return <SaksbildePanel value={value}>Laster...</SaksbildePanel>
    if (isError)
        return (
            <SaksbildePanel value={value}>
                <Alert variant="error">Kunne ikke laste yrkesaktivitet</Alert>
            </SaksbildePanel>
        )

    // Sjekk om det finnes yrkesaktivitet som ikke kan kombineres med andre
    const yrkesaktivitetSomIkkeKanKombineres =
        yrkesaktivitet?.filter((forhold) => {
            const kategori = forhold.kategorisering['INNTEKTSKATEGORI'] as string
            const alternativ = yrkesaktivitetKodeverk.alternativer.find((alt) => alt.kode === kategori)
            return alternativ?.kanIkkeKombineresMedAndre === true
        }) || []

    // Vis advarsel hvis det finnes yrkesaktivitet som ikke kan kombineres og det er flere enn ett yrkesaktivitet totalt
    const showKombinasjonsAdvarsel = yrkesaktivitetSomIkkeKanKombineres.length > 0 && (yrkesaktivitet?.length || 0) > 1

    const handleSlett = async (yrkesaktivitetId: string) => {
        // Sjekk om sykepengegrunnlag eksisterer
        if (sykepengegrunnlag) {
            const bekreftet = await visBekreftelsesmodal({
                tittel: 'Slette yrkesaktivitet',
                melding:
                    'Dette vil føre til at sykepengegrunnlaget slettes og må registreres på nytt. Er du sikker på at du vil fortsette?',
            })

            if (!bekreftet) return
        }

        setInntektsforholdTilSlett(yrkesaktivitetId)
        setSlettModalOpen(true)
    }

    const confirmSlett = () => {
        if (yrkesaktivitetTilSlett) {
            slettMutation.mutate({ yrkesaktivitetId: yrkesaktivitetTilSlett })
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

    const handleLagreRedigering = async (
        yrkesaktivitetId: string,
        kategorisering: Record<string, string | string[]>,
    ) => {
        // Sjekk om sykepengegrunnlag eksisterer
        if (sykepengegrunnlag) {
            const bekreftet = await visBekreftelsesmodal({
                tittel: 'Redigere yrkesaktivitet',
                melding:
                    'Dette vil føre til at sykepengegrunnlaget slettes og må registreres på nytt. Er du sikker på at du vil fortsette?',
            })

            if (!bekreftet) return
        }

        oppdaterMutation.mutate({ yrkesaktivitetId, kategorisering }, { onSuccess: () => setRedigererId(null) })
    }

    const handleLeggTilYrkesaktivitet = async () => {
        // Sjekk om sykepengegrunnlag eksisterer
        if (sykepengegrunnlag) {
            const bekreftet = await visBekreftelsesmodal({
                tittel: 'Legg til yrkesaktivitet',
                melding:
                    'Dette vil føre til at sykepengegrunnlaget slettes og må registreres på nytt. Er du sikker på at du vil fortsette?',
            })

            if (!bekreftet) return
        }

        setVisOpprettForm(true)
    }

    return (
        <SaksbildePanel value={value}>
            <VStack gap="6">
                {showKombinasjonsAdvarsel && (
                    <Alert variant="warning">
                        <BodyShort>
                            {yrkesaktivitetSomIkkeKanKombineres
                                .map((forhold) => {
                                    const kategori = forhold.kategorisering['INNTEKTSKATEGORI'] as string
                                    const alternativ = yrkesaktivitetKodeverk.alternativer.find(
                                        (alt) => alt.kode === kategori,
                                    )
                                    return alternativ?.navn
                                })
                                .join(', ')}{' '}
                            kan ikke kombineres med andre yrkesaktiviteter. Vurder å fjerne andre yrkesaktiviteter eller
                            endre kategoriseringen.
                        </BodyShort>
                    </Alert>
                )}

                {yrkesaktivitet && yrkesaktivitet.length > 0 ? (
                    <div role="region" aria-label="Yrkesaktivitet tabell">
                        <Table size="medium" aria-label="Yrkesaktivitet oversikt">
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderCell className="ignore-axe" />
                                    <TableHeaderCell scope="col">Yrkesaktivitet</TableHeaderCell>
                                    <TableHeaderCell scope="col">Organisasjon</TableHeaderCell>
                                    <TableHeaderCell scope="col">Sykmeldt</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {yrkesaktivitet.map((forhold, index) => (
                                    <TableExpandableRow
                                        key={forhold.id}
                                        expandOnRowClick
                                        content={
                                            redigererId === forhold.id ? (
                                                <YrkesaktivitetForm
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
                                                    <YrkesaktivitetForm
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
                                                                aria-label={`Rediger yrkesaktivitet ${index + 1}`}
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
                                                                aria-label={`Slett yrkesaktivitet ${index + 1}`}
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
                        <BodyShort>Ingen yrkesaktivitet registrert for denne saksbehandlingsperioden.</BodyShort>
                    </Alert>
                )}
                {!visOpprettForm && kanSaksbehandles && (
                    <Button
                        className="w-fit"
                        variant="tertiary"
                        size="small"
                        icon={<PlusIcon aria-hidden />}
                        onClick={handleLeggTilYrkesaktivitet}
                        aria-label="Legg til ny yrkesaktivitet"
                    >
                        Legg til yrkesaktivitet
                    </Button>
                )}
                <AnimatePresenceWrapper initial={false}>
                    {visOpprettForm && (
                        <motion.div
                            key="opprett-yrkesaktivitet"
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
                                <YrkesaktivitetForm
                                    closeForm={() => setVisOpprettForm(false)}
                                    title="Legg til ny yrkesaktivitet"
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
                    heading: 'Slett yrkesaktivitet',
                }}
            >
                <Modal.Body>
                    <BodyShort>
                        Er du sikker på at du vil slette denne yrkesaktiviteten? Denne handlingen kan ikke angres.
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

            <BekreftelsesModal
                isOpen={bekreftelsesModalOpen}
                tittel={modalProps?.tittel || ''}
                melding={modalProps?.melding || ''}
                onBekreft={handleBekreft}
                onAvbryt={handleAvbryt}
            />
        </SaksbildePanel>
    )
}

function getInntektsforholdDisplayText(kategorisering: Record<string, string | string[]>): string {
    const inntektskategori = kategorisering['INNTEKTSKATEGORI'] as string

    if (!inntektskategori) {
        return 'Ukjent'
    }

    const alternativ = yrkesaktivitetKodeverk.alternativer.find((alt) => alt.kode === inntektskategori)
    return alternativ?.navn || inntektskategori
}
