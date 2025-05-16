'use client'

import { ReactElement, useState } from 'react'
import { Button, Checkbox, CheckboxGroup, DatePicker, Label, useDatepicker } from '@navikt/ds-react'
import dayjs from 'dayjs'
import { useParams, useRouter } from 'next/navigation'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { useSoknader } from '@hooks/queries/useSoknader'
import { Søknad } from '@/schemas/søknad'
import { getFormattedDateString } from '@utils/date-format'
import { useOpprettSaksbehandlingsperiode } from '@hooks/mutations/useOpprettSaksbehandlingsperiode'

interface StartBehandlingProps {
    value: string
}

export function StartBehandling({ value }: StartBehandlingProps): ReactElement {
    const router = useRouter()
    const params = useParams()

    const [validFromDate, setValidFromDate] = useState(dayjs().subtract(3, 'month').startOf('month'))
    const [selectedSøknader, setSelectedSøknader] = useState<string[]>([])
    const { data: søknader, isError } = useSoknader(validFromDate)
    const { mutate: opprettSaksbehandlingsperiode } = useOpprettSaksbehandlingsperiode()

    const [errorTekst, setErrorTekst] = useState<string | undefined>(undefined)

    const { datepickerProps, inputProps } = useDatepicker({
        onDateChange: (d) => {
            const parsedDate = dayjs(d)
            if (parsedDate.isValid()) {
                setValidFromDate(parsedDate)
            }
        },
        defaultSelected: validFromDate.toDate(),
    })

    if (isError) return <></> // vis noe fornuftig

    const søknaderGruppert = søknader?.reduce((acc: Record<string, Søknad[]>, soknad) => {
        const key = soknad.arbeidsgiver?.navn || soknad.arbeidssituasjon || soknad.type

        acc[key] = acc[key] || []
        acc[key].push(soknad)
        return acc
    }, {})

    const handleSubmit = () => {
        setErrorTekst(undefined)
        if (selectedSøknader.length === 0) {
            setErrorTekst('Ingen søknader valgt')
            return
        }

        const valgteSøknader = søknader?.filter((s) => selectedSøknader.includes(s.id)) || []
        if (valgteSøknader.length === 0) return

        const minFom = valgteSøknader.reduce((min, søknad) => {
            if (!søknad.fom) return min
            return !min || dayjs(søknad.fom).isBefore(dayjs(min)) ? søknad.fom : min
        }, '')

        const maxTom = valgteSøknader.reduce((max, søknad) => {
            if (!søknad.tom) return max
            return !max || dayjs(søknad.tom).isAfter(dayjs(max)) ? søknad.tom : max
        }, '')

        if (!minFom || !maxTom) return

        opprettSaksbehandlingsperiode(
            {
                request: {
                    fom: minFom,
                    tom: maxTom,
                },
                callback: (periode) => {
                    router.push(`/person/${params.personId}/${periode.id}`)
                },
            },
            {
                onSuccess: () => {
                    // Navigasjon skjer i callback
                },
            },
        )
    }

    return (
        <SaksbildePanel value={value}>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmit()
                }}
            >
                <div className="mb-8">
                    <DatePicker {...datepickerProps}>
                        <DatePicker.Input {...inputProps} label="Hent alle søknader etter" />
                    </DatePicker>
                </div>
                <Label spacing>Velg hvilken søknad som skal behandles</Label>
                {søknader?.length === 0 && <div>Ingen søknader etter valgt dato</div>}
                {søknaderGruppert &&
                    Object.entries(søknaderGruppert).map(([key, gruppe]) => (
                        <div key={key} className="mt-4">
                            <CheckboxGroup legend={key} error={errorTekst}>
                                {gruppe.map((søknad, j) => (
                                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Checkbox
                                            value={søknad.id}
                                            checked={selectedSøknader.includes(søknad.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedSøknader([...selectedSøknader, søknad.id])
                                                } else {
                                                    setSelectedSøknader(
                                                        selectedSøknader.filter((id) => id !== søknad.id),
                                                    )
                                                }
                                            }}
                                        >
                                            {getFormattedDateString(søknad.fom) +
                                                ' - ' +
                                                getFormattedDateString(søknad.tom)}
                                        </Checkbox>
                                        <Button
                                            as="a"
                                            href="#" // TODO: Bytt til faktisk søknadslenke
                                            variant="tertiary"
                                            size="small"
                                        >
                                            Se søknad
                                        </Button>
                                    </div>
                                ))}
                            </CheckboxGroup>
                        </div>
                    ))}
                <Button variant="tertiary" size="small" className="mt-4 mb-6" type="button">
                    Velg saksbehandlingsperiode manuelt
                </Button>
                <Button className="block" size="small" type="submit">
                    Start behandling
                </Button>
            </form>
        </SaksbildePanel>
    )
}
