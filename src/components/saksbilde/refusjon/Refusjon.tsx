import React, { ReactElement, useState, useEffect, useMemo } from 'react'
import { useForm, useFieldArray, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { BoxNew, Button, HStack, Skeleton, Table, VStack } from '@navikt/ds-react'
import dayjs from 'dayjs'

import { useYrkesaktivitet } from '@hooks/queries/useYrkesaktivitet'
import { getInntektsforholdDisplayText } from '@components/saksbilde/yrkesaktivitet/yrkesaktivitetVisningTekst'
import { Yrkesaktivitet } from '@schemas/yrkesaktivitet'
import { useOppdaterRefusjon } from '@hooks/mutations/useOppdaterRefusjon'
import { refusjonInfoSchema } from '@schemas/inntektRequest'
import { DateField } from '@components/saksbilde/sykepengegrunnlag/form/DateField'
import { PengerField } from '@components/saksbilde/sykepengegrunnlag/form/PengerField'
import { cn } from '@utils/tw'
import { getFormattedDateString } from '@utils/date-format'
import { useAktivSaksbehandlingsperiode } from '@hooks/queries/useAktivSaksbehandlingsperiode'

const refusjonFormSchema = z.object({
    refusjon: z.array(refusjonInfoSchema),
})

type RefusjonFormData = z.infer<typeof refusjonFormSchema>

function RefusjonRad({ ya }: { ya: Yrkesaktivitet }) {
    const [edit, setEdit] = useState(false)
    const { mutate: oppdaterRefusjon, isPending: oppdaterIsPending } = useOppdaterRefusjon()
    const aktivSaksbehandlingsperiode = useAktivSaksbehandlingsperiode()

    const erArbeidstaker = ya.kategorisering.inntektskategori === 'ARBEIDSTAKER'

    const defaultFom = useMemo(() => {
        if (!aktivSaksbehandlingsperiode?.fom) return undefined
        return dayjs(aktivSaksbehandlingsperiode.fom).toDate()
    }, [aktivSaksbehandlingsperiode?.fom])

    const methods = useForm<RefusjonFormData>({
        resolver: zodResolver(refusjonFormSchema),
        defaultValues: {
            refusjon: ya.refusjon || [],
        },
    })

    const { control, handleSubmit, reset } = methods

    // Oppdater form når yrkesaktivitet data endres
    useEffect(() => {
        if (!edit) {
            reset({ refusjon: ya.refusjon || [] })
        }
    }, [ya.refusjon, edit, reset])

    const refusjonFieldArray = useFieldArray<RefusjonFormData>({
        control,
        name: 'refusjon',
    })

    const onSubmit = (data: RefusjonFormData) => {
        // Filtrer bort tomme perioder og konverter til null hvis arrayet er tomt
        const filtrertRefusjon = data.refusjon.filter((ref) => ref.fom && ref.beløp > 0)
        const refusjonData = filtrertRefusjon.length > 0 ? filtrertRefusjon : null
        oppdaterRefusjon(
            { yrkesaktivitetId: ya.id, refusjon: refusjonData },
            {
                onSuccess: () => {
                    setEdit(false)
                },
            },
        )
    }

    const handleAvbryt = () => {
        reset({ refusjon: ya.refusjon || [] })
        setEdit(false)
    }

    const handleFjernRefusjon = () => {
        oppdaterRefusjon(
            { yrkesaktivitetId: ya.id, refusjon: null },
            {
                onSuccess: () => {
                    setEdit(false)
                },
            },
        )
    }

    if (!erArbeidstaker) {
        return null
    }

    return (
        <Table.Row>
            <Table.DataCell>{getInntektsforholdDisplayText(ya.kategorisering)}</Table.DataCell>
            <Table.DataCell>
                {edit ? (
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <VStack gap="4">
                                {refusjonFieldArray.fields.map((field, index) => (
                                    <HStack key={field.id} gap="2" align="start" wrap={false}>
                                        <DateField
                                            name={`refusjon.${index}.fom`}
                                            label="F.o.m. dato"
                                            defaultSelected={defaultFom}
                                        />
                                        <DateField name={`refusjon.${index}.tom`} label="T.o.m. dato" />
                                        <PengerField
                                            className="max-w-28"
                                            name={`refusjon.${index}.beløp`}
                                            label="Refusjonsbeløp"
                                        />
                                        <Button
                                            className={cn('mb-1 self-end', { invisible: index === 0 })}
                                            size="xsmall"
                                            variant="tertiary"
                                            type="button"
                                            onClick={() => refusjonFieldArray.remove(index)}
                                        >
                                            Slett
                                        </Button>
                                    </HStack>
                                ))}
                                <HStack gap="2">
                                    <Button
                                        size="xsmall"
                                        variant="tertiary"
                                        type="button"
                                        onClick={() => refusjonFieldArray.append({ fom: '', tom: null, beløp: 0 })}
                                    >
                                        + Legg til
                                    </Button>
                                    <Button size="small" type="submit" disabled={oppdaterIsPending}>
                                        Lagre
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="small"
                                        type="button"
                                        onClick={handleAvbryt}
                                        disabled={oppdaterIsPending}
                                    >
                                        Avbryt
                                    </Button>
                                    {ya.refusjon && ya.refusjon.length > 0 && (
                                        <Button
                                            variant="danger"
                                            size="small"
                                            type="button"
                                            onClick={handleFjernRefusjon}
                                            disabled={oppdaterIsPending}
                                        >
                                            Fjern refusjon
                                        </Button>
                                    )}
                                </HStack>
                            </VStack>
                        </form>
                    </FormProvider>
                ) : (
                    <div>
                        {ya.refusjon && ya.refusjon.length > 0 ? (
                            <VStack gap="2">
                                {ya.refusjon.map((ref, index) => (
                                    <div key={index} className="text-sm">
                                        {getFormattedDateString(ref.fom)} -{' '}
                                        {ref.tom ? getFormattedDateString(ref.tom) : 'åpen'} :{' '}
                                        {ref.beløp.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}
                                    </div>
                                ))}
                            </VStack>
                        ) : (
                            <span className="text-gray-500">Ingen refusjon satt</span>
                        )}
                    </div>
                )}
                {oppdaterIsPending && <Skeleton width={100} />}
            </Table.DataCell>
            <Table.DataCell>
                {!edit && (
                    <HStack gap="2">
                        <Button size="small" variant="secondary" onClick={() => setEdit(true)}>
                            Rediger
                        </Button>
                        {ya.refusjon && ya.refusjon.length > 0 && (
                            <Button
                                size="small"
                                variant="danger"
                                onClick={handleFjernRefusjon}
                                disabled={oppdaterIsPending}
                            >
                                Fjern refusjon
                            </Button>
                        )}
                    </HStack>
                )}
            </Table.DataCell>
        </Table.Row>
    )
}

export function Refusjon(): ReactElement {
    const { data, isLoading } = useYrkesaktivitet()

    if (!data || isLoading) {
        return (
            <BoxNew padding="0">
                <Skeleton width="100%" height={200} />
            </BoxNew>
        )
    }

    const arbeidstakere = data.filter((ya) => ya.kategorisering.inntektskategori === 'ARBEIDSTAKER')

    if (arbeidstakere.length === 0) {
        return (
            <BoxNew padding="4">
                <p>Ingen arbeidstakere funnet. Refusjon kan kun settes for arbeidstakere.</p>
            </BoxNew>
        )
    }

    return (
        <Table size="small">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Yrkesaktivitet</Table.HeaderCell>
                    <Table.HeaderCell>Refusjon</Table.HeaderCell>
                    <Table.HeaderCell className="w-48">-</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {arbeidstakere.map((ya) => (
                    <RefusjonRad key={ya.id} ya={ya} />
                ))}
            </Table.Body>
        </Table>
    )
}
