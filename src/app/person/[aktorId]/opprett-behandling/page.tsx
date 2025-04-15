'use client'

import { ReactElement, useEffect, useState } from 'react'
import {
    BodyShort,
    Button,
    Checkbox,
    DatePicker,
    Heading,
    HStack,
    Table,
    useDatepicker,
    useRangeDatepicker,
} from '@navikt/ds-react'
import { useParams, useRouter } from 'next/navigation'

import { useNyBehandling } from '@hooks/mutations/useNyBehandling'
import { useSoknader } from '@hooks/queries/useSoknader'

export default function Page(): ReactElement {
    const {
        datepickerProps,
        toInputProps,
        fromInputProps,
        selectedRange,
        setSelected: setSelectedBehandlingRange,
    } = useRangeDatepicker({
        defaultSelected: { from: undefined, to: undefined },
    })
    const {
        datepickerProps: datepickerPropsSkjaring,
        inputProps,
        selectedDay,
        setSelected: setSkjaring,
    } = useDatepicker({})
    const mutation = useNyBehandling()
    const soknader = useSoknader()
    const router = useRouter()
    const params = useParams()

    const [selectedSoknader, setSelectedSoknader] = useState<string[]>([])

    const toggleSelectedSoknad = (value: string) => {
        setSelectedSoknader((list) => (list.includes(value) ? list.filter((id) => id !== value) : [...list, value]))
    }

    useEffect(() => {
        if (selectedSoknader.length === 0) {
            setSelectedBehandlingRange({ from: undefined, to: undefined })
            return
        }
        const selectedSoknaderData = soknader.data?.filter((soknad) => selectedSoknader.includes(soknad.id)) || []
        const fom = selectedSoknaderData.map((soknad) => soknad.fom).sort()[0]
        const tom = selectedSoknaderData.map((soknad) => soknad.tom).sort()[selectedSoknaderData.length - 1]
        setSelectedBehandlingRange({ from: new Date(fom!), to: new Date(tom!) })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSoknader, soknader.data])

    useEffect(() => {
        if (selectedSoknader.length === 0) {
            setSkjaring(undefined)
            return
        }
        const selectedSoknaderData = soknader.data?.filter((soknad) => selectedSoknader.includes(soknad.id)) || []

        const relevanteDatoer = [] as string[]
        selectedSoknaderData.forEach((soknad) => {
            if (soknad.fom) {
                relevanteDatoer.push(soknad.fom)
            }
            if (soknad.startSykeforlop) {
                relevanteDatoer.push(soknad.startSykeforlop)
            }
        })
        if (relevanteDatoer.length > 0) {
            const skjaring = relevanteDatoer.sort()[relevanteDatoer.length - 1]
            setSkjaring(new Date(skjaring))
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSoknader, soknader.data])

    return (
        <div className="p-4">
            <Heading size="medium" className="mb-8">
                Ny manuell behandling
            </Heading>

            {soknader && soknader.data && (
                <div className="mb-8">
                    <Heading size="small" className="mb-4">
                        Søknader
                    </Heading>
                    <BodyShort className="mb-4">Velg søknader som skal behandles</BodyShort>
                    <Table size="small">
                        <Table.Body>
                            {soknader.data.map((soknad, i) => {
                                return (
                                    <Table.ExpandableRow
                                        key={i + soknad.id}
                                        selected={selectedSoknader.includes(soknad.id)}
                                        content={
                                            <div>
                                                Her kan det komme mer informasjon
                                                <br /> Kanskje søknaden oppsummert
                                            </div>
                                        }
                                    >
                                        <Table.DataCell>
                                            <Checkbox
                                                hideLabel
                                                checked={selectedSoknader.includes(soknad.id)}
                                                onChange={() => toggleSelectedSoknad(soknad.id)}
                                                aria-labelledby={`id-${soknad.id}`}
                                            >
                                                {' '}
                                            </Checkbox>
                                        </Table.DataCell>
                                        <Table.HeaderCell scope="row">
                                            <span id={`id-${soknad.id}`}>
                                                {`${soknad.soknadPerioder[0].grad}% - ${soknad.arbeidsgiver?.navn || soknad.arbeidssituasjon}`}
                                            </span>
                                        </Table.HeaderCell>
                                        <Table.DataCell>{soknad.fom}</Table.DataCell>
                                        <Table.DataCell>{soknad.tom}</Table.DataCell>
                                    </Table.ExpandableRow>
                                )
                            })}
                        </Table.Body>
                    </Table>
                </div>
            )}

            <div className="mb-8">
                <Heading size="small" className="mb-4">
                    Periode for manuell behandling
                </Heading>
                <DatePicker {...datepickerProps}>
                    <HStack wrap gap="4" justify="center">
                        <DatePicker.Input size="small" {...fromInputProps} label="Fra" />
                        <DatePicker.Input size="small" {...toInputProps} label="Til" />
                    </HStack>
                </DatePicker>
            </div>
            <div className="mb-8">
                <DatePicker {...datepickerPropsSkjaring}>
                    <DatePicker.Input
                        size="small"
                        {...inputProps}
                        label="Skjæringstidspunkt"
                        description="Forslaget til skjæringstidspunkt må verifiseres av saksbehandler"
                    />
                </DatePicker>
            </div>
            <div className="flex pt-4 gap-4">
                <Button
                    type="button"
                    onClick={() => {
                        const fom = selectedRange?.from?.toISOString().split('T')[0] ?? ''
                        const tom = selectedRange?.to?.toISOString().split('T')[0] ?? ''
                        const skjaring = selectedDay?.toISOString().split('T')[0] ?? ''
                        mutation.mutate({
                            callback: (behandlingId) =>
                                router.push(`/person/${params.aktorId}/behandling/${behandlingId.id}/inntektsforhold`),
                            request: { fom, tom, skjaring, soknadIder: selectedSoknader },
                        })
                    }}
                >
                    Opprett
                </Button>
                <Button type="button" variant="secondary" onClick={() => router.back()}>
                    Avbryt
                </Button>
            </div>
        </div>
    )
}
